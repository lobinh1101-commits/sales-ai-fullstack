import hashlib, secrets
from datetime import datetime, timedelta, timezone
import jwt
from argon2 import PasswordHasher
from app.core.config import get_settings

_ph = PasswordHasher()
settings = get_settings()


def hash_password(password: str) -> str:
    return _ph.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    try:
        return _ph.verify(hashed, password)
    except Exception:
        return False


def create_access_token(user_id: int) -> tuple[str, int]:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    token = jwt.encode({"sub": str(user_id), "exp": exp, "type": "access"}, settings.jwt_secret, algorithm="HS256")
    return token, settings.access_token_minutes * 60


def decode_access_token(token: str) -> int:
    payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    if payload.get("type") != "access":
        raise ValueError("invalid token type")
    return int(payload["sub"])


def new_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()
