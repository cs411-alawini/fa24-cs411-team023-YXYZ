import pymysql


# 尝试连接到 GCP 上的 MySQL
try:
    connection = pymysql.connect(
        host='34.173.41.58',
        user='test',
        password='yxyz',
        database='EcoVista'
    )
    print("成功连接到数据库")
    with connection.cursor() as cursor:
        # Query to fetch the first 10 rows from the Location table
        cursor.execute("SELECT * FROM Location LIMIT 10")
        
        # Fetch all rows from the executed query
        rows = cursor.fetchall()
        
        # Step 5: Print the rows
        for row in rows:
            print(row)

except pymysql.MySQLError as e:
    print(f"Error connecting to MySQL Database: {e}")
finally:
    if 'connection' in locals() and connection.open:
        connection.close()
