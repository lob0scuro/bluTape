from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Text, Boolean, Date, Enum, ForeignKey, func
from itsdangerous import URLSafeTimedSerializer
from flask import current_app

roleEnum = Enum("Technician", "Cleaner", "Sales", "Office", "Driver", "Service", name="positions")


class User(db.Model, UserMixin):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    position = Column(roleEnum, nullable=False)
    is_admin = Column(Boolean, default=False)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    notes = db.relationship("Note", back_populates="author", foreign_keys="Note.user_id")
    wrap_ups = db.relationship("Machine", backref="repaired_by_user", foreign_keys="[Machine.repaired_by]")
    cleans = db.relationship("Machine", backref="cleaned_by_user", foreign_keys="[Machine.cleaned_by]" )
    tasks = db.relationship("Task", backref="todos", foreign_keys="Task.user_id")
    
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": f"{self.first_name} {self.last_name}",
            "position": self.position,
            "email": self.email,
            "is_admin": self.is_admin,
            "notes": [note.serialize() for note in self.notes],
            "wrap_ups": [machine.serialize() for machine in self.wrap_ups],
            "tasks": [task.serialize() for task in self.tasks]
        }

    
    
    
class Note(db.Model):
    id = Column(Integer, primary_key=True)
    content = Column(Text)
    created_on = Column(Date, default=func.current_date())
    user_id = Column(Integer, ForeignKey("user.id", ondelete='SET NULL'))
    machine_id = Column(Integer, ForeignKey("machine.id", ondelete='SET NULL'))
    author = db.relationship("User", back_populates="notes", foreign_keys=[user_id])
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_on": self.created_on,
            "user_id": self.user_id,
            "machine_id": self.machine_id,
            "created_by": f"{self.author.first_name} {self.author.last_name[0]}." if self.author else None,
        }

class Task(db.Model):
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    created_on = Column(Date, default=func.current_date())
    user_id = Column(Integer, ForeignKey("user.id", ondelete='SET NULL'))
    is_complete = Column(Boolean, default=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_on": self.created_on,
            "user_id": self.user_id,
            "is_complete": self.is_complete,
        }
        
    
ApplianceEnum =  Enum("Refrigerator", "Washer", "Dryer", "Range", "Water Heater", "Dishwasher", "Microwave", name="appliance_types")   
ConditionEnum = Enum("NEW", "USED", name="condition_enum")
VendorEnum = Enum("Pasadena", "Baton Rouge", "Alexandria", "Stines LC", "Stines Jennings", "Scrappers", "Unknown", name="vendor_enum")
statusEnum = Enum("queued", "cleaned", "export", "deleted", name="status_enum")
class Machine(db.Model):
    id = Column(Integer, primary_key=True)
    brand = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    serial = Column(String(150), nullable=False, unique=True)
    style = Column(String(50), nullable=False)
    color = Column(String(50), nullable=False)
    condition = Column(ConditionEnum, nullable=False)
    vendor = Column(VendorEnum)
    repaired_on = Column(Date, default=func.current_date())
    repaired_by = Column(Integer, ForeignKey("user.id", ondelete='SET NULL'))
    cleaned_on = Column(Date)
    cleaned_by = Column(Integer, ForeignKey("user.id", ondelete='SET NULL'))
    status = Column(statusEnum, default="queued")
    type_id = Column(Integer, ForeignKey("types.id", ondelete='SET NULL'))
    machine_type = db.relationship('Types', backref='machines')
    notes = db.relationship('Note', backref="machine", foreign_keys="Note.machine_id")
    
    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "model": self.model,
            "serial": self.serial,
            "style": self.style,
            "color": self.color,
            "condition": self.condition,
            "vendor": self.vendor,
            "repaired_on": self.repaired_on,
            "repaired_by": self.repaired_by,
            "cleaned_on": self.cleaned_on,
            "cleaned_by": self.cleaned_by,
            "status": self.status,
            "type_id": self.type_id,
            "machine_type": self.machine_type.name if self.machine_type else None,
            "notes": [note.serialize() for note in self.notes]
        }



class Types(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(ApplianceEnum, nullable=False)