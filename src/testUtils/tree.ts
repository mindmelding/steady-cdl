import type { ReactTestRendererJSON } from 'react-test-renderer';

type Json = ReactTestRendererJSON | ReactTestRendererJSON[] | null;

/** Depth-first walk of a rendered tree. */
export function walk(tree: Json, fn: (n: ReactTestRendererJSON) => void): void {
  if (!tree) return;
  if (Array.isArray(tree)) return tree.forEach((t) => walk(t, fn));
  fn(tree);
  for (const c of tree.children ?? []) if (typeof c !== 'string') walk(c, fn);
}

/** All nodes that carry a given prop (e.g. numberOfLines). */
export function nodesWithProp(tree: Json, prop: string) {
  const out: ReactTestRendererJSON[] = [];
  walk(tree, (n) => {
    if (n.props && prop in n.props && n.props[prop] !== undefined) out.push(n);
  });
  return out;
}

/** All rendered strings. */
export function allText(tree: Json): string[] {
  const out: string[] = [];
  const rec = (t: Json) => {
    if (!t) return;
    if (Array.isArray(t)) return t.forEach(rec);
    for (const c of t.children ?? []) {
      if (typeof c === 'string') out.push(c);
      else rec(c);
    }
  };
  rec(tree);
  return out;
}
