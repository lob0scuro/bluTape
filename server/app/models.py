from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import func

#we are starting a new fresh start here

class Tech(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    is_admin = db.Column(db.Boolean, server_default="0")
    role = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(255), unique=True, nullable=False)
    
    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
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
    condition = db.Column(db.String(50), server_default="USED")
    heat_type = db.Column(db.String(50), nullable=True)
    created_on = db.Column(db.Date, default=func.current_date())
    in_progress = db.Column(db.Boolean, server_default="1")
    machine_type = db.Column(db.Integer, nullable=False) ## 0: fridge, 1:washer, 2:dryer, 3:range, 4:stackable, 5:dishwasher, 6:microwave, 7:water_heater
    notes = db.relationship('Notes', backref="machine")
    
    def serialize(self):
        return {
            'id': self.id,
            'brand': self.brand,
            'model': self.model,
            'serial': self.serial,
            'color': self.color,
            'style': self.style,
            'condition': self.condition,
            'heat_type': self.heat_type,
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
    is_archived = db.Column(db.Boolean, server_default="0")
    def serialize(self):
        return {
            'id': self.id,
            'tech_id': self.tech_id,
            'machine_id': self.machine_id,
            'created_on': self.created_on,
            'content': self.content,
            'is_archived': self.is_archived
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
    heat_type = db.Column(db.String(50), nullable=True)
    created_on = db.Column(db.Date, default=func.current_date())
    in_progress = db.Column(db.Boolean, server_default="1")
    machine_type = db.Column(db.Integer, nullable=False) ## 0: fridge, 1:washer, 2:dryer, 3:range, 4:stackable, 5:dishwasher, 6:microwave, 7:water_heater
    notes = db.relationship('Notes', backref="machine")
    
    def serialize(self):
        return {
            'id': self.id,
            'brand': self.brand,
            'model': self.model,
            'serial': self.serial,
            'color': self.color,
            'style': self.style,
            'condition': self.condition,
            'heat_type': self.heat_type,
            'machine_type': self.machine_type,
            'created_on': self.created_on,
            'in_progress': self.in_progress,
            'notes': [note.serialize() for note in self.notes]
        }
    
    def __repr__(self):
        return f"<Machine {self.id}: {self.brand} {self.color} {self.style}>"