import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const rawData = await readFile(new URL('graph/usage-data.json', root), 'utf8');
const data = JSON.parse(rawData);
const hash = (value) => createHash('sha256').update(value).digest('hex');
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
const blue = '#086fbe', amber = '#93601b', ink = '#192c39', muted = '#61717a';
const width = 1620, height = 1450, firstRow = 333, rowHeight = 45, firstColumn = 365, columnWidth = 158;
const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">`,
  '<title id="title">Vocabulary and application relationship graph: adjacency matrix</title>',
  '<desc id="description">Twenty vocabulary terms by six application areas. E is the number of paragraphs explicitly naming a term; I is the number with an implicit annotation. Each cell ranges from zero to two for each frequency. The two frequencies are displayed separately.</desc>',
  '<rect width="1620" height="1450" fill="#f3f1eb"/>',
  '<g font-family="Segoe UI,Arial,sans-serif">'];
const text = (x, y, value, size = 18, fill = ink, weight = 400, extra = '') => parts.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${escape(value)}</text>`);
const rect = (x, y, w, h, fill, radius = 0) => parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${radius}"/>`);
text(54, 65, 'epam', 39, ink, 750);
text(197, 63, '/ RESEARCH ATLAS', 15, muted, 650, 'letter-spacing="2"');
text(54, 132, 'How concepts connect to real applications', 39, ink, 650);
text(54, 173, 'Adjacency matrix of the vocabulary → application graph · all connections in one view', 20, muted);
text(54, 217, '20 TERMS', 15, ink, 700, 'letter-spacing="1.2"');
text(234, 217, '06 APPLICATION AREAS', 15, ink, 700, 'letter-spacing="1.2"');
text(525, 217, '12 ANALYSIS PARAGRAPHS', 15, ink, 700, 'letter-spacing="1.2"');
rect(54, 247, 1512, 3, '#d8dedb');
text(70, 298, 'VOCABULARY TERM', 15, muted, 650, 'letter-spacing="1"');
const labels = [ ['Customer', 'support'], ['Enterprise', 'knowledge'], ['Software', 'development'], ['Document', 'understanding'], ['Creative', 'production'], ['Education', '& practice'] ];
for (const [index, label] of labels.entries()) {
  text(firstColumn + index * columnWidth + 75, 283, label[0], 17, ink, 600, 'text-anchor="middle"');
  text(firstColumn + index * columnWidth + 75, 306, label[1], 17, ink, 600, 'text-anchor="middle"');
}
text(1455, 285, 'TOTAL', 14, muted, 650, 'text-anchor="middle" letter-spacing="1"');
text(1455, 308, 'E / I', 16, ink, 600, 'text-anchor="middle"');
function badges(x, y, explicit, implicit, totals = false) {
  const w = totals ? 57 : 55;
  rect(x, y - 21, w, 29, explicit ? '#e0edf8' : '#f1f2ed', 6);
  rect(x + w + 8, y - 21, w, 29, implicit ? '#f6ebd4' : '#f1f2ed', 6);
  text(x + w / 2, y, `E ${explicit}`, 15, explicit ? blue : '#8b969a', explicit ? 650 : 400, 'text-anchor="middle"');
  text(x + w * 1.5 + 8, y, `I ${implicit}`, 15, implicit ? amber : '#8b969a', implicit ? 650 : 400, 'text-anchor="middle"');
}
for (const [row, term] of data.terms.entries()) {
  const y = firstRow + row * rowHeight;
  rect(54, y - 25, 1512, rowHeight - 1, row % 2 ? '#f8f8f2' : '#fffefa', 0);
  text(70, y + 3, String(row + 1).padStart(2, '0'), 13, muted);
  text(114, y + 3, term.label, 19, ink, 500);
  for (const [column, application] of data.cases.entries()) {
    const edge = data.edges.find((item) => item.termId === term.id && item.caseId === application.id);
    badges(firstColumn + column * columnWidth + 14, y + 3, edge?.explicit ?? 0, edge?.implicit ?? 0);
  }
  badges(1395, y + 3, term.explicit, term.implicit, true);
}
const totals = data.terms.reduce((sum, term) => ({ explicit: sum.explicit + term.explicit, implicit: sum.implicit + term.implicit }), { explicit: 0, implicit: 0 });
rect(54, 1244, 1512, 3, '#d8dedb');
text(70, 1290, `E · Explicit paragraph pairs: ${totals.explicit}`, 21, blue, 650);
text(665, 1290, `I · Annotated implicit paragraph pairs: ${totals.implicit}`, 21, amber, 650);
text(70, 1328, 'Unit: distinct paragraphs per term. Each case contains two paragraphs. Totals across terms can exceed twelve.', 17, muted);
text(70, 1357, 'Implicit links are curated interpretations with quoted evidence; learner review remains pending. See the HTML inspector.', 17, muted);
text(70, 1393, `Report SHA-256: ${data.metadata.reportSha256}`, 12, muted);
text(70, 1417, 'Source: research.md + graph/terms.json + graph/annotations.json · Research date: 30 October 2026', 13, muted);
parts.push('</g></svg>');
const svg = `${parts.join('\n')}\n`;
const svgUrl = new URL('graph/relationships.svg', root);
if (process.argv.includes('--check')) {
  if (await readFile(svgUrl, 'utf8') !== svg) throw new Error('Static relationship graph is stale. Run npm run export.');
  const manifest = JSON.parse(await readFile(new URL('graph/png-export.json', root), 'utf8'));
  const png = await readFile(new URL('graph/relationships.png', root));
  if (manifest.inputDataSha256 !== hash(rawData) || manifest.inputSvgSha256 !== hash(svg) || manifest.pngSha256 !== hash(png)) {
    throw new Error('PNG export or its provenance is stale. Run npm run export:png with optional sharp installed.');
  }
  console.log('Verified static SVG, PNG, and export provenance.');
} else {
  await writeFile(svgUrl, svg, 'utf8');
  console.log('Wrote graph/relationships.svg.');
}
if (process.argv.includes('--png')) {
  const require = createRequire(import.meta.url);
  let sharp;
  try { sharp = require('sharp'); } catch {
    throw new Error('PNG export needs the optional sharp package. Run npm install --no-save --package-lock=false sharp, then npm run export:png. The regular build and SVG export need no dependencies.');
  }
  const pngUrl = new URL('graph/relationships.png', root);
  const info = await sharp(Buffer.from(svg), { density: 144 }).png().toFile(fileURLToPath(pngUrl));
  const png = await readFile(pngUrl);
  const manifest = { inputDataSha256: hash(rawData), inputSvgSha256: hash(svg), pngSha256: hash(png),
    renderer: `sharp ${sharp.versions.sharp}`, width: info.width, height: info.height };
  await writeFile(new URL('graph/png-export.json', root), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log('Wrote graph/relationships.png at 2x resolution.');
}
