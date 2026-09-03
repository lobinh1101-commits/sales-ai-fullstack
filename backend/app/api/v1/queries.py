from datetime import date, datetime, time, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.deps import current_user, require_roles
from app.models import AILog, AuditLog, Inventory, Invoice, InvoiceItem, Product, StockMovement, User

router=APIRouter(tags=["queries"])

def parse_range(start_date:str|None,end_date:str|None):
    if not start_date or not end_date: return None,None
    return datetime.combine(date.fromisoformat(start_date),time.min,tzinfo=timezone.utc),datetime.combine(date.fromisoformat(end_date),time.min,tzinfo=timezone.utc)

@router.get("/inventory")
def inventory(page:int=1,page_size:int=20,q:str="",db:Session=Depends(get_db),me:User=Depends(current_user)):
    stmt=select(Inventory).options(joinedload(Inventory.product).joinedload(Product.category)).join(Product)
    if q: stmt=stmt.where((Product.code.ilike(f"%{q}%")) | (Product.name.ilike(f"%{q}%")))
    rows=db.execute(stmt.order_by(Product.id).offset((page-1)*page_size).limit(page_size)).unique().scalars().all()
    data=[{"product_id":x.product_id,"product_code":x.product.code,"product_name":x.product.name,"category_name":x.product.category.name,"quantity":x.quantity,"updated_at":x.updated_at.isoformat()} for x in rows]
    return {"items":data,"page":page,"page_size":page_size,"total":len(data),"total_pages":1 if data else 0}

@router.get("/inventory/history")
def inventory_history(product_id:int|None=None,page:int=1,page_size:int=20,db:Session=Depends(get_db),me:User=Depends(current_user)):
    stmt=select(StockMovement,Product).join(Product,Product.id==StockMovement.product_id)
    if product_id: stmt=stmt.where(StockMovement.product_id==product_id)
    rows=db.execute(stmt.order_by(StockMovement.created_at.desc()).offset((page-1)*page_size).limit(page_size)).all()
    data=[{"id":m.id,"product_id":m.product_id,"product_code":p.code,"movement_type":m.movement_type,"quantity_delta":m.quantity_delta,"reference_type":m.reference_type,"reference_id":m.reference_id,"actor_id":m.actor_id,"created_at":m.created_at.isoformat()} for m,p in rows]
    return {"items":data,"page":page,"page_size":page_size,"total":len(data),"total_pages":1 if data else 0}

@router.get("/reports/revenue")
def revenue(start_date:str|None=None,end_date:str|None=None,db:Session=Depends(get_db),me:User=Depends(current_user)):
    s,e=parse_range(start_date,end_date);stmt=select(Invoice).where(Invoice.status=="COMPLETED")
    if me.role=="SALES": stmt=stmt.where(Invoice.created_by==me.id)
    if s: stmt=stmt.where(Invoice.completed_at>=s)
    if e: stmt=stmt.where(Invoice.completed_at<e)
    rows=db.execute(stmt).scalars().all()
    return {"start_date":start_date,"end_date":end_date,"revenue":str(sum((x.total_amount for x in rows),start=0)),"invoice_count":len(rows)}

@router.get("/reports/top-products")
def top_products(start_date:str|None=None,end_date:str|None=None,limit:int=10,db:Session=Depends(get_db),me:User=Depends(current_user)):
    s,e=parse_range(start_date,end_date)
    stmt=select(InvoiceItem.product_id,InvoiceItem.product_name_snapshot,func.sum(InvoiceItem.quantity).label("qty"),func.sum(InvoiceItem.quantity*InvoiceItem.unit_price).label("revenue")).join(Invoice,Invoice.id==InvoiceItem.invoice_id).where(Invoice.status=="COMPLETED")
    if me.role=="SALES": stmt=stmt.where(Invoice.created_by==me.id)
    if s: stmt=stmt.where(Invoice.completed_at>=s)
    if e: stmt=stmt.where(Invoice.completed_at<e)
    rows=db.execute(stmt.group_by(InvoiceItem.product_id,InvoiceItem.product_name_snapshot).order_by(func.sum(InvoiceItem.quantity).desc(),func.sum(InvoiceItem.quantity*InvoiceItem.unit_price).desc(),InvoiceItem.product_id).limit(limit)).all()
    return {"items":[{"product_id":r[0],"product_name":r[1],"quantity_sold":int(r[2]),"revenue":str(r[3])} for r in rows]}

@router.get("/reports/slow-products")
def slow_products(limit:int=10,db:Session=Depends(get_db),me:User=Depends(current_user)):
    sold=select(InvoiceItem.product_id,func.coalesce(func.sum(InvoiceItem.quantity),0).label("qty")).join(Invoice,Invoice.id==InvoiceItem.invoice_id).where(Invoice.status=="COMPLETED").group_by(InvoiceItem.product_id).subquery()
    rows=db.execute(select(Product.id,Product.name,func.coalesce(sold.c.qty,0)).outerjoin(sold,sold.c.product_id==Product.id).where(Product.is_active.is_(True)).order_by(func.coalesce(sold.c.qty,0).asc(),Product.id).limit(limit)).all()
    return {"items":[{"product_id":r[0],"product_name":r[1],"quantity_sold":int(r[2])} for r in rows]}

@router.get("/audit-logs")
def audit_logs(page:int=1,page_size:int=20,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN","OWNER"))):
    rows=db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).offset((page-1)*page_size).limit(page_size)).scalars().all()
    data=[{"id":x.id,"user_id":x.user_id,"action":x.action,"entity_type":x.entity_type,"entity_id":x.entity_id,"previous_state":x.previous_state,"new_state":x.new_state,"reason":x.reason,"created_at":x.created_at.isoformat()} for x in rows]
    return {"items":data,"page":page,"page_size":page_size,"total":len(data),"total_pages":1 if data else 0}

@router.get("/ai/logs")
def ai_logs(page:int=1,page_size:int=20,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN","OWNER"))):
    rows=db.execute(select(AILog).order_by(AILog.created_at.desc()).offset((page-1)*page_size).limit(page_size)).scalars().all()
    return {"items":[{"id":x.id,"request_type":x.request_type,"provider":x.provider,"model":x.model,"validation_status":x.validation_status,"fallback_used":x.fallback_used,"latency_ms":x.latency_ms,"created_at":x.created_at.isoformat()} for x in rows],"page":page,"page_size":page_size,"total":len(rows),"total_pages":1 if rows else 0}
