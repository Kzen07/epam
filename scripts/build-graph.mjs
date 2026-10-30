import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { analyze, extractParagraphs } from './analysis.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const [report, vocabulary, rawTerms, rawAnnotations, template, style, viewer] = await Promise.all([
  read('research.md'), read('vocabulary.md'), read('graph/terms.json'), read('graph/annotations.json'),
  read('graph/template.html'), read('graph/style.css'), read('graph/viewer.js'),
]);
const terms = JSON.parse(rawTerms);
if (terms.length !== 20) throw new Error('Expected twenty vocabulary terms.');
for (const term of terms) {
  if (!term.id || !term.label || !term.aliases?.length) throw new Error('Invalid term definition.');
  if (!vocabulary.includes(`<a id="${term.id}"></a>`)) throw new Error(`Missing vocabulary anchor: ${term.id}`);
}
const data = analyze(extractParagraphs(report), terms, JSON.parse(rawAnnotations));
const used = data.terms.filter((term) => term.explicit + term.implicit > 0);
if (used.length !== terms.length) throw new Error('Every vocabulary term must be represented in the report.');
data.metadata = {
  researchDate: '2026-10-30',
  reportSha256: createHash('sha256').update(report).digest('hex'),
  vocabularySha256: createHash('sha256').update(vocabulary).digest('hex'),
  corpus: 'The twelve anchored analysis paragraphs; headings, implementations, introduction, conclusions, and sources are excluded.',
  primaryUnit: 'Distinct paragraphs per term, separated into explicit and annotated implicit use.',
  implicitStatus: 'Curated interpretive annotations; pending learner review. Counts cover recorded annotations, not an exhaustive semantic truth.',
};
const json = `${JSON.stringify(data, null, 2)}\n`;
const embedded = JSON.stringify(data).replace(/</g, '\\u003c').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const html = template.replace('/* STYLE */', style).replace('/* DATA */', () => `const DATA = ${embedded};`).replace('/* VIEWER */', () => viewer);
const files = [['graph/usage-data.json', json], ['graph/index.html', html]];
for (const [path, content] of files) {
  if (process.argv.includes('--check')) {
    if (await read(path) !== content) throw new Error(`Generated file is stale: ${path}. Run npm run build.`);
  } else await writeFile(new URL(path, root), content, 'utf8');
}
const totals = data.terms.reduce((sum, term) => ({ explicit: sum.explicit + term.explicit, implicit: sum.implicit + term.implicit, mentions: sum.mentions + term.mentions }), { explicit: 0, implicit: 0, mentions: 0 });
console.log(`${process.argv.includes('--check') ? 'Verified' : 'Built'}: ${data.cases.length} cases, ${data.paragraphs.length} paragraphs, ${terms.length} terms, ${data.edges.length} edges.`);
console.log(`Term-paragraph pairs: explicit=${totals.explicit}, implicit=${totals.implicit}; explicit textual mentions=${totals.mentions}.`);
