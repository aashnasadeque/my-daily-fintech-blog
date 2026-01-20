/**
 * Server-side functions to read briefs from the data/briefs/ folder.
 * These run at build time or request time on the server.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { DailyBrief } from './schema';

const BRIEFS_DIR = path.join(process.cwd(), 'data', 'briefs');

/**
 * Get all available brief dates from the data folder.
 */
export function getAvailableBriefDates(): string[] {
  if (!fs.existsSync(BRIEFS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BRIEFS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))
    .sort((a, b) => b.localeCompare(a)); // newest first
}

/**
 * Get a specific brief by date from the data folder.
 */
export function getBriefByDate(date: string): DailyBrief | null {
  const filePath = path.join(BRIEFS_DIR, `${date}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as DailyBrief;
  } catch {
    console.error(`Error reading brief for ${date}`);
    return null;
  }
}

/**
 * Get all briefs from the data folder.
 */
export function getAllBriefs(): DailyBrief[] {
  const dates = getAvailableBriefDates();
  const briefs: DailyBrief[] = [];

  for (const date of dates) {
    const brief = getBriefByDate(date);
    if (brief) {
      briefs.push(brief);
    }
  }

  return briefs;
}

/**
 * Get the latest brief from the data folder.
 */
export function getLatestBrief(): DailyBrief | null {
  const dates = getAvailableBriefDates();
  if (dates.length === 0) {
    return null;
  }
  return getBriefByDate(dates[0]);
}
