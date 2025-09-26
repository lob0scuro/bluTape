from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum, ForeignKey, Table, func
from datetime import datetime, timezone, timedelta
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

    def total_notes_written(self):
        return len(self.notes)

    def machines_by_status(self, status):
        return [m for m in self.machines_worked if m.status == status]

    from datetime import datetime, timedelta, timezone

    def serialize(self, view_range="day", selected_date=None):
        totals = {
            "machines_by_status": {
                status: len(self.machines_by_status(status))
                for status in ["in_progress", "completed", "trashed"]
            },
            "machines_worked_count": self.total_machines_worked(),
            "notes_count": self.total_notes_written()
        }

        from datetime import datetime, timedelta, timezone
        timeline = []
        now = datetime.now(timezone.utc)

        # Example: daily aggregation for last 30 days
        if view_range == "day":
            for i in range(30):
                day = now - timedelta(days=i)
                if selected_date and day.date() != selected_date:
                    continue
                completed = len([m for m in self.machines_worked if m.status=="completed" and m.completed_on and m.completed_on.date() == day.date()])
                in_progress = len([m for m in self.machines_worked if m.status=="in_progress" and m.started_on.date() == day.date()])
                trashed = len([m for m in self.machines_worked if m.status=="trashed" and m.completed_on and m.completed_on.date() == day.date()])
                timeline.append({
                    "date": day.strftime("%Y-%m-%d"),
                    "completed": completed,
                    "in_progress": in_progress,
                    "trashed": trashed
                })
            timeline.reverse()
        
        current_workload = [
            m.serialize() for m in self.machines_worked if m.status == "in_progress" and (not selected_date or m.started_on.date() == selected_date)
        ]


        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "is_admin": self.is_admin,
            "email": self.email,
            **totals,
            "metrics_timeline": timeline,
            "machines_worked": [m.serialize() for m in self.machines_worked],
            "current_workload": current_workload,
            "notes": [n.serialize() for n in self.notes]
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
