import base64
import re
import ssl
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from App.core.config import settings

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is required. Configure MySQL connection in .env.")

# Strip unsupported ssl-mode query param — SSL is handled via connect_args instead
_db_url = re.sub(r"[?&]ssl[-_]mode=[^&]*", "", settings.DATABASE_URL).rstrip("?&")

# Build SSL connect args from the base64-encoded CA cert if provided
_connect_args: dict = {}
if settings.CA_CERT_BASE64:
    decoded_cert = base64.b64decode(settings.CA_CERT_BASE64).decode("utf-8")
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.load_verify_locations(cadata=decoded_cert)
    _connect_args = {"ssl": ssl_ctx}

engine = create_engine(_db_url, pool_pre_ping=True, echo=False, connect_args=_connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()