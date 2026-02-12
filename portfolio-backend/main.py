from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import uuid
import shutil


import models
import schemas
from database import engine, get_db

# --- Security Config ---
SECRET_KEY = "your-secret-key-must-be-very-secret" # Change this!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ADMIN_USERNAME = "Dhairya"
ADMIN_PASSWORD = "123" # In production, hash this!

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    if username != ADMIN_USERNAME:
        raise credentials_exception
    return username

# --- Auth Routes ---
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- Personal Detail Routes ---
@app.post("/api/me", response_model=schemas.PersonalDetail)
def create_or_update_personal_detail(detail: schemas.PersonalDetailCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    existing = db.query(models.PersonalDetail).first()
    if existing:
        for key, value in detail.dict().items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    
    db_detail = models.PersonalDetail(**detail.dict())
    db.add(db_detail)
    db.commit()
    db.refresh(db_detail)
    return db_detail

@app.get("/api/me", response_model=schemas.PersonalDetail)
def read_personal_detail(db: Session = Depends(get_db)):
    detail = db.query(models.PersonalDetail).first()
    if detail is None:
        raise HTTPException(status_code=404, detail="Personal details not found")
    return detail

# --- Technologies Routes ---
@app.post("/api/technologies", response_model=schemas.Technology)
def create_technology(tech: schemas.TechnologyCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    existing_tech = db.query(models.Technology).filter(models.Technology.technology == tech.technology).first()
    if existing_tech:
        raise HTTPException(status_code=400, detail="Technology already exists")
        
    db_tech = models.Technology(technology=tech.technology, category=tech.category)
    db.add(db_tech)
    db.commit()
    db.refresh(db_tech)
    return db_tech

@app.get("/api/technologies", response_model=List[schemas.Technology])
def read_technologies(db: Session = Depends(get_db)):
    return db.query(models.Technology).all()

@app.delete("/api/technologies/{tech_id}")
def delete_technology(tech_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    tech = db.query(models.Technology).filter(models.Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")
    db.delete(tech)
    db.commit()
    return {"ok": True}

# --- Projects Routes ---
@app.post("/api/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    project_data = project.dict(exclude={"tech_stack_ids"})
    db_project = models.Project(**project_data)
    
    if project.tech_stack_ids:
        technologies = db.query(models.Technology).filter(models.Technology.id.in_(project.tech_stack_ids)).all()
        db_project.tech_stack = technologies

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/api/projects", response_model=List[schemas.Project])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"ok": True}

# --- Education Routes ---
@app.post("/api/edu", response_model=schemas.Education)
def create_education(edu: schemas.EducationCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_edu = models.Education(**edu.dict())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@app.get("/api/edu", response_model=List[schemas.Education])
def read_education(db: Session = Depends(get_db)):
    return db.query(models.Education).all()

@app.delete("/api/edu/{edu_id}")
def delete_education(edu_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(edu)
    db.commit()
    return {"ok": True}

# --- Contact Routes ---
@app.post("/api/contact", response_model=schemas.Contact)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@app.get("/api/contact", response_model=List[schemas.Contact])
def read_contacts(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return db.query(models.Contact).all()

@app.delete("/api/contact/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"ok": True}


# --- File Upload Route ---
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    file_extension = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{new_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{new_filename}"}

# Mount Admin Dashboard and Uploads
app.mount("/admin", StaticFiles(directory="admin", html=True), name="admin")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
