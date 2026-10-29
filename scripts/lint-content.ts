// Runs the content lint over content/src/*.json. Exits 1 on any error. Run: npm run lint:content
import fs from 'fs';
import path from 'path';
import { lintContent, validateRaw } from './contentLint';

const dir = path.join(__dirname, '../content/src');
const read = (f: string): unknown => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));

const { bundle, errors: schemaErrors } = validateRaw({
  questions: read('questions.json'),
  units: read('units.json'),
  lessons: read('lessons.json'),
  state_formats: read('state_formats.json'),
  glossary: read('glossary.json'),
  fix_log: read('fix_log.json'),
  watched_sources: read('watched_sources.json'),
});

const result = bundle ? lintContent(bundle) : { errors: schemaErrors, warnings: [] };
for (const w of result.warnings) console.warn(`warning: ${w}`);
for (const e of result.errors) console.error(`error: ${e}`);
if (result.errors.length) {
  console.error(`content lint failed: ${result.errors.length} error(s)`);
  process.exit(1);
}
console.log(
  `content lint ok: ${bundle!.questions.length} questions, ${bundle!.lessons.length} lessons, ${bundle!.state_formats.length} format rows` +
    (result.warnings.length ? ` (${result.warnings.length} warning(s))` : ''),
);
