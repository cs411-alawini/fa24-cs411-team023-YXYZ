# info.py
from fastapi import APIRouter
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import pymysql
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from ecovista.backend.utils import db_config

router = APIRouter()
table_name_map = {
    "Air Quality": "AirQualityData",
    "Drought": "DroughtData",
    "CO": "COData",
    "NO2": "NO2Data",
}

# class FilterRequest(BaseModel):
#     state: str
#     year: str
#     county_code: str
#     data_type: str


@router.get("/filter")
async def filter(state: str, year: str, county_code: str, data_type: str):

    connection = None
    cursor = None
    try:
        table_name = table_name_map.get(data_type)
        if not table_name:
            raise HTTPException(
                status_code=400, detail=f"Invalid data_type: {data_type}"
            )
        print(table_name)

        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
        )
        print("成功连接到数据库")

        cursor = connection.cursor(pymysql.cursors.DictCursor)
        with cursor:
            if "-" in year:
                pass
            else:
                query = (
                    f"SELECT * FROM {table_name} "
                    f"WHERE county_code=%s"
                    f"AND timestamp LIKE %s"
                )
                cursor.execute(query, (county_code, f"{year}-%"))

            result = cursor.fetchall()

            print(result)

            return {
                "success": True,
                "message": "Filter applied successfully.",
                "data": result,
            }

    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL Database: {e}")
    finally:
        if "connection" in locals() and connection.open:
            connection.close()
