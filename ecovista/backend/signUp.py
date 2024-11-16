from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import pymysql
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter

load_dotenv()

router = APIRouter()

# MySQL Database Connection Configuration
db_config = {
    'host': os.getenv('DB_HOST'),  
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
}

# model for request body
class RegisterRequest(BaseModel):
    email: str
    nickname: str
    county_code: int
    password: str

class Login(BaseModel):
    email: str
    password: str

# SignUp Endpoint
@router.post('/register', status_code=status.HTTP_201_CREATED)
async def register_user(request: RegisterRequest):
    # print(request)
    connection = None
    cursor = None
    try:
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database']
        )
        print("成功连接到数据库")
        with connection.cursor() as cursor:
            # Query to fetch the first 10 rows from the Location table
            insert_user_query = 'INSERT INTO UserProfile (email, username, county_code, password) VALUES (%s, %s, %s, %s)'
            cursor.execute(insert_user_query, (request.email, request.nickname, request.county_code, request.password))
            connection.commit()

            return {'success': True, 'message': 'Registration successful.'}

    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL Database: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()



# Login Endpoint
@router.post('/login', status_code=status.HTTP_201_CREATED)
async def register_user(request: Login):
    print(request)
    connection = None
    cursor = None
    try:
        connection = pymysql.connect(
            host='34.173.41.58',
            user='test',
            password='yxyz',
            database='EcoVista'
        )
        print("成功连接到数据库")
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        with cursor:
            check_user_query = 'SELECT * FROM UserProfile WHERE email = %s AND password = %s'
            cursor.execute(check_user_query, (request.email, request.password))
            user = cursor.fetchone()
            print('user')
            print(user)

            if user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid email or password.')

            return {
                'success': True,
                'nickname': user['username'],
                'user_id': user['user_id'],
                'user_county_code':user['county_code'],
                'message': 'Login successful.'
            }

    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL Database: {e}")
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()
