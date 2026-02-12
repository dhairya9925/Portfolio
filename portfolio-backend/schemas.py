from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class CategoryEnumSchema(str, Enum):
    Language = "Language"
    Framework_Library = "Framework/Library"
    Dev_Tool = "Dev Tool"
    Database = "Database"

class ProjectTypeEnumSchema(str, Enum):
    Hobby = "Hobby"
    Professional = "Professional"
    Open_Source = "Open Source"

# --- Technology Schemas ---
class TechnologyBase(BaseModel):
    technology: str
    category: CategoryEnumSchema

class TechnologyCreate(TechnologyBase):
    pass

class Technology(TechnologyBase):
    id: int

    class Config:
        orm_mode = True

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str
    description: str
    project_type: ProjectTypeEnumSchema
    live_link: Optional[str] = None
    github_link: Optional[str] = None
    cover_photo: Optional[str] = None

class ProjectCreate(ProjectBase):
    tech_stack_ids: List[int] = []

class Project(ProjectBase):
    id: int
    tech_stack: List[Technology] = []

    class Config:
        orm_mode = True

# --- Contact Schemas ---
class ContactBase(BaseModel):
    name: str
    email: str
    message: str

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    date_time: datetime

    class Config:
        orm_mode = True

# --- Education Schemas ---
class EducationBase(BaseModel):
    school: str
    time_period: str
    course: str
    note: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class Education(EducationBase):
    id: int

    class Config:
        orm_mode = True

# --- Personal Detail Schemas ---
class PersonalDetailBase(BaseModel):
    email: str
    contact: str
    bio: str
    tag_line: str
    address: str
    github: str
    linkedin: str

class PersonalDetailCreate(PersonalDetailBase):
    pass

class PersonalDetail(PersonalDetailBase):
    id: int

    class Config:
        orm_mode = True
