import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.api.v1 import router
from app.core.config import get_settings
from app.core.database import engine

settings=get_settings();app=FastAPI(title="Sales AI API",version="1.0.0")
app.add_middleware(CORSMiddleware,allow_origins=settings.cors_origin_list,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

@app.middleware("http")
async def request_id(request:Request,call_next):
    rid=request.headers.get("X-Request-ID") or str(uuid.uuid4());request.state.request_id=rid;resp=await call_next(request);resp.headers["X-Request-ID"]=rid;return resp


@app.exception_handler(HTTPException)
async def http_handler(request: Request, exc: HTTPException):
    code = str(exc.detail)
    messages = {
        "UNAUTHENTICATED": "Chưa xác thực hoặc phiên đăng nhập không hợp lệ.",
        "FORBIDDEN": "Bạn không có quyền thực hiện thao tác này.",
        "NOT_FOUND": "Không tìm thấy dữ liệu yêu cầu.",
        "INSUFFICIENT_STOCK": "Số lượng tồn kho không đủ.",
        "INVALID_STATE": "Trạng thái chứng từ không hợp lệ cho thao tác này.",
        "IDEMPOTENCY_KEY_REQUIRED": "Thiếu Idempotency-Key.",
    }
    return JSONResponse(status_code=exc.status_code, content={"error":{"code":code,"message":messages.get(code, code),"details":{},"request_id":getattr(request.state,"request_id",None)}})

@app.exception_handler(RequestValidationError)
async def validation_handler(request:Request,exc:RequestValidationError):
    return JSONResponse(status_code=422,content={"error":{"code":"INVALID_REQUEST","message":"Dữ liệu gửi lên không hợp lệ.","details":{"errors":exc.errors()},"request_id":getattr(request.state,"request_id",None)}})

@app.exception_handler(Exception)
async def generic_handler(request:Request,exc:Exception):
    return JSONResponse(status_code=500,content={"error":{"code":"INTERNAL_ERROR","message":"Lỗi hệ thống.","details":{},"request_id":getattr(request.state,"request_id",None)}})

@app.get("/api/v1/health/live")
def live(): return {"status":"ok"}
@app.get("/api/v1/health/ready")
def ready():
    with engine.connect() as c: c.execute(text("SELECT 1"))
    return {"status":"ready"}

app.include_router(router)
