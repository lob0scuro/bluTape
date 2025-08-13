import random
from datetime import date
from app import create_app, db
from app.models import Machine  # don't import ConditionEnum/VendorEnum directly

app = create_app()

with app.app_context():
    brands = ["Whirlpool", "Amana", "GE"]
    colors = ["black", "white", "red", "blue", "green"]

    # Manually list the Enum values (since SQLAlchemy Enum isn't iterable)
    condition_values = ["NEW", "USED"]
    vendor_values = ["Pasadena", "Baton Rouge", "Alexandria", "Stines LC", "Stines Jennings", "Scrappers", "Unknown"]

    machines = []
    for i in range(100, 160):  # IDs 100–159 (60 machines)
        machine = Machine(
            id=i,
            brand=random.choice(brands),
            model=''.join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=8)),
            serial=''.join(random.choices("0123456789", k=10)),
            style="French Door",
            color=random.choice(colors),
            condition=random.choice(condition_values),  # now uses string values
            vendor=random.choice(vendor_values),        # now uses string values
            repaired_on=date.today(),
            repaired_by=19,
            cleaned_on=date.today(),
            cleaned_by=37,
            status=random.choice(["queued", "cleaned", "export"]),
            type_id=1
        )
        db.session.add(machine)
        machines.append(machine)

    db.session.commit()
    print(f"✅ Inserted {len(machines)} machines starting at ID 100")
