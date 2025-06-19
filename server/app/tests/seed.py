from app.extensions import db
from app.models import Machine, Types
from sqlalchemy.sql import func
import random
import datetime

brands = ["Whirlpool", "GE", "Samsung", "LG", "Frigidaire", "Maytag"]
models = ["X100", "T300", "E250", "Z900", "A110"]
styles = ["Top Load", "Upright", "French Door", "Glass Top", "Coil"]
colors = ["White", "Black", "Black Stainless", "Orange", "Gold"]
conditions = ["NEW", "USED"]
vendors = ["Pasadena", "Baton Rouge", "Alexandria", "Stines LC", "Stines Jennings", "Scrappers", "Unknown"]
uid = []

def seed_machines(n=20):
    # Ensure Types table has some entries (or you handle type_id appropriately)
    type_ids = [1,2,3,4]
    if not type_ids:
        print("No Types found. Please seed your Types table first.")
        return

    for i in range(n):
        machine = Machine(
            brand=random.choice(brands),
            model=random.choice(models),
            serial=f"SERIAL-{i+1000}",
            style=random.choice(styles),
            color=random.choice(colors),
            condition=random.choice(conditions),
            vendor=random.choice(vendors),
            # repaired_on=datetime.date.today() - datetime.timedelta(days=random.randint(0, 30)),
            repaired_by=1,  # Or set to a valid user.id if needed
            cleaned_on=datetime.date.today() - datetime.timedelta(days=random.randint(0, 30)),
            cleaned_by=10,
            is_clean=random.choice([True, False]),
            is_exported=random.choice([True, False]),
            type_id=random.choice(type_ids)
        )
        db.session.add(machine)
    db.session.commit()
    print(f"Seeded {n} machines.")

# Example usage in a Flask shell:
# >>> from your_app.seed import seed_machines
# >>> seed_machines()
