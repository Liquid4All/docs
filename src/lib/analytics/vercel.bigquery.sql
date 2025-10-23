CREATE SCHEMA IF NOT EXISTS `liquid-leap.vercel_analytics`
    OPTIONS (
    description = "Vercel Analytics data",
    location = "us-west1"
    );

CREATE OR REPLACE TABLE `liquid-leap.vercel_analytics.event` (
  -- Event-specific fields
  event_name STRING,
  event_data JSON,

  -- Common fields
  event_type STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  date DATE NOT NULL,
  project_id STRING NOT NULL,
  owner_id STRING NOT NULL,
  data_source_name STRING NOT NULL,
  session_id INT64 NOT NULL,
  device_id INT64 NOT NULL,

  -- URL and routing
  origin STRING,
  path STRING,
  query_params JSON,
  route STRING,

  -- Location
  country STRING,

  -- Device and browser info
  os_name STRING,
  os_version STRING,
  client_name STRING,
  client_type STRING,
  client_version STRING,
  device_type STRING,
  device_brand STRING,
  browser_engine STRING,
  browser_engine_version STRING,

  -- SDK info
  sdk_version STRING,
  sdk_name STRING,
  sdk_version_full STRING,

  -- Vercel specific
  vercel_environment STRING,
  vercel_url STRING,
  deployment STRING,
  schema STRING,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
)
PARTITION BY date
CLUSTER BY event_type, device_id, session_id
OPTIONS (
  description = "Vercel Analytics events data"
);

CREATE OR REPLACE TABLE `liquid-leap.vercel_analytics.pageview` (
  -- Common fields
  event_type STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  date DATE NOT NULL,
  project_id STRING NOT NULL,
  owner_id STRING NOT NULL,
  data_source_name STRING NOT NULL,
  session_id INT64 NOT NULL,
  device_id INT64 NOT NULL,

  -- URL and routing
  origin STRING,
  path STRING,
  query_params JSON,
  route STRING,

  -- Location
  country STRING,

  -- Device and browser info
  os_name STRING,
  os_version STRING,
  client_name STRING,
  client_type STRING,
  client_version STRING,
  device_type STRING,
  device_brand STRING,
  browser_engine STRING,
  browser_engine_version STRING,

  -- SDK info
  sdk_version STRING,
  sdk_name STRING,
  sdk_version_full STRING,

  -- Vercel specific
  vercel_environment STRING,
  vercel_url STRING,
  deployment STRING,
  schema STRING,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
)
PARTITION BY date
CLUSTER BY device_id, session_id, path
OPTIONS (
  description = "Vercel Analytics pageviews data"
);

CREATE OR REPLACE VIEW `liquid-leap.vercel_analytics.analytics_unified` AS
WITH events_with_rank AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY date, device_id, session_id, path
            ORDER BY timestamp
            ) as event_rank
    FROM `liquid-leap.vercel_analytics.event`
),
     pageviews_with_rank AS (
         SELECT
             *,
             ROW_NUMBER() OVER (
                 PARTITION BY date, device_id, session_id, path
                 ORDER BY timestamp
                 ) as pageview_rank
         FROM `liquid-leap.vercel_analytics.pageview`
     )
SELECT
    -- Join keys
    COALESCE(e.date, p.date) as date,
    COALESCE(e.device_id, p.device_id) as device_id,
    COALESCE(e.session_id, p.session_id) as session_id,
    COALESCE(e.path, p.path) as path,

    -- Event data
    e.event_name,
    e.event_data,
    e.timestamp as event_timestamp,

    -- Pageview data
    p.timestamp as pageview_timestamp,

    -- Common fields (preferring pageview data when available)
    COALESCE(p.project_id, e.project_id) as project_id,
    COALESCE(p.owner_id, e.owner_id) as owner_id,
    COALESCE(p.origin, e.origin) as origin,
    COALESCE(p.query_params, e.query_params) as query_params,
    COALESCE(p.route, e.route) as route,
    COALESCE(p.country, e.country) as country,
    COALESCE(p.os_name, e.os_name) as os_name,
    COALESCE(p.os_version, e.os_version) as os_version,
    COALESCE(p.client_name, e.client_name) as client_name,
    COALESCE(p.client_type, e.client_type) as client_type,
    COALESCE(p.client_version, e.client_version) as client_version,
    COALESCE(p.device_type, e.device_type) as device_type,
    COALESCE(p.device_brand, e.device_brand) as device_brand,
    COALESCE(p.vercel_environment, e.vercel_environment) as vercel_environment,
    COALESCE(p.vercel_url, e.vercel_url) as vercel_url,
    COALESCE(p.deployment, e.deployment) as deployment

FROM events_with_rank e
         FULL OUTER JOIN pageviews_with_rank p
                         ON e.date = p.date
                             AND e.device_id = p.device_id
                             AND e.session_id = p.session_id
                             AND e.path = p.path
                             AND e.event_rank = p.pageview_rank  -- Match events to pageviews in order
;
