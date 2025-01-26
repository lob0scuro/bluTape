from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import func

class Tech(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    notes = db.relationship('Notes', backref="tech")
    #is_admin = db.Column(db.Boolean)
    
    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'notes': [note.serialize() for note in self.notes]
        }
    
    def __repr__(self):
        return f"<Tech {self.id}: {self.first_name} {self.last_name}>"
    

class Machine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(150))
    model = db.Column(db.String(150))
    serial = db.Column(db.String(150))
    color = db.Column(db.String(150))
    style = db.Column(db.String(150))
    in_progress = db.Column(db.Boolean, default=True)
    notes = db.relationship('Notes', backref="machine")
    #is_exported = db.Column(db.Boolean, default=False)
    
    def serialize(self):
        return {
            'id': self.id,
            'make': self.make,
            'model': self.model,
            'serial': self.serial,
            'color': self.color,
            'style': self.style,
            'in_progress': self.in_progress,
            'notes': [note.serialize() for note in self.notes]
        }
    
    def __repr__(self):
        return f"<Machine {self.id}: {self.make} {self.color} {self.style}>"
    
    
class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    created_on = db.Column(db.Date, server_default=func.current_date())
    tech_id = db.Column(db.Integer, db.ForeignKey('tech.id'))
    machine_id = db.Column(db.Integer, db.ForeignKey('machine.id'))
    
    def serialize(self):
        return {
            'id': self.id,
            'tech_id': self.tech_id,
            'machine_id': self.machine_id,
            'created_on': self.created_on,
            'content': self.content
        }