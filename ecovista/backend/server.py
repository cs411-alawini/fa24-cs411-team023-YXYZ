from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
from google.cloud.sql.connector import Connector

app = FastAPI()

# GCP Configuration
INSTANCE_CONNECTION_NAME = "your-project:region:instance-name"
DB_USER = "your-db-user"
DB_PASS = "your-db-password"
DB_NAME = "your-database-name"

# Initialize connector
connector = Connector()

def getconn():
    return connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME
    )

# Create engine
engine = create_engine("postgresql+pg8000://", creator=getconn)

# Reflect existing database tables
metadata = MetaData()
metadata.reflect(engine)
Base = automap_base(metadata=metadata)
Base.prepare()

# Get table classes
Users = Base.classes.your_table1_name
CO2 = Base.classes.your_table2_name
NO2 = Base.classes.your_table2_name
# Add more table references as needed

# Create session factory
SessionLocal = sessionmaker(bind=engine)

# Example endpoint using reflected tables
@app.get("/table1/{item_id}")
async def read_item(item_id: int):
    db = SessionLocal()
    try:
        item = db.query(YourTable1).filter(YourTable1.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    finally:
        db.close()

@app.on_event("shutdown")
async def shutdown():
    connector.close()