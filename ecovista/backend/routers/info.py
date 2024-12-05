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

# 州名与简称映射
state_name_to_abbreviation = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL",
    "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA",
    "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI",
    "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT",
    "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
    "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
    "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA",
    "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
}
@router.get("/worse_states")
async def worse_states(month: str = Query(...)):
    connection = None
    try:
        # 检查月份格式
        if not month or len(month) != 7 or not month[:4].isdigit() or month[4] != '-' or not month[5:].isdigit():
            raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM.")
        
        # 连接数据库
        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
        )
        cursor = connection.cursor()

        # 加载存储过程
        cursor.execute("DROP PROCEDURE IF EXISTS GETSTATESCORE;")
        connection.commit()

        with open("procedure.sql", "r", encoding="utf-8") as file:
            sql_script = file.read()

        cursor.execute(sql_script)
        connection.commit()

        print("Stored procedures loaded successfully.")

        # 调用存储过程
        cursor.callproc('GETSTATESCORE', (month,))
        results = cursor.fetchall()

        if not results:
            return {
                "success": False,
                "message": "No data",
                "data": []
            }

        # 转换州简称为全称
        state_abbreviation_to_name = {v: k for k, v in state_name_to_abbreviation.items()}  # 反转映射
        formatted_results = []
        for row in results:
            state_abbr = row[0]  # 假设第一列是州的简称
            if state_abbr in state_abbreviation_to_name:
                formatted_results.append(state_abbreviation_to_name[state_abbr])

        return {
            "success": True,
            "message": "Select state successfully.",
            "data": formatted_results,
        }

    except pymysql.MySQLError as e:
        print(f"MySQL Error: {e}")
        raise
    finally:
        if connection and connection.open:
            connection.close()
# @router.get("/worse_states")
# async def worse_states(month:str = Query(...)):

#     connection = None
#     try:
#         if not month or len(month) != 7 or not month[:4].isdigit() or month[4] != '-' or not month[5:].isdigit():
#            raise HTTPException(status_code=400, detail="Invalid month format. Use YYYY-MM.")
#         connection = pymysql.connect(
#             host=db_config["host"],
#             user=db_config["user"],
#             password=db_config["password"],
#             database=db_config["database"],
#         )
#         cursor = connection.cursor()

#         cursor.execute("DROP PROCEDURE IF EXISTS GETSTATESCORE;")
#         connection.commit()

#         with open("procedure.sql", "r", encoding="utf-8") as file:
#             sql_script = file.read()

#         cursor.execute(sql_script)
#         connection.commit()

#         print("Stored procedures loaded successfully.")

#         cursor.callproc('GETSTATESCORE', (month,))
#         results = cursor.fetchall()

#         if not results:
#             return {
#                 "success": False,
#                 "message": "No data",
#                 "data": []
#             }

#         return {
#             "success": True,
#             "message": "Select state successfully.",
#             "data": results,
#         }

#     except pymysql.MySQLError as e:
#         print(f"MySQL Error: {e}")
#         raise
#     finally:
#         if connection and connection.open:
#             connection.close()

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
