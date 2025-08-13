-- Step 1: Create the new table directly with existing data + UUIDs
CREATE TABLE `liquid-leap.model_stats.hf_model_stats_with_id`
    PARTITION BY DATE(scraped_at)
CLUSTER BY model_slug, organization
AS
SELECT
    GENERATE_UUID() as id,
    organization,
    model_slug,
    model_size,
    model_variant,
    collection_url,
    total_downloads,
    total_likes,
    new_downloads,
    new_likes,
    scraped_at
FROM `liquid-leap.model_stats.hf_model_stats`;

-- Step 2: Drop old table and rename new one
DROP TABLE `liquid-leap.model_stats.hf_model_stats`;

-- Step 3: Rename new table (using CREATE TABLE AS SELECT since BigQuery doesn't have RENAME)
CREATE TABLE `liquid-leap.model_stats.hf_model_stats`
    PARTITION BY DATE(scraped_at)
CLUSTER BY model_slug, organization
AS
SELECT * FROM `liquid-leap.model_stats.hf_model_stats_with_id`;

-- Step 4: Clean up
DROP TABLE `liquid-leap.model_stats.hf_model_stats_with_id`;
