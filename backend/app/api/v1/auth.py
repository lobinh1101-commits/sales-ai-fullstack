from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import create_access_token, new_refresh_token, token_hash, verify_password
from app.models import AuthSession, User
from app.schemas import LoginIn

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

@router.post("/login")
def login(payload: LoginIn, response: Response, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.username == payload.username.strip().lower())).scalar_one_or_none()
    if not user or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="UNAUTHENTICATED")
    access, expires = create_access_token(user.id)
    refresh = new_refresh_token()
    session = AuthSession(user_id=user.id, refresh_token_hash=token_hash(refresh), expires_at=datetime.now(timezone.utc)+timedelta(days=settings.refresh_token_days))
    db.add(session); db.commit()
    response.set_cookie("refresh_token", refresh, httponly=True, samesite="lax", secure=False, max_age=settings.refresh_token_days*86400, path="/api/v1/auth")
    return {"access_token": access, "token_type": "bearer", "expires_in": expires, "user": {"id": user.id, "full_name": user.full_name, "username": user.username, "role": user.role}}

@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    raw = request.cookies.get("refresh_token")
    if not raw: raise HTTPException(401, detail="UNAUTHENTICATED")
    old = db.execute(select(AuthSession).where(AuthSession.refresh_token_hash == token_hash(raw))).scalar_one_or_none()
    if not old or old.revoked_at or old.expires_at <= datetime.now(timezone.utc): raise HTTPException(401, detail="UNAUTHENTICATED")
    user = db.get(User, old.user_id)
    if not user or not user.is_active: raise HTTPException(401, detail="UNAUTHENTICATED")
    new_raw = new_refresh_token()
    new_sess = AuthSession(user_id=user.id, refresh_token_hash=token_hash(new_raw), expires_at=datetime.now(timezone.utc)+timedelta(days=settings.refresh_token_days))
    db.add(new_sess); db.flush(); old.revoked_at=datetime.now(timezone.utc); old.replaced_by_id=new_sess.id; db.commit()
    access, expires = create_access_token(user.id)
    response.set_cookie("refresh_token", new_raw, httponly=True, samesite="lax", secure=False, max_age=settings.refresh_token_days*86400, path="/api/v1/auth")
    return {"access_token": access, "token_type":"bearer", "expires_in":expires, "user":{"id":user.id,"full_name":user.full_name,"username":user.username,"role":user.role}}

@router.post("/logout", status_code=204)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    raw=request.cookies.get("refresh_token")
    if raw:
        s=db.execute(select(AuthSession).where(AuthSession.refresh_token_hash==token_hash(raw))).scalar_one_or_none()
        if s and not s.revoked_at: s.revoked_at=datetime.now(timezone.utc); db.commit()
    response.delete_cookie("refresh_token", path="/api/v1/auth")
