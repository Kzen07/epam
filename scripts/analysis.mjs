export const cases = [
  { id: 'support', label: 'Customer support', number: '01' },
  { id: 'knowledge', label: 'Enterprise knowledge', number: '02' },
  { id: 'development', label: 'Software development', number: '03' },
  { id: 'documents', label: 'Document understanding', number: '04' },
  { id: 'creative', label: 'Creative production', number: '05' },
  { id: 'education', label: 'Education & practice', number: '06' },
];

const normalize = (value) => value.normalize('NFKC').replace(/[‐‑‒–—]/g, '-').toLowerCase();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function toPlainText(value) {
  return value.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/\[S\d+(?:,\s*S\d+)*\]/g, '')
    .replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();
}

export function extractParagraphs(markdown) {
  const paragraphs = [...markdown.matchAll(/<a id="([a-z]+-p[12])"><\/a>\s*\r?\n\r?\n([^\r\n]+)/g)]
    .map((match) => ({ id: match[1], caseId: match[1].split('-p')[0], text: toPlainText(match[2]) }));
  const expected = cases.flatMap((item) => [`${item.id}-p1`, `${item.id}-p2`]);
  if (paragraphs.length !== expected.length || expected.some((id) => paragraphs.filter((p) => p.id === id).length !== 1)) {
    throw new Error('Expected exactly two anchored analysis paragraphs for each of the six cases.');
  }
  return paragraphs;
}

export function countExplicit(text, terms) {
  const normalized = normalize(text);
  const candidates = terms.flatMap((term) => term.aliases.flatMap((alias) => {
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegex(normalize(alias))}(?![\\p{L}\\p{N}_])`, 'gu');
    return [...normalized.matchAll(pattern)].map((match) => ({ termId: term.id, start: match.index, end: match.index + match[0].length, phrase: match[0] }));
  }));
  // Prefer the longest phrase across terms, so "prompt injection" is not also a plain "prompt" hit.
  candidates.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start || a.termId.localeCompare(b.termId));
  const selected = [];
  for (const candidate of candidates) {
    if (!selected.some((hit) => candidate.start < hit.end && candidate.end > hit.start)) selected.push(candidate);
  }
  return selected.sort((a, b) => a.start - b.start);
}

export function analyze(paragraphs, terms, annotations) {
  if (new Set(terms.map((term) => term.id)).size !== terms.length) throw new Error('Duplicate term IDs.');
  const lexical = new Map(paragraphs.map((p) => [p.id, countExplicit(p.text, terms)]));
  const seen = new Set();
  for (const annotation of annotations) {
    const paragraph = paragraphs.find((p) => p.id === annotation.paragraphId);
    if (!paragraph || !terms.some((term) => term.id === annotation.termId)) throw new Error('Unknown annotation target.');
    if (!annotation.quote?.trim() || !paragraph.text.includes(annotation.quote)) throw new Error(`Missing evidence quote: ${annotation.termId}/${annotation.paragraphId}`);
    if (!annotation.rationale?.trim()) throw new Error('Annotation rationale is required.');
    const key = `${annotation.termId}/${annotation.paragraphId}`;
    if (seen.has(key)) throw new Error(`Duplicate annotation: ${key}`);
    if (lexical.get(paragraph.id).some((hit) => hit.termId === annotation.termId)) throw new Error(`Explicit and implicit usage overlap: ${key}`);
    seen.add(key);
  }
  const edges = terms.flatMap((term) => cases.flatMap((item) => {
    const evidence = paragraphs.filter((p) => p.caseId === item.id).flatMap((paragraph) => {
      const hits = lexical.get(paragraph.id).filter((hit) => hit.termId === term.id);
      const annotation = annotations.find((entry) => entry.termId === term.id && entry.paragraphId === paragraph.id);
      if (hits.length) return [{ paragraphId: paragraph.id, kind: 'explicit', mentions: hits.length, matches: hits.map((hit) => hit.phrase), text: paragraph.text }];
      if (annotation) return [{ paragraphId: paragraph.id, kind: 'implicit', mentions: 0, quote: annotation.quote, rationale: annotation.rationale, text: paragraph.text }];
      return [];
    });
    if (!evidence.length) return [];
    return [{ termId: term.id, caseId: item.id, explicit: evidence.filter((e) => e.kind === 'explicit').length,
      implicit: evidence.filter((e) => e.kind === 'implicit').length,
      mentions: evidence.reduce((sum, e) => sum + e.mentions, 0), evidence }];
  }));
  return {
    cases, paragraphs, edges,
    terms: terms.map((term) => {
      const relevant = edges.filter((edge) => edge.termId === term.id);
      return { ...term, explicit: relevant.reduce((n, edge) => n + edge.explicit, 0),
        implicit: relevant.reduce((n, edge) => n + edge.implicit, 0), mentions: relevant.reduce((n, edge) => n + edge.mentions, 0) };
    }),
  };
}
