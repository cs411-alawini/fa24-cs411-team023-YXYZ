from fastapi import APIRouter, HTTPException, Query
import pymysql
from utils import db_config  # 确保此模块中有数据库配置
router = APIRouter()

# 天气数据表与字段的映射
table_field_map = {
    "DroughtData": "drought_level",
    "AirQualityData": "aqi",
    "COData": "co_measurement",
    "NO2Data": "no2_measurement",
}

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

@router.get("/state")
async def get_state_data(
    state_name: str = Query(..., description="Full state name (e.g., California)"),
    year: str = Query("2024", description="Year in 'YYYY' format (default is 2024)"),
):
    # 校验州名是否有效
    abbreviation = state_name_to_abbreviation.get(state_name)
    if not abbreviation:
        raise HTTPException(status_code=400, detail=f"State name '{state_name}' is invalid.")

    # 验证年份
    if not year.isdigit() or len(year) != 4:
        raise HTTPException(status_code=400, detail="Invalid year format. Use 'YYYY'.")

    try:
        # 连接数据库
        connection = pymysql.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            database=db_config["database"],
        )

        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # 获取州的所有 county_code
            county_query = """
                SELECT county_code 
                FROM Location 
                WHERE state = %s
            """
            cursor.execute(county_query, (abbreviation,))
            county_codes = [row["county_code"] for row in cursor.fetchall()]

            if not county_codes:
                raise HTTPException(status_code=404, detail=f"No counties found for state '{state_name}'.")

            # 获取各表的季度平均值
            state_data = {}
            for table, field in table_field_map.items():
                query = f"""
                SELECT 
                    CASE 
                        WHEN CAST(SUBSTRING_INDEX(timestamp, '-', -1) AS UNSIGNED) BETWEEN 1 AND 3 THEN 'Q1'
                        WHEN CAST(SUBSTRING_INDEX(timestamp, '-', -1) AS UNSIGNED) BETWEEN 4 AND 6 THEN 'Q2'
                        WHEN CAST(SUBSTRING_INDEX(timestamp, '-', -1) AS UNSIGNED) BETWEEN 7 AND 9 THEN 'Q3'
                        WHEN CAST(SUBSTRING_INDEX(timestamp, '-', -1) AS UNSIGNED) BETWEEN 10 AND 12 THEN 'Q4'
                    END AS quarter,
                    AVG({field}) AS avg_value
                FROM {table}
                WHERE county_code IN %s AND SUBSTRING_INDEX(timestamp, '-', 1) = %s
                GROUP BY quarter
                ORDER BY FIELD(quarter, 'Q1', 'Q2', 'Q3', 'Q4');
                """
                cursor.execute(query, (county_codes, year))
                result = cursor.fetchall()

                state_data[table] = [
                    {"quarter": row["quarter"], "avg_value": row["avg_value"]} for row in result
                ]
        print(state_data)

        # 返回结果
        return {
            "success": True,
            "state_data": state_data,
        }

    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if "connection" in locals() and connection.open:
            connection.close()