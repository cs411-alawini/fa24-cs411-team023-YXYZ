# info.py
from fastapi import APIRouter,Query
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import pymysql
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from utils import db_config
from typing import Optional

router = APIRouter()
table_name_map = {
    "Air Quality": "AirQualityData",
    "Drought": "DroughtData",
    "CO": "COData",
    "NO2": "NO2Data",
}
data_type_map = {
    "Air Quality": "aqi",
    "Drought": "drought_level",
    "CO": "co_measurement",
    "NO2": "no2_measurement",
}

# class FilterRequest(BaseModel):
#     state: str
#     year: str
#     county_code: str
#     data_type: str


@router.get("/filter")
async def filter(
    state: Optional[str] = Query(None),
    month: Optional[str] = Query(None),
    county_name: Optional[str] = Query(None),
    data_type: str = Query(...),
    ):

    connection = None
    cursor = None
    try:
        table_name = table_name_map.get(data_type)
        data_name = data_type_map.get(data_type)
        if not table_name or not data_name:
            raise HTTPException(
                status_code=400, detail=f"Invalid data_type: {data_type}"
            )
        print(table_name)
        print(data_name)

        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
        )
        print("成功连接到数据库")

        cursor = connection.cursor(pymysql.cursors.DictCursor)
        with cursor:
            
            query = (
                f"SELECT L.state, L.county_name, D.timestamp, D.{data_name} "
                f"FROM {table_name} D "
                f"JOIN Location L ON D.county_code = L.county_code "
                f"WHERE 1=1"
            )
            params = []
            if county_name:
                query += " AND L.county_name LIKE %s"
                parts = county_name.split(' ')
                query_list = []
                for part in parts:
                    if part == 'of':
                        query_list.append(part)
                    else:
                        query_list.append(part[0].upper() + part[1:])
                query_county = " ".join(query_list)
                params.append(f"%{query_county}%")
            
            if state:
                print(state)
                query += " AND L.state LIKE %s"
                params.append(f"%{state}%")
            
            if month:
                query += " AND timestamp LIKE %s"
                if month.isdigit():
                    print(int(month) < 10)
                    if int(month) < 10:
                        query_month = '0'+ month
                    else:
                        query_month = '' + month

                params.append(f"%-{query_month}%")
            if data_name == "aqi":
                query += f" ORDER BY D.{data_name} DESC"
            else:
                query += f" ORDER BY D.{data_name}"
            print(cursor.mogrify(query, tuple(params)).encode('utf-8'))
            cursor.execute(query, tuple(params))


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
