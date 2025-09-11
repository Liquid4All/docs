import { prisma } from '@liquidai/leap-database';
import { isEmptyString } from '@liquidai/leap-lib/utils';

import { HfCrawlerResult, Lfm2Modality } from '@/lib/analytics/huggingface/types';

export function parseModelName(fullName: string): {
  organization: string;
  model_slug: string;
  model_modality: Lfm2Modality | null;
  model_size: string;
  model_variant: string | null;
} {
  if (!fullName || fullName.trim() === '') {
    throw new Error('Model name cannot be empty');
  }

  const [organization, modelPart] = fullName.split('/');

  if (!organization || organization.trim() === '') {
    throw new Error('Organization is required in model name');
  }

  if (modelPart === undefined) {
    throw new Error('Model part is required in format "organization/model"');
  }

  const modalityMatch = modelPart.match(/-VL-\d+(?:\.\d+)?[BMK]/i);
  const model_modality = modalityMatch ? Lfm2Modality.VL : null;

  const sizeMatch = modelPart.match(/(\d+(?:\.\d+)?[BMK])/i);
  const model_size = sizeMatch ? sizeMatch[1] : '';

  let model_variant: string | null = null;
  if (!isEmptyString(model_size)) {
    const variantMatch = modelPart.match(/\d+(?:\.\d+)?[BMK]-(.+)/i);
    model_variant = variantMatch ? variantMatch[1] : null;
  } else {
    const variantMatch = modelPart.match(/-(.+)/);
    model_variant = variantMatch ? variantMatch[1] : null;
  }

  return {
    organization,
    model_slug: modelPart,
    model_size,
    model_variant,
    model_modality,
  };
}

export function getUtcMidnight(date: Date): Date {
  const utcDate = new Date(date);
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate;
}

export function getPreviousUtcDate(currentUtcDate: Date): Date {
  const previousDate = new Date(currentUtcDate);
  previousDate.setUTCDate(previousDate.getUTCDate() - 1);
  return previousDate;
}

async function processModelStat(
  modelData: { name: string; downloadCount: number; likeCount: number },
  currentUtcMidnight: Date
): Promise<void> {
  const { organization, model_slug, model_modality, model_size, model_variant } = parseModelName(
    modelData.name
  );
  console.group(
    `Processing model ${modelData.name} (${model_modality} | ${model_size} | ${model_variant})`
  );
  const previousUtcMidnight = getPreviousUtcDate(currentUtcMidnight);

  const existingEntries = await prisma.hfModelStat.findMany({
    where: {
      organization,
      model_slug,
      utc_date: {
        in: [currentUtcMidnight, previousUtcMidnight],
      },
    },
  });

  const currentMidnight = getUtcMidnight(currentUtcMidnight);
  const previousMidnight = getUtcMidnight(previousUtcMidnight);

  const todayEntry = existingEntries.find(
    (entry) => getUtcMidnight(entry.utc_date).getTime() === currentMidnight.getTime()
  );
  const yesterdayEntry = existingEntries.find(
    (entry) => getUtcMidnight(entry.utc_date).getTime() === previousMidnight.getTime()
  );

  // Calculate new downloads and likes based on yesterday's data
  let new_downloads: number | null = null;
  let new_likes: number | null = null;

  if (yesterdayEntry) {
    new_downloads = modelData.downloadCount - yesterdayEntry.total_downloads;
    new_likes = modelData.likeCount - yesterdayEntry.total_likes;
    console.debug(
      `Daily change for ${organization}/${model_slug}: downloads +${new_downloads}, likes +${new_likes}`
    );
  } else {
    console.debug(`No previous data found for ${organization}/${model_slug}`);
  }

  if (todayEntry == null) {
    await prisma.hfModelStat.create({
      data: {
        organization,
        model_slug,
        model_modality,
        model_size,
        model_variant,
        hf_url: `https://huggingface.co/${modelData.name}`,
        total_downloads: modelData.downloadCount,
        total_likes: modelData.likeCount,
        new_downloads,
        new_likes,
        utc_date: currentUtcMidnight,
      },
    });
    console.info(`Created new entry for ${organization}/${model_slug}`);
  } else {
    // Check if totals have changed
    const downloadsChanged = todayEntry.total_downloads !== modelData.downloadCount;
    const likesChanged = todayEntry.total_likes !== modelData.likeCount;

    if (downloadsChanged || likesChanged) {
      // Update existing entry with new totals and recalculated deltas
      await prisma.hfModelStat.update({
        where: {
          id: todayEntry.id,
        },
        data: {
          total_downloads: modelData.downloadCount,
          total_likes: modelData.likeCount,
          new_downloads,
          new_likes,
        },
      });
      console.info(
        `Updated entry for ${organization}/${model_slug} - downloads: ${todayEntry.total_downloads} → ${modelData.downloadCount}, likes: ${todayEntry.total_likes} → ${modelData.likeCount}`
      );
    } else {
      console.info(`No changes found for ${organization}/${model_slug}`);
    }
  }
  console.groupEnd();
}

export async function persistModelStatsToDatabase(data: HfCrawlerResult): Promise<void> {
  const utcDate = getUtcMidnight(data.scrapedAt);
  console.info(`Persisting model stats for UTC date: ${utcDate.toISOString()}`);

  if (data.models.length === 0) {
    console.info('No model stats to persist, skipping database operations');
    return;
  }

  try {
    for (const model of data.models) {
      await processModelStat(model, utcDate);
    }

    console.info(
      `Successfully processed stats for ${data.models.length} models on ${utcDate.toISOString().split('T')[0]}`
    );
  } catch (error) {
    console.error('Failed to persist model stats to database:', error);
    throw error;
  }
}
