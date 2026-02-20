from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os, time
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

# --- Startup ---
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    # Rebalance orders if they are all 0 or colliding
    for model in [models.Technology, models.Project, models.Education]:
        items = db.query(model).order_by(model.order.asc(), model.id.asc()).all()
        for i, item in enumerate(items):
            item.order = i + 1
        db.commit()

# --- Technologies Routes ---
@app.post("/api/technologies", response_model=schemas.Technology)
def create_technology(tech: schemas.TechnologyCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    existing_tech = db.query(models.Technology).filter(models.Technology.technology == tech.technology).first()
    if existing_tech:
        raise HTTPException(status_code=400, detail="Technology already exists")
        
    # Get max order
    max_order = db.query(func.max(models.Technology.order)).scalar() or 0
    db_tech = models.Technology(technology=tech.technology, category=tech.category, order=max_order + 1)
    db.add(db_tech)
    db.commit()
    db.refresh(db_tech)
    return db_tech

@app.get("/api/technologies", response_model=List[schemas.Technology])
def read_technologies(db: Session = Depends(get_db)):
    return db.query(models.Technology).order_by(models.Technology.order.asc(), models.Technology.id.asc()).all()

@app.put("/api/technologies/{tech_id}", response_model=schemas.Technology)
def update_technology(tech_id: int, tech: schemas.TechnologyCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_tech = db.query(models.Technology).filter(models.Technology.id == tech_id).first()
    if not db_tech:
        raise HTTPException(status_code=404, detail="Technology not found")
    
    # Exclude order from update
    tech_data = tech.dict(exclude={"order"})
    for key, value in tech_data.items():
        setattr(db_tech, key, value)
        
    db.commit()
    db.refresh(db_tech)
    return db_tech

@app.post("/api/technologies/{tech_id}/move")
def move_technology(tech_id: int, direction: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    tech = db.query(models.Technology).filter(models.Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technology not found")

    if direction == "up":
        target = db.query(models.Technology).filter(models.Technology.order < tech.order)\
                   .order_by(models.Technology.order.desc()).first()
    elif direction == "down":
        target = db.query(models.Technology).filter(models.Technology.order > tech.order)\
                   .order_by(models.Technology.order.asc()).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid direction")

    if target:
        tech.order, target.order = target.order, tech.order
        db.commit()
    
    return {"ok": True}

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
    project_data = project.dict(exclude={"tech_stack_ids", "order"}) # Order handled manually
    
    # Get max order
    max_order = db.query(func.max(models.Project.order)).scalar() or 0
    project_data['order'] = max_order + 1
    
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
    return db.query(models.Project).order_by(models.Project.order.asc(), models.Project.id.asc()).all()

@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    project_data = project.dict(exclude={"tech_stack_ids", "order"}) # Exclude order
    for key, value in project_data.items():
        setattr(db_project, key, value)
        
    # Update tech stack
    technologies = db.query(models.Technology).filter(models.Technology.id.in_(project.tech_stack_ids)).all()
    db_project.tech_stack = technologies

    db.commit()
    db.refresh(db_project)
    return db_project

@app.post("/api/projects/{project_id}/move")
def move_project(project_id: int, direction: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if direction == "up":
        target = db.query(models.Project).filter(models.Project.order < project.order)\
                   .order_by(models.Project.order.desc()).first()
    elif direction == "down":
        target = db.query(models.Project).filter(models.Project.order > project.order)\
                   .order_by(models.Project.order.asc()).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid direction")

    if target:
        project.order, target.order = target.order, project.order
        db.commit()
    
    return {"ok": True}

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
    # Get max order
    max_order = db.query(func.max(models.Education.order)).scalar() or 0
    
    db_edu = models.Education(**edu.dict(exclude={"order"}), order=max_order + 1)
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@app.get("/api/edu", response_model=List[schemas.Education])
def read_education(db: Session = Depends(get_db)):
    return db.query(models.Education).order_by(models.Education.order.asc(), models.Education.id.asc()).all()

@app.put("/api/edu/{edu_id}", response_model=schemas.Education)
def update_education(edu_id: int, edu: schemas.EducationCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    db_edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education not found")
        
    for key, value in edu.dict(exclude={"order"}).items():
        setattr(db_edu, key, value)
        
    db.commit()
    db.refresh(db_edu)
    return db_edu

@app.post("/api/edu/{edu_id}/move")
def move_education(edu_id: int, direction: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    edu = db.query(models.Education).filter(models.Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")

    if direction == "up":
        target = db.query(models.Education).filter(models.Education.order < edu.order)\
                   .order_by(models.Education.order.desc()).first()
    elif direction == "down":
        target = db.query(models.Education).filter(models.Education.order > edu.order)\
                   .order_by(models.Education.order.asc()).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid direction")

    if target:
        edu.order, target.order = target.order, edu.order
        db.commit()
    
    return {"ok": True}

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
