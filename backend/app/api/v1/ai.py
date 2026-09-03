import hashlib, time
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import current_user, require_roles
from app.models import AILog, Inventory, Product, User
from app.schemas import DateRangeIn, ProductAdviceIn, SalesQaIn

router=APIRouter(prefix="/ai",tags=["ai"]); settings=get_settings()

def log(db,user,typ,inp,out):
    db.add(AILog(user_id=user.id,request_type=typ,provider=settings.ai_provider,model=settings.ai_model or "deterministic-mock",prompt_version="v1",sanitized_input=inp,input_hash=hashlib.sha256(str(inp).encode()).hexdigest(),structured_output=out,validation_status="FALLBACK" if settings.ai_provider!="gemini" else "VALID",fallback_used=settings.ai_provider!="gemini",latency_ms=1));db.commit()

@router.post("/product-advice")
def product_advice(p:ProductAdviceIn,db:Session=Depends(get_db),me:User=Depends(current_user)):
    rows=db.execute(select(Product,Inventory).join(Inventory,Inventory.product_id==Product.id).options(joinedload(Product.category)).where(Product.is_active.is_(True),Inventory.quantity>0).order_by(Product.selling_price).limit(3)).all()
    out={"recommendations":[{"product_code":prod.code,"product_name":prod.name,"price":str(prod.selling_price),"stock":inv.quantity,"reason":"Sản phẩm đang hoạt động và còn hàng; đây là fallback deterministic."} for prod,inv in rows],"insufficient_data":not bool(rows),"note":"AI provider đang ở mock/fallback mode."};log(db,me,"PRODUCT_ADVICE",{"need":p.need[:200]},out);return out

@router.post("/revenue-summary")
def revenue_summary(p:DateRangeIn,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN","OWNER"))):
    from app.api.v1.queries import revenue
    facts=revenue(p.start_date,p.end_date,db,me);out={"summary":f"Doanh thu kỳ đã chọn là {facts['revenue']} VND từ {facts['invoice_count']} hóa đơn hoàn tất.","facts":facts,"fallback":True};log(db,me,"REVENUE_SUMMARY",p.model_dump(),out);return out

@router.post("/sales-qa")
def sales_qa(p:SalesQaIn,db:Session=Depends(get_db),me:User=Depends(require_roles("ADMIN","OWNER"))):
    out={"answer":"Chế độ mock chỉ trả lời trên dữ liệu đã được backend cho phép. Hãy dùng trang báo cáo để xem số liệu chính thức.","question":p.question,"fallback":True};log(db,me,"SALES_QA",{"question":p.question[:200]},out);return out
