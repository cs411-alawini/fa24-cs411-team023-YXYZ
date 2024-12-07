CREATE PROCEDURE AnalyzeAndNotifyCO(
    IN threshold DOUBLE -- Threshold to identify high composite scores
)
BEGIN
    -- Set transaction isolation level to ensure consistent reads
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

    -- Start the transaction
    START TRANSACTION;

    -- Step 1: Calculate the composite score for each county
    CREATE TEMPORARY TABLE CompositeScores AS
    WITH NormalizedData AS (
        SELECT 
            l.county_code,
            AVG(COALESCE(aqi.aqi, 38.4609907)) AS avg_aqi,
            AVG(COALESCE(co.co_measurement, 0.2579314)) AS avg_co,
            AVG(COALESCE(no.no2_measurement, 6.4620929)) AS avg_no2,
            AVG(COALESCE(drought.drought_level, 7.5870168)) AS avg_drought,
            -- Normalize values and invert CO and NO2
            (AVG(COALESCE(aqi.aqi, 38.4609907)) - 0) / (100 - 0)  AS normed_aqi,
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
        -- Adjust composite score with weight normalization
        (normed_aqi + normed_co + normed_no2 + normed_drought) * 100 AS composite_score
    FROM NormalizedData;

    -- Step 2: Calculate the overall average composite score
    DECLARE avgCompositeScore DOUBLE;
    SELECT AVG(composite_score) INTO avgCompositeScore FROM CompositeScores;

    -- Step 3: Identify counties exceeding the average, and having a bad trend

    SELECT cs.county_code, l.county_name, l.state, cs.composite_score
    FROM CompositeScores cs
    JOIN Location l ON cs.county_code = l.county_code
    WHERE cs.composite_score < avgCompositeScore -- Below average composite score
    AND EXISTS (
        -- Check for a decreasing AQI trend
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
            AND AQITrend.avg_aqi < AQITrend.prev_aqi -- Decreasing trend condition
    );




    -- Step 4: Check if any counties are impacted
    DECLARE impactedCount INT;
    SELECT COUNT(*) INTO impactedCount FROM ImpactedCounties;

    IF impactedCount > 0 THEN
        -- Notify users linked to impacted counties
        UPDATE UserInfo u
        LEFT JOIN Location l ON u.state_name = l.state_name
        LEFT JOIN ImpactedCounties ic ON l.location_code = ic.location_code
        SET u.notification = CASE 
            WHEN ic.location_code IS NOT NULL THEN 1
            ELSE 0
        

        -- Log the operation in a NotificationsLog table
        INSERT INTO NotificationsLog (operation_time, log_message, affected_users, threshold)
        VALUES (NOW(), CONCAT("Notified ", impactedCount, " users about bad environment."), impactedCount, threshold);
    ELSE
        -- Log that no users were impacted
        INSERT INTO NotificationsLog (operation_time, log_message, affected_users, threshold)
        VALUES (NOW(), "No users impacted by high composite levels.", 0, threshold);
    END IF;

    -- Commit the transaction
    COMMIT;

    -- -- Output the result to the user
    -- IF impactedCount > 0 THEN
    --     SELECT CONCAT("Notified ", impactedCount, " users about high composite levels.") AS Result;
    -- ELSE
    --     SELECT "No users impacted by high composite levels." AS Result;
    -- END IF;

END;
    -- WITH AQITrendAnalysis AS (
    --     SELECT 
    --         aqi.county_code,
    --         aqi.timestamp,
    --         AVG(aqi.aqi) AS avg_aqi,
    --         LAG(AVG(aqi.aqi)) OVER (PARTITION BY aqi.county_code ORDER BY aqi.timestamp) AS prev_aqi
    --     FROM AirQualityData aqi
    --     GROUP BY aqi.county_code, aqi.timestamp
    -- ),
    -- DecreasingAQI AS (
    --     SELECT 
    --         county_code
    --     FROM AQITrendAnalysis
    --     WHERE prev_aqi IS NOT NULL
    --     AND avg_aqi < prev_aqi -- Decreasing trend condition
    --     GROUP BY county_code
    -- )
    -- SELECT DISTINCT county_code
    -- FROM DecreasingAQI;








