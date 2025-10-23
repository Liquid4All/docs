CREATE TABLE IF NOT EXISTS `model_stats.hf_model_stat` (
  id STRING NOT NULL,
  organization STRING NOT NULL,
  model_slug STRING NOT NULL,
  model_modality STRING,
  model_size STRING NOT NULL,
  model_variant STRING,
  hf_url STRING NOT NULL,
  total_downloads INT64 NOT NULL,
  new_downloads INT64,
  total_likes INT64 NOT NULL,
  new_likes INT64,
  utc_date DATE NOT NULL,
  updated_at TIMESTAMP NOT NULL
)
PARTITION BY utc_date
CLUSTER BY organization, model_slug
OPTIONS(
  description="HuggingFace model statistics synced from Postgres daily"
);
