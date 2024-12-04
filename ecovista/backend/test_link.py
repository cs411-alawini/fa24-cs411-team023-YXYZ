# import pymysql


# # 尝试连接到 GCP 上的 MySQL
# try:
#     connection = pymysql.connect(
#         host="34.173.41.58", user="test", password="yxyz", database="EcoVista"
#     )
#     print("成功连接到数据库")
#     with connection.cursor() as cursor:
#         # Query to fetch the first 10 rows from the Location table
#         cursor.execute("SELECT * FROM Location LIMIT 10")

#         # Fetch all rows from the executed query
#         rows = cursor.fetchall()

#         # Step 5: Print the rows
#         for row in rows:
#             print(row)

# except pymysql.MySQLError as e:
#     print(f"Error connecting to MySQL Database: {e}")
# finally:
#     if "connection" in locals() and connection.open:
#         connection.close()
import pymysql

# 数据库连接配置
db_config = {
    "host": "34.173.41.58",
    "user": "test",
    "password": "yxyz",
    "database": "EcoVista",
}

# 天气数据表与对应字段的映射
table_field_map = {
    "DroughtData": "drought_level",
    "AirQualityData": "aqi",
    "COData": "co_measurement",
    "NO2Data": "no2_measurement",
}

state_name = "New Mexico"  # 测试州名
year = "2024"  # 测试年份

state_name_to_abbreviation = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
}

state_name = state_name_to_abbreviation[state_name]

try:
    connection = pymysql.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
    )
    print("成功连接到数据库")

    with connection.cursor(pymysql.cursors.DictCursor) as cursor:
        # Step 1: 获取 state_name 对应的所有 county_code
        county_query = """
            SELECT county_code 
            FROM Location 
            WHERE state = %s
        """
        cursor.execute(county_query, (state_name,))
        county_codes = [row["county_code"] for row in cursor.fetchall()]

        if not county_codes:
            print(f"未找到州 {state_name} 的 county_code")
            exit()

        print(f"州 {state_name} 对应的 county_code: {county_codes}")

        # Step 2: 获取每个天气表的季度平均值
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
        # 打印结果
        for table, data in state_data.items():
            print(f"Table: {table}")
            for record in data:
                print(f"  Quarter: {record['quarter']}, Avg Value: {record['avg_value']}")

except pymysql.MySQLError as e:
    print(f"连接 MySQL 数据库时出错: {e}")
finally:
    if "connection" in locals() and connection.open:
        connection.close()
        print("数据库连接已关闭")