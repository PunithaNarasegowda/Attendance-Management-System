import os 
from pydantic_settings import BaseSettings 
from dotenv import load_dotenv 

env_path = ".env.dev" if os.path.exists(".env.dev") else None 
load_dotenv(dotenv_path=env_path) 

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME")
    DATABASE_URL: str = os.getenv("DATABASE_URL") 
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")  
    
    class Config:
        case_sensitive = True 
        
settings = Settings()