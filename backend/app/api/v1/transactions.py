from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.deps import current_user, require_idempotency_key
from app.models import Invoice, PurchaseReceipt, User
from app.schemas import CancelIn, InvoiceIn, PurchaseIn
from app.services.business import cancel_invoice, confirm_invoice, confirm_purchase, create_invoice, create_purchase, serialize_invoice

router=APIRouter(tags=["transactions"])

@router.get("/invoices")
def list_invoices(page:int=1,page_size:int=20,db:Session=Depends(get_db),me:User=Depends(current_user)):
    stmt=select(Invoice).options(joinedload(Invoice.creator),joinedload(Invoice.customer)).order_by(Invoice.created_at.desc()).offset((page-1)*page_size).limit(page_size)
    rows=db.execute(stmt).unique().scalars().all();data=[serialize_invoice(x) for x in rows]
    return {"items":data,"page":page,"page_size":page_size,"total":len(data),"total_pages":1 if data else 0}

@router.get("/invoices/{iid}")
def invoice_detail(iid:int,db:Session=Depends(get_db),me:User=Depends(current_user)):
    x=db.execute(select(Invoice).options(joinedload(Invoice.items),joinedload(Invoice.creator),joinedload(Invoice.customer)).where(Invoice.id==iid)).unique().scalar_one_or_none()
    if not x: raise HTTPException(404,detail="NOT_FOUND")
    return serialize_invoice(x)

@router.post("/invoices",status_code=201)
def new_invoice(p:InvoiceIn,key:str=Depends(require_idempotency_key),db:Session=Depends(get_db),me:User=Depends(current_user)):
    return serialize_invoice(create_invoice(db,me,p))

@router.post("/invoices/{iid}/confirm")
def invoice_confirm(iid:int,key:str=Depends(require_idempotency_key),db:Session=Depends(get_db),me:User=Depends(current_user)):
    return serialize_invoice(confirm_invoice(db,me,iid))

@router.post("/invoices/{iid}/cancel")
def invoice_cancel(iid:int,p:CancelIn,key:str=Depends(require_idempotency_key),db:Session=Depends(get_db),me:User=Depends(current_user)):
    return serialize_invoice(cancel_invoice(db,me,iid,p.reason))

@router.get("/purchase-receipts")
def purchases(page:int=1,page_size:int=20,db:Session=Depends(get_db),me:User=Depends(current_user)):
    rows=db.execute(select(PurchaseReceipt).options(joinedload(PurchaseReceipt.items),joinedload(PurchaseReceipt.creator)).order_by(PurchaseReceipt.created_at.desc()).offset((page-1)*page_size).limit(page_size)).unique().scalars().all()
    data=[{"id":r.id,"receipt_code":r.receipt_code,"creator":r.creator.full_name,"created_by":r.created_by,"status":r.status,"total_quantity":sum(i.quantity for i in r.items),"created_at":r.created_at.isoformat(),"items":[{"product_id":i.product_id,"quantity":i.quantity,"unit_cost":str(i.unit_cost)} for i in r.items]} for r in rows]
    return {"items":data,"page":page,"page_size":page_size,"total":len(data),"total_pages":1 if data else 0}

@router.post("/purchase-receipts",status_code=201)
def new_purchase(p:PurchaseIn,key:str=Depends(require_idempotency_key),db:Session=Depends(get_db),me:User=Depends(current_user)):
    r=create_purchase(db,me,p);return {"id":r.id,"receipt_code":r.receipt_code,"status":r.status}

@router.post("/purchase-receipts/{rid}/confirm")
def purchase_confirm(rid:int,key:str=Depends(require_idempotency_key),db:Session=Depends(get_db),me:User=Depends(current_user)):
    r=confirm_purchase(db,me,rid);return {"id":r.id,"receipt_code":r.receipt_code,"status":r.status,"confirmed_at":r.confirmed_at.isoformat() if r.confirmed_at else None}
