from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Table, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from typing import List
import enum
from datetime import datetime

from database import Base

# Association Table for Projects <-> Tech Stack (Technologies)
project_technologies = Table(
    "project_technologies",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id")),
    Column("technology_id", Integer, ForeignKey("technologies.id")),
)

class CategoryEnum(str, enum.Enum):
    Language = "Language"
    Framework_Library = "Framework/Library"
    Dev_Tool = "Dev Tool"
    Database = "Database"

class ProjectTypeEnum(str, enum.Enum):
    Hobby = "Hobby"
    Professional = "Professional"
    Open_Source = "Open Source"

class PersonalDetail(Base):
    __tablename__ = "personal_detail"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    contact = Column(String)
    bio = Column(Text)
    tag_line = Column(String)
    address = Column(String)
    github = Column(String)
    linkedin = Column(String)

class Technology(Base):
    __tablename__ = "technologies"

    id = Column(Integer, primary_key=True, index=True)
    technology = Column(String, index=True, unique=True)
    category = Column(Enum(CategoryEnum))
    order = Column(Integer, default=0)

    projects = relationship("Project", secondary=project_technologies, back_populates="tech_stack")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    project_type = Column(Enum(ProjectTypeEnum))
    live_link = Column(String)
    github_link = Column(String)
    cover_photo = Column(String)
    order = Column(Integer, default=0)

    tech_stack = relationship("Technology", secondary=project_technologies, back_populates="projects")

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    school = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    course = Column(String)
    note = Column(Text, nullable=True)
    order = Column(Integer, default=0)

class Contact(Base):
    __tablename__ = "contact"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    message = Column(Text)
    date_time = Column(DateTime, default=datetime.utcnow)
