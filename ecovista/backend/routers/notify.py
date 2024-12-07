from fastapi import APIRouter,Query
from fastapi import FastAPI, HTTPException,Request, status,Response
from pydantic import BaseModel
import pymysql
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from utils import db_config
from typing import Optional

router = APIRouter()
@router.post("/notify")
async def notify(request: Request, response: Response):
    connection = None
    try:
        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = connection.cursor()
        print("connected to db")
        cursor.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;")
        cursor.execute("START TRANSACTION;")
        # Step 1: Calculate composite scores
        cursor.execute("""
            CREATE TEMPORARY TABLE CompositeScores AS
            WITH NormalizedData AS (
                SELECT 
                    l.county_code,
                    AVG(COALESCE(aqi.aqi, 38.4609907)) AS avg_aqi,
                    AVG(COALESCE(co.co_measurement, 0.2579314)) AS avg_co,
                    AVG(COALESCE(no.no2_measurement, 6.4620929)) AS avg_no2,
                    AVG(COALESCE(drought.drought_level, 7.5870168)) AS avg_drought,
                    (AVG(COALESCE(aqi.aqi, 38.4609907)) - 0) / (100 - 0) AS normed_aqi,
                    (1 - AVG(COALESCE(co.co_measurement, 0.2579314)) / (0.780 + 0.300)) AS normed_co,
                    (1 - AVG(COALESCE(no.no2_measurement, 6.4620929)) / (30.970 + 0.343)) AS normed_no2,
                    (1 - AVG(COALESCE(drought.drought_level, 7.5870168)) / 100) AS normed_drought
                FROM Location l
                LEFT JOIN AirQualityData aqi ON l.county_code = aqi.county_code
                LEFT JOIN COData co ON l.county_code = co.county_code
                LEFT JOIN NO2Data no ON l.county_code = no.county_code
                LEFT JOIN DroughtData drought ON l.county_code = drought.county_code
                GROUP BY l.county_code
            )
            SELECT 
                county_code,
                avg_aqi,
                avg_co,
                avg_no2,
                avg_drought,
                (normed_aqi + normed_co + normed_no2 + normed_drought) * 100 AS composite_score
            FROM NormalizedData;
        """)

        # Step 2: Calculate the overall average composite score
        cursor.execute("SELECT AVG(composite_score) AS avg_composite_score FROM CompositeScores;")
        avg_composite_score = cursor.fetchone()["avg_composite_score"]
        print("avg score is :")
        print(avg_composite_score)

        # Step 3: Identify impacted counties
        cursor.execute("""
            CREATE TEMPORARY TABLE ImpactedCounties AS
            SELECT cs.county_code, cs.composite_score
            FROM CompositeScores cs
            JOIN Location l ON cs.county_code = l.county_code
            WHERE cs.composite_score < %s
            AND EXISTS (
                SELECT 1
                FROM (
                    SELECT 
                        aqi.county_code,
                        aqi.timestamp,
                        AVG(aqi.aqi) AS avg_aqi,
                        LAG(AVG(aqi.aqi)) OVER (PARTITION BY aqi.county_code ORDER BY aqi.timestamp) AS prev_aqi
                    FROM AirQualityData aqi
                    GROUP BY aqi.county_code, aqi.timestamp
                ) AQITrend
                WHERE AQITrend.county_code = cs.county_code
                AND AQITrend.prev_aqi IS NOT NULL
                AND AQITrend.avg_aqi < AQITrend.prev_aqi
            );
        """, (avg_composite_score,))
        
        # Step 4: Check if any counties are impacted
        cursor.execute("SELECT COUNT(*) AS impacted_count FROM ImpactedCounties;")
        impacted_count = cursor.fetchone()["impacted_count"]
        print("number of county found:")
        print(impacted_count)

        
        cursor.execute("""
            UPDATE UserProfile u
            LEFT JOIN ImpactedCounties ic ON u.county_code = ic.county_code
            SET u.notify = CASE
                WHEN ic.county_code IS NOT NULL THEN 1
                ELSE 0
            END;
            """)
        if impacted_count > 0:            
            cursor.execute("""
                SELECT COUNT(*) AS user_count 
                FROM UserProfile u
                WHERE u.notify = 1;
                """)
            notify_count = cursor.fetchone()["user_count"]
            print(notify_count)
            
        else:
            notify_count = 0
           
        connection.commit()

        user_id = request.cookies.get("user_session")
        cursor.execute(("""
            SELECT notify 
            FROM UserProfile u
            WHERE u.user_id = %s;
            """),(user_id))
        curr_user_notify = cursor.fetchone()["notify"]
        print("notified")
        print(curr_user_notify)


        response.set_cookie(
            key="notified",
            value = curr_user_notify,
            httponly=False, 
            secure=False,    
            samesite="Lax"
        )



        print("return")
        return {"message": f"{notify_count} Users have been notified successfully!"}

        # # Format results for the response
        # return {
        #     "success": True,
        #     "message": f"Operation completed. Impacted users: {impacted_count}.",
        # }

        # return {
        #     "success": True,
        #     "message": f"Notified users in {len(formatted_results)} counties.",
        #     "data": formatted_results
        # }

    except pymysql.MySQLError as e:
        if connection:
            connection.rollback() 
        print(f"MySQL Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred on the server.")
    finally:
        if connection:
            connection.close()