CREATE TABLE `liquid-leap.model_stats.hf_model_stats` (
    -- Core model information
    organization STRING NOT NULL,
    model_slug STRING NOT NULL,
    model_size STRING NOT NULL,
    model_variant STRING,
    collection_url STRING NOT NULL,

    -- Metrics
    total_downloads INT64 NOT NULL,
    total_likes INT64 NOT NULL,
    new_downloads INT64,
    new_likes INT64,

    -- Timestamp
    scraped_at TIMESTAMP NOT NULL,
)
PARTITION BY DATE(scraped_at)
CLUSTER BY model_slug, organization;
