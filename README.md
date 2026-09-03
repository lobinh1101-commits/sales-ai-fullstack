# Sales AI Fullstack

Bản này được làm từ giao diện `sales-ai-premium (2).zip`, giữ phần UI cần thiết và bổ sung CSDL + backend.

## Cấu trúc
- `frontend/`: React + TypeScript + Vite
- `backend/`: FastAPI + SQLAlchemy + Alembic
- PostgreSQL: CSDL chính
- `docker-compose.yml`: dựng DB -> migrate -> seed -> backend -> frontend

## Chạy nhanh bằng Docker
1. Cài Docker Desktop.
2. Copy `.env.example` thành `.env` (hoặc chạy `START_WINDOWS.bat` để tự copy).
3. Chạy `START_WINDOWS.bat` hoặc:
   `docker compose up --build`
4. Mở `http://localhost:8080`
5. API docs: `http://localhost:8080/api/docs` không proxy trực tiếp; khi dev backend có thể mở `http://localhost:8000/docs`.

## Tài khoản seed
- admin / Admin@12345
- sales / Sales@12345
- owner / Owner@12345

## Backend đã có
- Auth login/refresh/logout
- Users, categories, products, customers
- Invoice create/confirm/cancel
- Purchase receipt create/confirm
- Inventory + stock movement history
- Revenue/top/slow reports
- AI mock/fallback + AI logs
- Audit logs
- Alembic migration + seed PostgreSQL

## Lưu ý
Frontend gốc vẫn còn một số trang dùng dữ liệu trình diễn để giữ nguyên thiết kế hiện tại. Backend và CSDL đã được tách đúng kiến trúc và có API thật để nối dần từng trang. Không dùng dữ liệu demo frontend làm Source of Truth.
