from app.extensions import db
from app.models import Machine, Types, User
from sqlalchemy.sql import func
import random
import datetime
from app.extensions import bcrypt

brands = ["Whirlpool", "GE", "Samsung", "LG", "Frigidaire", "Maytag"]
models = ["X100", "T300", "E250", "Z900", "A110"]
styles = ["Top Load", "Upright", "French Door", "Glass Top", "Coil"]
colors = ["White", "Black", "Black Stainless", "Orange", "Gold"]
conditions = ["NEW", "USED"]
vendors = ["Pasadena", "Baton Rouge", "Alexandria", "Stines LC", "Stines Jennings", "Scrappers", "Unknown"]
uid = []

users = [
    {
        "first_name": "Cameron",
        "last_name": "Lopez",
        "email": "cameron@mattsappliancesla.net",
        "position": "Technician",
        "is_admin": True,
        "password": "Claire18!",
    },
    {
        "first_name": "Matt",
        "last_name": "Guillory",
        "email": "matt@mattsappliancesla.net",
        "position": "Office",
        "is_admin": True,
        "password": "mGuillory",
    },
    {
        "first_name": "Donavon",
        "last_name": "Boutte",
        "email": "donavon@email.com",
        "position": "Technician",
        "is_admin": True,
        "password": "dBoutte",
    },
    {
        "first_name": "Terrain",
        "last_name": "Lemons",
        "email": "terrain@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "tLemons",
    },
    {
        "first_name": "Jeremey",
        "last_name": "Owens",
        "email": "jeremey@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "jOwens",
    },
    {
        "first_name": "Chevis",
        "last_name": "Edwards",
        "email": "chevis@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "cEdwards",
    },
    {
        "first_name": "Kris",
        "last_name": "Trahan",
        "email": "kris@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "kTrahan",
    },
    {
        "first_name": "Walter",
        "last_name": "Guillory",
        "email": "walter@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "wGuillory",
    },
    {
        "first_name": "Randall",
        "last_name": "Cater",
        "email": "randall@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "rCarter",
    },
    {
        "first_name": "David",
        "last_name": "Johnson",
        "email": "david@email.com",
        "position": "Technician",
        "is_admin": False,
        "password": "dJohnson",
    },
    {
        "first_name": "Jesse",
        "last_name": "O'neill",
        "email": "jesse@mattsappliancesla.net",
        "position": "Office",
        "is_admin": True,
        "password": "jOneill",
    },
    {
        "first_name": "Ethan",
        "last_name": "Newman",
        "email": "ethann@mattsappliancesla.net",
        "position": "Office",
        "is_admin": True,
        "password": "eNewman",
    },
    {
        "first_name": "Jerry",
        "last_name": "Ames",
        "email": "jerry@email.com",
        "position": "Sales",
        "is_admin": False,
        "password": "jAmes",
    },
    {
        "first_name": "Brandon",
        "last_name": "Corona",
        "email": "brandon@email.com",
        "position": "Sales",
        "is_admin": False,
        "password": "bCorona",
    },
    {
        "first_name": "Anthony",
        "last_name": "Lubin",
        "email": "anthony@email.com",
        "position": "Sales",
        "is_admin": False,
        "password": "aLubin",
    },
    {
        "first_name": "Luke",
        "last_name": "Benoit",
        "email": "luke@email.com",
        "position": "Sales",
        "is_admin": False,
        "password": "lBenoit",
    },
    {
        "first_name": "Donny",
        "last_name": "Daigle",
        "email": "donny@email.com",
        "position": "Sales",
        "is_admin": False,
        "password": "dDaigle",
    },
    {
        "first_name": "Chase",
        "last_name": "Warden",
        "email": "chase@email.com",
        "position": "Service",
        "is_admin": True,
        "password": "cWarden",
    },
    {
        "first_name": "Marcus",
        "last_name": "Hooker",
        "email": "marcus@email.com",
        "position": "Cleaner",
        "is_admin": False,
        "password": "mHooker",
    },
    {
        "first_name": "Martell",
        "last_name": "Armelin",
        "email": "martell@email.com",
        "position": "Cleaner",
        "is_admin": False,
        "password": "mArmelin",
    },
    {
        "first_name": "Blaze",
        "last_name": "Richard",
        "email": "blaze@email.com",
        "position": "Cleaner",
        "is_admin": False,
        "password": "bRichard",
    },
    {
        "first_name": "Clayton",
        "last_name": "Wallace",
        "email": "clayton@email.com",
        "position": "Cleaner",
        "is_admin": False,
        "password": "cWallace",
    },
    {
        "first_name": "Francis",
        "last_name": "Delko",
        "email": "francis@email.com",
        "position": "Driver",
        "is_admin": False,
        "password": "fDelko",
    },
    {
        "first_name": "John",
        "last_name": "Biagas",
        "email": "biagas@email.com",
        "position": "Driver",
        "is_admin": False,
        "password": "jBiagas",
    },    
]

def seed_users():
    for user in users:
        new_user = User(
            first_name=user["first_name"],
            last_name=user["last_name"],
            position=user["position"],
            is_admin=user["is_admin"],
            email=user["email"],
            password=bcrypt.generate_password_hash(user["password"]).decode("utf8")
        )
        db.session.add(new_user)
        
    db.session.commit()
    print(f"Seeded {len(users)} users.")

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
