from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import func
from flask import url_for, current_app

""""
    Machine Type Map
    {
        0: refrigerators,
        1: washers,
        2: dryers,
        3: ranges,
        4: stackables,
        5: dishwashers,
        6: microwaves,
        7: water_heaters,
    }
"""


class Tech(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    profile_pic = db.Column(db.String(255))
    is_admin = db.Column(db.Boolean, server_default="0")
    role = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(255), unique=True, nullable=False)
    
    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f"{self.first_name} {self.last_name}",
            'email': self.email,
            'profile_pic': f"{current_app.config['UPLOAD_URL']}/{self.profile_pic.split('/')[-1]}" if self.profile_pic else f"{current_app.config['UPLOAD_URL']}/profile_default.png",
            'is_admin': self.is_admin,
            'role': self.role,
        }
    
    def __repr__(self):
        return f"<Tech {self.id}: {self.first_name} {self.last_name}>"
    

class Machine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(150))
    model = db.Column(db.String(150))
    serial = db.Column(db.String(150))
    color = db.Column(db.String(150))
    style = db.Column(db.String(150))
    vendor = db.Column(db.String(150))
    condition = db.Column(db.String(50), server_default="USED")
    created_on = db.Column(db.Date, default=func.current_date())
    in_progress = db.Column(db.Boolean, server_default="1")
    in_inventory = db.Column(db.Boolean, server_default="0")
    machine_type = db.Column(db.Integer, nullable=False) 
    notes = db.relationship('Notes', backref="machine")
    
    def serialize(self):
        return {
            'id': self.id,
            'brand': self.brand,
            'model': self.model,
            'serial': self.serial,
            'color': self.color,
            'style': self.style,
            'vendor': self.vendor,
            'condition': self.condition,
            'machine_type': self.machine_type,
            'created_on': self.created_on,
            'in_progress': self.in_progress,
            'notes': [note.serialize() for note in self.notes]
        }
    
    def __repr__(self):
        return f"<Machine {self.id}: {self.brand} {self.color} {self.style}>"
    
    
class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    created_on = db.Column(db.Date, server_default=func.current_date())
    tech_id = db.Column(db.Integer, db.ForeignKey('tech.id', ondelete='SET NULL'))
    machine_id = db.Column(db.Integer, db.ForeignKey('machine.id', ondelete='SET NULL'))
    archive_id = db.Column(db.Integer, db.ForeignKey('archive.id', ondelete='SET NULL'))
    def serialize(self):
        return {
            'id': self.id,
            'tech_id': self.tech_id,
            'machine_id': self.machine_id,
            'archive_id': self.archive_id,
            'created_on': self.created_on,
            'content': self.content,
        }
    
        
# add archive table
class Archive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(150))
    model = db.Column(db.String(150))
    serial = db.Column(db.String(150))
    color = db.Column(db.String(150))
    style = db.Column(db.String(150))
    condition = db.Column(db.String(50), server_default="USED")
    created_on = db.Column(db.Date, default=func.current_date())
    in_progress = db.Column(db.Boolean, server_default="1")
    machine_type = db.Column(db.Integer, nullable=False) ## 0: fridge, 1:washer, 2:dryer, 3:range, 4:stackable, 5:dishwasher, 6:microwave, 7:water_heater
    notes = db.relationship('Notes', backref="archive")
    
    def serialize(self):
        return {
            'id': self.id,
            'brand': self.brand,
            'model': self.model,
            'serial': self.serial,
            'color': self.color,
            'style': self.style,
            'condition': self.condition,
            'machine_type': self.machine_type,
            'created_on': self.created_on,
            'in_progress': self.in_progress,
            'notes': [note.serialize() for note in self.notes]
        }
    
    def __repr__(self):
        return f"<Machine {self.id}: {self.brand} {self.color} {self.style}>"
    

    
    