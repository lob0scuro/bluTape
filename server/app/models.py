from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum, ForeignKey, Table, func, case
from datetime import datetime, date, timezone, timedelta
from collections import defaultdict

# --------------------
# Enums
# --------------------
ConditionEnum = Enum("NEW", "USED", "Scratch and Dent", name="condition_enum")
VendorEnum = Enum("pasadena", "baton_rouge", "alexandria", "stines_lc", "stines_jn", "scrappers", "unknown", name="vendor_enum")
StatusEnum = Enum("completed", "trashed", "in_progress", "exported", "archived", name="status_enum")
TypeEnum = Enum("fridge", "washer", "dryer", "range", "microwave", "water_heater", "stackable", "dishwasher")

# --------------------
# Many-to-Many for multiple techs per machine
# --------------------
machine_techs = Table(
    "machine_techs",
    db.Model.metadata,
    Column("machine_id", Integer, ForeignKey("machine.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("user.id"), primary_key=True),
    Column("assigned_on", DateTime, default=func.current_date())
)

# --------------------
# User Model
# --------------------     
class User(db.Model, UserMixin):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(Integer, nullable=False)
    is_admin = Column(Boolean, default=False)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(255), nullable=False)

    # Relationships
    machines_worked = db.relationship(
        "Machine",
        secondary=machine_techs,
        back_populates="technicians"
    )
    notes = db.relationship("Note", back_populates="author", cascade="all, delete-orphan")
    
    # -----------------
    # Metrics / Helpers
    # -----------------
    def total_machines_worked(self):
        return len(self.machines_worked)

    def machines_by_status(self, status):
        return [m for m in self.machines_worked if m.status == status]

    
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "is_admin": self.is_admin,
            "email": self.email
        }

    def currenty_working_on(self):
        return [m.serialize() for m in self.machines_worked if m.status == StatusEnum.in_progress]
    
    def metrics_in_range(self, start_date: datetime, end_date: datetime):
        """
        Returns machines stats for this user within a given date range, serialized for JSON.

        Returns a dictionary:
        - in_progress: list of serialized machines currently in progress
        - completed_in_range: list of serialized machines completed within range
        - trashed_in_range: list of serialized machines trashed within range
        - count_completed_trashed: total number of completed + trashed within range
        """
        start = datetime.combine(start_date, datetime.min.time())
        end = datetime.combine(end_date, datetime.max.time())

        query = (
            db.session.query(
                Machine,
                case((Machine.status == "in_progress", 1), else_=0).label("in_progress_flag"),
                case((Machine.status == "completed", 1), else_=0).label("completed_flag"),
                case((Machine.status == "trashed", 1), else_=0).label("trashed_flag"),
            )
            .join(Machine.technicians)
            .filter(User.id == self.id)
        )

        machines = query.all()

        in_progress = []
        completed_in_range = []
        trashed_in_range = []
        count_completed_trashed = 0

        for machine, in_flag, comp_flag, trash_flag in machines:
            if in_flag:
                in_progress.append(machine.serialize())
            if comp_flag and machine.completed_on and start <= machine.completed_on <= end:
                completed_in_range.append(machine.serialize())
            if trash_flag and machine.updated_on and start <= machine.updated_on <= end:
                trashed_in_range.append(machine.serialize())
            if (comp_flag and machine.completed_on and start <= machine.completed_on <= end) or \
            (trash_flag and machine.updated_on and start <= machine.updated_on <= end):
                count_completed_trashed += 1

        return {
            "in_progress": in_progress,
            "completed_in_range": completed_in_range,
            "trashed_in_range": trashed_in_range,
            "count_completed_trashed": count_completed_trashed
        }

    




# --------------------
# Machine Model
# --------------------
class Machine(db.Model):
    id = Column(Integer, primary_key=True)
    brand = Column(String(50), nullable=False)
    type_of = Column(TypeEnum, nullable=False)
    model = Column(String(100), nullable=False)
    serial = Column(String(150), nullable=False, unique=True)
    style = Column(String(50), nullable=False)
    color = Column(String(50), nullable=False)
    condition = Column(ConditionEnum, nullable=False)
    vendor = Column(VendorEnum)
    status = Column(StatusEnum, default="in_progress", nullable=False)
    need_to_inventory = Column(Boolean, default=True)

    # Timestamps
    started_on = Column(DateTime, default=func.current_date())
    completed_on = Column(DateTime)
    updated_on = Column(DateTime, default=func.current_date(), onupdate=func.current_date())
    created_by = Column(Integer, ForeignKey("user.id"), nullable=False)
    creator = db.relationship("User", backref="machines_created")

    # Relationships
    technicians = db.relationship(
        "User",
        secondary=machine_techs,
        back_populates="machines_worked"
    )
    notes = db.relationship("Note", back_populates="machine", cascade="all, delete-orphan")

    # -----------------
    # Metrics / Helpers
    # -----------------
    def total_notes(self):
        return len(self.notes)

    def tech_names(self):
        return [f"{t.first_name} {t.last_name}" for t in self.technicians]

    def serialize(self):
        return {
            "id": self.id,
            "brand": self.brand,
            "type_of": self.type_of,
            "model": self.model,
            "serial": self.serial,
            "style": self.style,
            "color": self.color,
            "condition": self.condition,
            "vendor": self.vendor,
            "status": self.status,
            "started_on": self.started_on,
            "completed_on": self.completed_on,
            "updated_on": self.updated_on,
            "creator_id": self.created_by,
            "creator_name": f"{self.creator.first_name} {self.creator.last_name}",
            "technicians": self.tech_names(),
            "notes_count": self.total_notes(),
            "notes": [n.serialize() for n in self.notes]
        }
        
        

# --------------------
# Note Model
# --------------------
class Note(db.Model):
    id = Column(Integer, primary_key=True)
    content = Column(Text)
    date = Column(DateTime, default=func.current_date())
    user_id = Column(Integer, ForeignKey("user.id", ondelete="SET NULL"))
    machine_id = Column(Integer, ForeignKey("machine.id", ondelete="SET NULL"))

    author = db.relationship("User", back_populates="notes")
    machine = db.relationship("Machine", back_populates="notes")

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "date": self.date,
            "user_id": self.user_id,
            "machine_id": self.machine_id,
            "author_name": f"{self.author.first_name} {self.author.last_name}" if self.author else None,
            "machine_serial": self.machine.serial if self.machine else None
        }
