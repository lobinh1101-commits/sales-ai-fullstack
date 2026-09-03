from fastapi import APIRouter
from app.api.v1 import ai, auth, master, queries, transactions
router=APIRouter(prefix="/api/v1")
router.include_router(auth.router)
router.include_router(master.router)
router.include_router(transactions.router)
router.include_router(queries.router)
router.include_router(ai.router)
