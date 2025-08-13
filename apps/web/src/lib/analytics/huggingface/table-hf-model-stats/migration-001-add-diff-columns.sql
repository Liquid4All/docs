ALTER TABLE `liquid-leap.model_stats.hf_model_stats`
RENAME COLUMN downloads TO total_downloads;

ALTER TABLE `liquid-leap.model_stats.hf_model_stats` 
RENAME COLUMN likes TO total_likes;

ALTER TABLE `liquid-leap.model_stats.hf_model_stats` 
ADD COLUMN new_downloads INT64;

ALTER TABLE `liquid-leap.model_stats.hf_model_stats` 
ADD COLUMN new_likes INT64;
