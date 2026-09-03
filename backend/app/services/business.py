from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from fastapi import HTTPException
from sqlalchemy import select, text
from sqlalchemy.orm import Session, joinedload
from app.models import AuditLog, Category, Customer, Inventory, Invoice, InvoiceItem, Product, PurchaseReceipt, PurchaseReceiptItem, StockMovement, User

TWOPLACES = Decimal("0.01")

def money(v: Decimal) -> Decimal:
    return Decimal(v).quantize(TWOPLACES, rounding=ROUND_HALF_UP)

def next_code(db: Session, seq: str, prefix: str, width: int) -> str:
    n = db.execute(text(f"SELECT nextval('{seq}')")).scalar_one()
    return f"{prefix}{n:0{width}d}"

def normalize_lines(items):
    agg = defaultdict(int)
    for i in items:
        agg[i.product_id] += i.quantity
    return sorted(agg.items())

def serialize_invoice(inv: Invoice) -> dict:
    return {
        "id": inv.id, "invoice_code": inv.invoice_code,
        "customer": inv.customer.full_name if inv.customer else "Khách lẻ",
        "customer_id": inv.customer_id,
        "creator": inv.creator.full_name if inv.creator else "",
        "created_by": inv.created_by,
        "subtotal": str(inv.subtotal), "discount_amount": str(inv.discount_amount), "total_amount": str(inv.total_amount),
        "payment_method": inv.payment_method, "status": inv.status,
        "created_at": inv.created_at.isoformat() if inv.created_at else None,
        "items": [{"product_id": x.product_id, "quantity": x.quantity, "unit_price": str(x.unit_price), "product_code": x.product_code_snapshot, "product_name": x.product_name_snapshot} for x in inv.items],
    }

def create_invoice(db: Session, user: User, payload) -> Invoice:
    if user.role != "SALES": raise HTTPException(403, detail="FORBIDDEN")
    lines = normalize_lines(payload.items)
    if not lines: raise HTTPException(422, detail="INVALID_REQUEST")
    if payload.payment_method not in (None, "CASH", "BANK_TRANSFER", "CARD"): raise HTTPException(422, detail="INVALID_PAYMENT_METHOD")
    if payload.customer_id:
        c = db.get(Customer, payload.customer_id)
        if not c or not c.is_active: raise HTTPException(422, detail="INVALID_CUSTOMER")
    inv = Invoice(invoice_code=next_code(db, "invoice_code_seq", "HD", 8), created_by=user.id, customer_id=payload.customer_id, discount_amount=money(payload.discount_amount), payment_method=payload.payment_method)
    db.add(inv); db.flush()
    subtotal = Decimal("0")
    for pid, qty in lines:
        p = db.execute(select(Product).options(joinedload(Product.category)).where(Product.id == pid)).scalar_one_or_none()
        if not p or not p.is_active: raise HTTPException(422, detail="INACTIVE_PRODUCT")
        price = money(p.selling_price); subtotal += price * qty
        db.add(InvoiceItem(invoice_id=inv.id, product_id=p.id, quantity=qty, unit_price=price, product_code_snapshot=p.code, product_name_snapshot=p.name, category_id_snapshot=p.category_id, category_name_snapshot=p.category.name))
    subtotal = money(subtotal)
    if inv.discount_amount > subtotal: raise HTTPException(422, detail="DISCOUNT_EXCEEDS_SUBTOTAL")
    inv.subtotal = subtotal; inv.total_amount = money(subtotal - inv.discount_amount)
    db.add(AuditLog(user_id=user.id, action="CREATE_INVOICE", entity_type="INVOICE", entity_id=inv.id, new_state="DRAFT"))
    db.commit(); db.refresh(inv)
    return db.execute(select(Invoice).options(joinedload(Invoice.items), joinedload(Invoice.creator), joinedload(Invoice.customer)).where(Invoice.id == inv.id)).unique().scalar_one()

def confirm_invoice(db: Session, user: User, invoice_id: int) -> Invoice:
    if user.role != "SALES": raise HTTPException(403, detail="FORBIDDEN")
    inv = db.execute(select(Invoice).options(joinedload(Invoice.items)).where(Invoice.id == invoice_id).with_for_update()).unique().scalar_one_or_none()
    if not inv: raise HTTPException(404, detail="NOT_FOUND")
    if inv.status != "DRAFT": raise HTTPException(409, detail="INVALID_STATE")
    if not inv.payment_method: raise HTTPException(422, detail="INVALID_PAYMENT_METHOD")
    pids = sorted([x.product_id for x in inv.items])
    stocks = db.execute(select(Inventory).where(Inventory.product_id.in_(pids)).order_by(Inventory.product_id).with_for_update()).scalars().all()
    stock_map = {s.product_id: s for s in stocks}
    subtotal = Decimal("0")
    for item in sorted(inv.items, key=lambda x: x.product_id):
        p = db.execute(select(Product).options(joinedload(Product.category)).where(Product.id == item.product_id)).scalar_one_or_none()
        if not p or not p.is_active: raise HTTPException(422, detail="INACTIVE_PRODUCT")
        stock = stock_map.get(p.id)
        if not stock or stock.quantity < item.quantity: raise HTTPException(409, detail="INSUFFICIENT_STOCK")
        item.unit_price = money(p.selling_price); item.product_code_snapshot = p.code; item.product_name_snapshot = p.name; item.category_id_snapshot = p.category_id; item.category_name_snapshot = p.category.name
        subtotal += item.unit_price * item.quantity
    subtotal = money(subtotal)
    if inv.discount_amount > subtotal: raise HTTPException(422, detail="DISCOUNT_EXCEEDS_SUBTOTAL")
    inv.subtotal = subtotal; inv.total_amount = money(subtotal - inv.discount_amount)
    for item in inv.items:
        stock = stock_map[item.product_id]; stock.quantity -= item.quantity
        db.add(StockMovement(product_id=item.product_id, movement_type="SALE", quantity_delta=-item.quantity, reference_type="INVOICE", reference_id=inv.id, actor_id=user.id))
    inv.status = "COMPLETED"; inv.completed_at = datetime.now(timezone.utc)
    db.add(AuditLog(user_id=user.id, action="CONFIRM_INVOICE", entity_type="INVOICE", entity_id=inv.id, previous_state="DRAFT", new_state="COMPLETED"))
    db.commit()
    return db.execute(select(Invoice).options(joinedload(Invoice.items), joinedload(Invoice.creator), joinedload(Invoice.customer)).where(Invoice.id == inv.id)).unique().scalar_one()

def cancel_invoice(db: Session, user: User, invoice_id: int, reason: str) -> Invoice:
    if user.role != "ADMIN": raise HTTPException(403, detail="FORBIDDEN")
    inv = db.execute(select(Invoice).options(joinedload(Invoice.items)).where(Invoice.id == invoice_id).with_for_update()).unique().scalar_one_or_none()
    if not inv: raise HTTPException(404, detail="NOT_FOUND")
    if inv.status != "COMPLETED": raise HTTPException(409, detail="INVALID_STATE")
    pids = sorted([x.product_id for x in inv.items])
    stocks = {s.product_id: s for s in db.execute(select(Inventory).where(Inventory.product_id.in_(pids)).order_by(Inventory.product_id).with_for_update()).scalars()}
    for item in inv.items:
        stocks[item.product_id].quantity += item.quantity
        db.add(StockMovement(product_id=item.product_id, movement_type="SALE_CANCEL", quantity_delta=item.quantity, reference_type="INVOICE", reference_id=inv.id, actor_id=user.id))
    inv.status="CANCELLED"; inv.cancelled_at=datetime.now(timezone.utc); inv.cancelled_by=user.id; inv.cancel_reason=reason
    db.add(AuditLog(user_id=user.id, action="CANCEL_INVOICE", entity_type="INVOICE", entity_id=inv.id, previous_state="COMPLETED", new_state="CANCELLED", reason=reason))
    db.commit()
    return db.execute(select(Invoice).options(joinedload(Invoice.items), joinedload(Invoice.creator), joinedload(Invoice.customer)).where(Invoice.id == inv.id)).unique().scalar_one()

def create_purchase(db: Session, user: User, payload) -> PurchaseReceipt:
    if user.role not in ("ADMIN","SALES"): raise HTTPException(403, detail="FORBIDDEN")
    if not payload.items: raise HTTPException(422, detail="INVALID_REQUEST")
    r = PurchaseReceipt(receipt_code=next_code(db, "purchase_code_seq", "PN", 8), created_by=user.id)
    db.add(r); db.flush()
    seen=set()
    for line in payload.items:
        if line.product_id in seen: raise HTTPException(422, detail="DUPLICATE_PRODUCT")
        seen.add(line.product_id)
        p=db.get(Product,line.product_id)
        if not p or not p.is_active: raise HTTPException(422, detail="INACTIVE_PRODUCT")
        db.add(PurchaseReceiptItem(purchase_receipt_id=r.id, product_id=p.id, quantity=line.quantity, unit_cost=money(line.unit_cost), product_code_snapshot=p.code, product_name_snapshot=p.name))
    db.add(AuditLog(user_id=user.id, action="CREATE_PURCHASE", entity_type="PURCHASE_RECEIPT", entity_id=r.id, new_state="DRAFT"))
    db.commit(); return db.execute(select(PurchaseReceipt).options(joinedload(PurchaseReceipt.items), joinedload(PurchaseReceipt.creator)).where(PurchaseReceipt.id==r.id)).unique().scalar_one()

def confirm_purchase(db: Session, user: User, rid: int) -> PurchaseReceipt:
    if user.role not in ("ADMIN","SALES"): raise HTTPException(403, detail="FORBIDDEN")
    r=db.execute(select(PurchaseReceipt).options(joinedload(PurchaseReceipt.items)).where(PurchaseReceipt.id==rid).with_for_update()).unique().scalar_one_or_none()
    if not r: raise HTTPException(404, detail="NOT_FOUND")
    if r.status!="DRAFT": raise HTTPException(409, detail="INVALID_STATE")
    pids=sorted([x.product_id for x in r.items]); stocks={s.product_id:s for s in db.execute(select(Inventory).where(Inventory.product_id.in_(pids)).order_by(Inventory.product_id).with_for_update()).scalars()}
    for item in r.items:
        p=db.get(Product,item.product_id)
        if not p or not p.is_active: raise HTTPException(422, detail="INACTIVE_PRODUCT")
        item.product_code_snapshot=p.code; item.product_name_snapshot=p.name
        stocks[p.id].quantity += item.quantity; p.purchase_price=money(item.unit_cost)
        db.add(StockMovement(product_id=p.id,movement_type="PURCHASE",quantity_delta=item.quantity,reference_type="PURCHASE_RECEIPT",reference_id=r.id,actor_id=user.id))
    r.status="COMPLETED"; r.confirmed_at=datetime.now(timezone.utc)
    db.add(AuditLog(user_id=user.id, action="CONFIRM_PURCHASE", entity_type="PURCHASE_RECEIPT", entity_id=r.id, previous_state="DRAFT", new_state="COMPLETED"))
    db.commit(); return db.execute(select(PurchaseReceipt).options(joinedload(PurchaseReceipt.items), joinedload(PurchaseReceipt.creator)).where(PurchaseReceipt.id==r.id)).unique().scalar_one()
