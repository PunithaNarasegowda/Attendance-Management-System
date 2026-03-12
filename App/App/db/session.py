from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker, Session
from App.core.config import settings 
from typing import Generator
import base64
import ssl
if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is required. Configure MySQL connection in .env.")

def get_ssl_context():
    # 1. Get the Base64 string from your environment
    base64_cert = settings.CA_CERT_BASE64
    
    if not base64_cert:
        return None  # Or handle local non-SSL connection

    # 2. Decode the Base64 string to get the raw PEM text
    cert_text = base64.b64decode(base64_cert).decode("utf-8")

    # 3. Create a default SSL context
    ssl_context = ssl.create_default_context()
    print("SSL context created successfully." if ssl_context else "Failed to create SSL context.")
    # 4. Load the certificate from the string (memory) instead of a file
    ssl_context.load_verify_locations(cadata=cert_text)
    
    # Render/Aiven often require specific security settings
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_REQUIRED
    
    return ssl_context


def get_database_url():
    url = make_url(settings.DATABASE_URL)
    query = dict(url.query)

    # PyMySQL does not accept ssl-mode in connect_args. We already provide SSL explicitly.
    query.pop("ssl-mode", None)
    query.pop("sslmode", None)

    return url.set(query=query)

context = get_ssl_context()
database_url = get_database_url()

engine = create_engine(database_url,
                       pool_pre_ping=True, echo=False,
                       connect_args={"ssl": context} if context else {})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()