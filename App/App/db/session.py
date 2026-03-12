import base64
import re
import ssl
from collections.abc import Generator

from sqlalchemy import create_engine
<<<<<<< HEAD
from sqlalchemy.orm import Session, sessionmaker

from App.core.config import settings
=======
from sqlalchemy.orm import sessionmaker, Session
from App.core.config import settings 
import os
import tempfile
>>>>>>> 5b034c7b66f64ffaac6567dc3ff39466280bc4b2

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is required. Configure MySQL connection in .env.")

<<<<<<< HEAD
# Strip unsupported ssl-mode query param — SSL is handled via connect_args instead
_db_url = re.sub(r"[?&]ssl[-_]mode=[^&]*", "", settings.DATABASE_URL).rstrip("?&")
=======
ca_cert_content = os.getenv("MYSQL_CA_CERT")

# 2. Create a temporary file to hold the cert during runtime
if ca_cert_content:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pem") as temp_ca:
        temp_ca.write(ca_cert_content.encode("utf-8"))
        ca_path = temp_ca.name
else:
    # Fallback for local dev if file exists
    ca_path = "./ca.pem"

# 3. Update the Connection String with the dynamic path
# Note: Using 'ssl_ca' parameter for the pymysql driver
connect_args = {
    "ssl": {
        "ca": ca_path
    }
}

engine = create_engine(settings.DATABASE_URL,
                       connect_args=connect_args,
                       pool_pre_ping=True,
                       echo=False)
>>>>>>> 5b034c7b66f64ffaac6567dc3ff39466280bc4b2

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