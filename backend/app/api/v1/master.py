from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.deps import current_user, require_roles
from app.core.security import hash_password
from app.models import Category, Customer, Inventory, Product, User
from app.schemas import CategoryIn, CustomerIn, ProductIn, ProductUpdate, StatusIn, UserCreate
from app.services.business import next_code

router=APIRouter(tags=["master-data"])

def page(items, page:int, page_size:int, total:int): return {"items":items,"page":page,"page_size":page_size,"total":total,"total_pages": (total+page_size-1)//page_size if total else 0}

@router.get("/users")
def users(page_num:int=Query(1,alias="page"), page_size:int=20, q:str="", db:Session=Depends(get_db), me:User=Depends(require_roles("ADMIN","OWNER"))):
    stmt=select(User)
    if q: stmt=stmt.where(or_(User.full_name.ilike(f"%{q}%"),User.username.ilike(f"%{q}%")))
    rows=db.execute(stmt.order_by(User.id).offset((page_num-1)*page_size).limit(page_size)).scalars().all()
    return page([{"id":u.id,"full_name":u.full_name,"username":u.username,"role":u.role,"is_active":u.is_active} for u in rows],page_num,page_size,len(rows))

@router.post("/users",status_code=201)
def create_user(p:UserCreate,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN"))):
    if p.role not in ("ADMIN","SALES","OWNER"): raise HTTPException(422,detail="INVALID_ROLE")
    if db.execute(select(User).where(User.username==p.username)).scalar_one_or_none(): raise HTTPException(409,detail="DUPLICATE_CODE")
    u=User(full_name=p.full_name,username=p.username,password_hash=hash_password(p.password),role=p.role);db.add(u);db.commit();db.refresh(u)
    return {"id":u.id,"full_name":u.full_name,"username":u.username,"role":u.role,"is_active":u.is_active}

@router.patch("/users/{uid}/status")
def user_status(uid:int,p:StatusIn,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN"))):
    u=db.get(User,uid)
    if not u: raise HTTPException(404,detail="NOT_FOUND")
    if u.role=="ADMIN" and not p.is_active:
        count=len(db.execute(select(User).where(User.role=="ADMIN",User.is_active.is_(True))).scalars().all())
        if count<=1: raise HTTPException(409,detail="LAST_ADMIN")
    u.is_active=p.is_active;db.commit();return {"id":u.id,"is_active":u.is_active}

@router.get("/categories")
def categories(db:Session=Depends(get_db),me:User=Depends(current_user)):
    rows=db.execute(select(Category).order_by(Category.name)).scalars().all();return {"items":[{"id":x.id,"code":x.code,"name":x.name,"is_active":x.is_active} for x in rows],"page":1,"page_size":len(rows),"total":len(rows),"total_pages":1 if rows else 0}

@router.post("/categories",status_code=201)
def create_category(p:CategoryIn,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN"))):
    code=p.code.upper()
    if db.execute(select(Category).where(Category.code==code)).scalar_one_or_none(): raise HTTPException(409,detail="DUPLICATE_CODE")
    x=Category(code=code,name=p.name,is_active=p.is_active);db.add(x);db.commit();db.refresh(x);return {"id":x.id,"code":x.code,"name":x.name,"is_active":x.is_active}

@router.get("/products")
def products(page_num:int=Query(1,alias="page"),page_size:int=20,q:str="",category_id:int|None=None,is_active:bool|None=None,db:Session=Depends(get_db),me:User=Depends(current_user)):
    stmt=select(Product).options(joinedload(Product.category),joinedload(Product.inventory))
    if q: stmt=stmt.where(or_(Product.code.ilike(f"%{q}%"),Product.name.ilike(f"%{q}%")))
    if category_id: stmt=stmt.where(Product.category_id==category_id)
    if is_active is not None: stmt=stmt.where(Product.is_active==is_active)
    rows=db.execute(stmt.order_by(Product.id).offset((page_num-1)*page_size).limit(page_size)).unique().scalars().all()
    data=[{"id":p.id,"code":p.code,"name":p.name,"category_id":p.category_id,"category_name":p.category.name,"selling_price":str(p.selling_price),"purchase_price":str(p.purchase_price),"description":p.description,"is_active":p.is_active,"stock_quantity":p.inventory.quantity if p.inventory else 0} for p in rows]
    return page(data,page_num,page_size,len(data))

@router.post("/products",status_code=201)
def create_product(p:ProductIn,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN"))):
    code=p.code.upper();cat=db.get(Category,p.category_id)
    if not cat or not cat.is_active: raise HTTPException(422,detail="INVALID_CATEGORY")
    if db.execute(select(Product).where(Product.code==code)).scalar_one_or_none(): raise HTTPException(409,detail="DUPLICATE_CODE")
    x=Product(code=code,name=p.name,category_id=p.category_id,selling_price=p.selling_price,purchase_price=p.purchase_price,description=p.description,is_active=p.is_active);db.add(x);db.flush();db.add(Inventory(product_id=x.id,quantity=0));db.commit();db.refresh(x);return {"id":x.id,"code":x.code}

@router.put("/products/{pid}")
def update_product(pid:int,p:ProductUpdate,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN"))):
    x=db.get(Product,pid);cat=db.get(Category,p.category_id)
    if not x: raise HTTPException(404,detail="NOT_FOUND")
    if not cat or not cat.is_active: raise HTTPException(422,detail="INVALID_CATEGORY")
    x.name=p.name;x.category_id=p.category_id;x.selling_price=p.selling_price;x.purchase_price=p.purchase_price;x.description=p.description;x.is_active=p.is_active;db.commit();return {"id":x.id,"code":x.code}

@router.get("/customers")
def customers(page_num:int=Query(1,alias="page"),page_size:int=20,q:str="",db:Session=Depends(get_db),me:User=Depends(current_user)):
    stmt=select(Customer)
    if q: stmt=stmt.where(or_(Customer.customer_code.ilike(f"%{q}%"),Customer.full_name.ilike(f"%{q}%"),Customer.phone.ilike(f"%{q}%")))
    rows=db.execute(stmt.order_by(Customer.id).offset((page_num-1)*page_size).limit(page_size)).scalars().all()
    data=[{"id":c.id,"customer_code":c.customer_code,"full_name":c.full_name,"phone":c.phone,"email":c.email,"customer_group":c.customer_group,"is_active":c.is_active} for c in rows]
    return page(data,page_num,page_size,len(data))

@router.post("/customers",status_code=201)
def create_customer(p:CustomerIn,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN","SALES"))):
    c=Customer(customer_code=next_code(db,"customer_code_seq","KH",6),full_name=p.full_name,phone=p.phone,email=str(p.email) if p.email else None,customer_group=p.customer_group);db.add(c);db.commit();db.refresh(c);return {"id":c.id,"customer_code":c.customer_code}
