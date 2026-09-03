from decimal import Decimal
from sqlalchemy import select
from app.core.config import get_settings
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import AuditLog, Category, Customer, Inventory, Product, PurchaseReceipt, PurchaseReceiptItem, StockMovement, User
from app.services.business import next_code

settings=get_settings()

def seed():
    if not settings.seed_demo_data: return
    db=SessionLocal()
    try:
        if db.execute(select(User).where(User.username=="admin")).scalar_one_or_none():
            print("Seed already exists; skip.");return
        users=[
            User(full_name="Nguyễn Quản Trị",username="admin",password_hash=hash_password(settings.demo_admin_password),role="ADMIN"),
            User(full_name="Trần Nhân Viên",username="sales",password_hash=hash_password(settings.demo_sales_password),role="SALES"),
            User(full_name="Lê Chủ Cửa Hàng",username="owner",password_hash=hash_password(settings.demo_owner_password),role="OWNER"),
        ];db.add_all(users);db.flush()
        cats=[Category(code="PHU_KIEN",name="Phụ kiện"),Category(code="THIET_BI",name="Thiết bị")];db.add_all(cats);db.flush()
        products=[
            Product(code="SP001",name="Tai nghe Bluetooth A1",category_id=cats[0].id,selling_price=Decimal("350000"),purchase_price=Decimal("245000"),description="Pin 20 giờ"),
            Product(code="SP002",name="Chuột không dây M2",category_id=cats[0].id,selling_price=Decimal("290000"),purchase_price=Decimal("190000")),
            Product(code="SP003",name="Bàn phím cơ K68",category_id=cats[1].id,selling_price=Decimal("890000"),purchase_price=Decimal("650000")),
            Product(code="SP004",name="Webcam Full HD C10",category_id=cats[1].id,selling_price=Decimal("720000"),purchase_price=Decimal("510000")),
            Product(code="SP005",name="Hub USB-C 6 in 1",category_id=cats[0].id,selling_price=Decimal("590000"),purchase_price=Decimal("410000")),
        ];db.add_all(products);db.flush()
        for p in products: db.add(Inventory(product_id=p.id,quantity=0))
        db.add_all([
            Customer(customer_code=next_code(db,"customer_code_seq","KH",6),full_name="Nguyễn Văn An",phone="0901234567",customer_group="Thân thiết"),
            Customer(customer_code=next_code(db,"customer_code_seq","KH",6),full_name="Trần Minh Anh",phone="0912345678",customer_group="Mới"),
            Customer(customer_code=next_code(db,"customer_code_seq","KH",6),full_name="Lê Thu Hà",phone="0987654321",customer_group="VIP"),
        ])
        receipt=PurchaseReceipt(receipt_code=next_code(db,"purchase_code_seq","PN",8),created_by=users[0].id,status="COMPLETED");db.add(receipt);db.flush()
        quantities=[40,25,15,10,8]
        for p,q in zip(products,quantities):
            db.add(PurchaseReceiptItem(purchase_receipt_id=receipt.id,product_id=p.id,quantity=q,unit_cost=p.purchase_price,product_code_snapshot=p.code,product_name_snapshot=p.name))
            inv=db.get(Inventory,p.id);inv.quantity=q
            db.add(StockMovement(product_id=p.id,movement_type="PURCHASE",quantity_delta=q,reference_type="PURCHASE_RECEIPT",reference_id=receipt.id,actor_id=users[0].id))
        db.add(AuditLog(user_id=users[0].id,action="SEED_PURCHASE",entity_type="PURCHASE_RECEIPT",entity_id=receipt.id,new_state="COMPLETED"))
        db.commit();print("Demo seed completed.")
    finally: db.close()

if __name__=="__main__": seed()
