// Fails if src/copy.ts breaks the "never say" list. Run: npm run lint:copy
import fs from 'fs';
import path from 'path';
import { lintCopySource } from './copyLint';

const file = path.join(__dirname, '../src/copy.ts');
const violations = lintCopySource(fs.readFileSync(file, 'utf8'));
for (const v of violations) console.error(`error: copy.${v.key}: ${v.reason}: "${v.text}"`);
if (violations.length) {
  console.error(`copy lint failed: ${violations.length} violation(s)`);
  process.exit(1);
}
console.log('copy lint ok');
