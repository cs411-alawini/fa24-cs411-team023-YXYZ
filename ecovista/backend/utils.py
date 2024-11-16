import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()
# MySQL Database Connection Configuration
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}
print(db_config)