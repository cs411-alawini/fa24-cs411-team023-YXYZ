from fastapi import APIRouter, Request
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from fastapi import APIRouter
from utils import db_config
import pymysql


router = APIRouter()

class Profile(BaseModel):
    email: str
    nickname: str
    county_code: int

@router.get("/profile", status_code=status.HTTP_200_OK)
async def get_profile(request: Request):
    # 从 Cookie 中获取 user_session
    user_id = request.cookies.get("user_session")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    try:
        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
        )
        print("Connect to DB successfully")
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            query = "SELECT email, username AS nickname, county_code FROM UserProfile WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            profile = cursor.fetchone()
            if not profile:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
            return {"success": True, "data": profile}

    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
    finally:
        if "connection" in locals() and connection.open:
            connection.close()

# 更新用户 Profile
@router.put("/profile", status_code=status.HTTP_200_OK)
async def update_profile(profile: Profile, request: Request):
    # 从 Cookie 中获取 user_session
    user_id = request.cookies.get("user_session")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    try:
        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
        )
        print("Connect to DB successfully")
        with connection.cursor() as cursor:
            query = """
                UPDATE UserProfile
                SET email = %s, username = %s, county_code = %s
                WHERE user_id = %s
            """
            cursor.execute(query, (profile.email, profile.nickname, profile.county_code, user_id))
            connection.commit()
            return {"success": True, "message": "Profile updated successfully."}

    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
    finally:
        if "connection" in locals() and connection.open:
            connection.close()