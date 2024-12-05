CREATE PROCEDURE GETSTATESCORE(IN SelectedMonth VARCHAR(255))

BEGIN
    DECLARE previousMonth VARCHAR(255);
    DECLARE avg_score FLOAT;

    SET previousMonth = DATE_FORMAT(DATE_SUB(STR_TO_DATE(CONCAT(SelectedMonth, '-01'), '%Y-%m-%d'), INTERVAL 1 MONTH), '%Y-%m');

    CREATE TEMPORARY TABLE StateScores AS
    SELECT L.state,
           (AVG(AQI.aqi) + AVG(CO.co_measurement) + AVG(N.no2_measurement) + AVG(D.drought_level)) / 4 AS scores
    FROM Location L
    LEFT JOIN AirQualityData AQI ON L.county_code = AQI.county_code AND AQI.timestamp BETWEEN previousMonth AND SelectedMonth
    LEFT JOIN COData CO ON L.county_code = CO.county_code AND CO.timestamp BETWEEN previousMonth AND SelectedMonth
    LEFT JOIN NO2Data N ON L.county_code = N.county_code AND N.timestamp BETWEEN previousMonth AND SelectedMonth
    LEFT JOIN DroughtData D ON L.county_code = D.county_code AND D.timestamp BETWEEN previousMonth AND SelectedMonth
    GROUP BY L.state;


    IF (SELECT COUNT(*) FROM StateScores) = 0 THEN
        SELECT 'No Data' AS message;
        DROP TEMPORARY TABLE IF EXISTS StateScores;
    ELSE
        SELECT AVG(scores) INTO avg_score FROM StateScores;

        IF avg_score > 6 THEN

            SELECT DISTINCT L.state
            FROM AirQualityData AQI
            JOIN Location L ON AQI.county_code = L.county_code
            JOIN (
                SELECT county_code, AVG(aqi) AS avg_aqi_previous
                FROM AirQualityData
                WHERE timestamp BETWEEN previousMonth AND previousMonth
                GROUP BY county_code
            ) AS AQI_Previous ON AQI.county_code = AQI_Previous.county_code
            WHERE AQI.timestamp BETWEEN SelectedMonth AND SelectedMonth
            GROUP BY L.state
            HAVING AVG(AQI.aqi) > MAX(AQI_Previous.avg_aqi_previous)
            ORDER BY L.state;
        ELSE
            SELECT 'No Data' AS message;
        END IF;
    END IF;

    DROP TEMPORARY TABLE IF EXISTS StateScores;
END;

