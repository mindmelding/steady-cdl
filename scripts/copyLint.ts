// Copy lint (CLAUDE.md §13). Scans src/copy.ts string literals.
//  - Always forbidden (case-insensitive): guarantee, pass first, real test questions, actual test,
//    streak, pass rate.
//  - "Official" / "DMV" / "DPS" / "FMCSA" are allowed ONLY inside a property whose key starts with
//    `source` (e.g. sourceLine: 'Source: TX DPS'), never in the app name, titles, headlines or claims.
import ts from 'typescript';

export const FORBIDDEN = [
  'guarantee',
  'pass first',
  'real test questions',
  'actual test',
  'streak',
  'pass rate',
];
export const SOURCE_ONLY = /\b(official|dmv|dps|fmcsa)\b/i;

export interface CopyViolation {
  key: string;
  text: string;
  reason: string;
}

function keyChain(node: ts.Node): string[] {
  const keys: string[] = [];
  for (let n: ts.Node | undefined = node.parent; n; n = n.parent) {
    if ((ts.isPropertyAssignment(n) || ts.isMethodDeclaration(n)) && n.name) {
      if (ts.isIdentifier(n.name) || ts.isStringLiteral(n.name)) keys.push(n.name.text);
    }
  }
  return keys.reverse();
}

export function lintCopySource(source: string): CopyViolation[] {
  const sf = ts.createSourceFile('copy.ts', source, ts.ScriptTarget.Latest, true);
  const out: CopyViolation[] = [];
  const check = (node: ts.Node, text: string) => {
    const keys = keyChain(node);
    const key = keys.join('.') || '(top level)';
    const lower = text.toLowerCase();
    for (const f of FORBIDDEN) {
      if (lower.includes(f)) out.push({ key, text, reason: `contains forbidden phrase "${f}"` });
    }
    const m = SOURCE_ONLY.exec(text);
    if (m && !keys.some((k) => k.toLowerCase().startsWith('source'))) {
      out.push({ key, text, reason: `"${m[0]}" is only allowed in keys that start with "source"` });
    }
  };
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      // skip import specifiers and property-name literals
      if (
        !ts.isImportDeclaration(node.parent) &&
        !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
      ) {
        check(node, node.text);
      }
    } else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      check(node, node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}
