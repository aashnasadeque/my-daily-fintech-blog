/**
 * Script to generate a daily brief and save it to data/briefs/
 * Run with: npx tsx scripts/generate-daily.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { mockRssItems } from '../src/lib/mockRss';
import { generateBriefFromMock, generateBriefWithChatGPT } from '../src/lib/briefGenerator';
import { formatDate } from '../src/lib/date';

async function main() {
  const today = formatDate(new Date());
  const useLLM = process.env.USE_LLM === 'true';
  const outputDir = path.join(process.cwd(), 'data', 'briefs');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${today}.json`);

  // Check if already generated today
  if (fs.existsSync(outputPath)) {
    console.log(`Brief for ${today} already exists at ${outputPath}`);
    process.exit(0);
  }

  console.log(`Generating brief for ${today}...`);
  console.log(`Mode: ${useLLM ? 'LLM (OpenAI)' : 'Mock'}`);

  let brief;
  try {
    if (useLLM) {
      brief = await generateBriefWithChatGPT(mockRssItems, today);
    } else {
      brief = generateBriefFromMock(mockRssItems, today);
    }
  } catch (error) {
    console.error('Error generating brief:', error);
    process.exit(1);
  }

  // Write to file
  fs.writeFileSync(outputPath, JSON.stringify(brief, null, 2));
  console.log(`Brief saved to ${outputPath}`);
}

main();
