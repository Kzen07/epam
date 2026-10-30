const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const state = { selected: DATA.terms.some((term) => term.id === location.hash.slice(1)) ? location.hash.slice(1) : 'rag', allEdges: false };
const colors = { explicit: '#086fbe', implicit: '#93601b' };
function element(tag, props = {}, text = '') {
  const node = document.createElement(tag);
  Object.assign(node, props);
  if (text) node.textContent = text;
  return node;
}
function svgElement(tag, attrs = {}, text = '') {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text) node.textContent = text;
  return node;
}
for (const item of DATA.cases) $('case').append(element('option', { value: item.id }, item.label));
function relevantEdges(termId) {
  return DATA.edges.filter((edge) => (!termId || edge.termId === termId) && ($('case').value === 'all' || edge.caseId === $('case').value));
}
function allowed(kind) { return $('mode').value === 'all' || $('mode').value === kind; }
function metrics(edges) {
  return edges.reduce((sum, edge) => ({ explicit: sum.explicit + (allowed('explicit') ? edge.explicit : 0),
    implicit: sum.implicit + (allowed('implicit') ? edge.implicit : 0), mentions: sum.mentions + (allowed('explicit') ? edge.mentions : 0) }), { explicit: 0, implicit: 0, mentions: 0 });
}
function selectTerm(id) {
  state.selected = id;
  render();
}
function render() {
  const query = $('search').value.trim().toLowerCase();
  const terms = DATA.terms.filter((term) => [term.label, ...term.aliases].some((value) => value.toLowerCase().includes(query)))
    .filter((term) => { const counts = metrics(relevantEdges(term.id)); return counts.explicit + counts.implicit > 0; });
  if (!terms.some((term) => term.id === state.selected)) state.selected = terms[0]?.id ?? null;
  const map = $('map');
  map.replaceChildren();
  map.append(svgElement('text', { x: 31, y: 32, class: 'svg-heading' }, 'VOCABULARY / E · I'));
  map.append(svgElement('text', { x: 610, y: 32, class: 'svg-heading' }, 'REPORT APPLICATIONS'));
  const positions = new Map(terms.map((term, index) => [term.id, 71 + index * 33]));
  const casePositions = new Map(DATA.cases.map((item, index) => [item.id, 109 + index * 111]));
  let connections = 0;
  const edgesToDraw = DATA.edges.filter((edge) => positions.has(edge.termId) && ($('case').value === 'all' || edge.caseId === $('case').value) && (state.allEdges || edge.termId === state.selected));
  for (const edge of edgesToDraw) {
    for (const kind of ['explicit', 'implicit']) {
      if (!allowed(kind) || !edge[kind]) continue;
      const offset = kind === 'implicit' ? 4 : -4;
      const y1 = positions.get(edge.termId) + offset;
      const y2 = casePositions.get(edge.caseId) + offset;
      const path = svgElement('path', { d: `M 342 ${y1} C 454 ${y1}, 490 ${y2}, 607 ${y2}`, fill: 'none', stroke: colors[kind], 'stroke-width': 1.5 + edge[kind], 'stroke-dasharray': kind === 'implicit' ? '6 5' : 'none', opacity: state.allEdges ? .43 : .85 });
      path.append(svgElement('title', {}, `${edge.termId} → ${edge.caseId}: ${edge[kind]} ${kind} paragraph(s)`));
      map.append(path);
      if (!state.allEdges) map.append(svgElement('text', { x: 570, y: y2 - 7, style: `fill:${colors[kind]};font-size:11px;font-weight:700` }, `${kind === 'explicit' ? 'E' : 'I'}${edge[kind]}`));
      connections++;
    }
  }
  for (const term of terms) {
    const y = positions.get(term.id), selected = term.id === state.selected, counts = metrics(relevantEdges(term.id));
    const group = svgElement('g', { class: 'term-node', role: 'button', tabindex: '0', 'aria-label': `${term.label}: ${counts.explicit} explicit and ${counts.implicit} implicit paragraphs`, 'aria-pressed': String(selected), 'data-term': term.id });
    group.append(svgElement('rect', { x: 27, y: y - 15, width: 312, height: 30, rx: 5, fill: selected ? '#e8f1f7' : 'transparent' }));
    group.append(svgElement('circle', { cx: 44, cy: y, r: selected ? 5 : 3.5, fill: selected ? colors.explicit : '#9cabad' }));
    group.append(svgElement('text', { x: 60, y: y + 4, 'font-weight': selected ? '700' : '400' }, term.label));
    group.append(svgElement('text', { x: 283, y: y + 4, style: `fill:${colors.explicit};font-size:11px` }, String(counts.explicit)));
    group.append(svgElement('text', { x: 310, y: y + 4, style: `fill:${colors.implicit};font-size:11px` }, String(counts.implicit)));
    group.addEventListener('click', () => selectTerm(term.id));
    group.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectTerm(term.id); map.querySelector(`[data-term="${term.id}"]`)?.focus(); } });
    map.append(group);
  }
  for (const item of DATA.cases) {
    const y = casePositions.get(item.id);
    const edges = edgesToDraw.filter((edge) => edge.caseId === item.id);
    const counts = metrics(edges), active = counts.explicit + counts.implicit > 0;
    const group = svgElement('g', { opacity: active ? 1 : .42 });
    group.append(svgElement('rect', { x: 609, y: y - 32, width: 229, height: 65, rx: 7, fill: active ? '#f0f4f1' : '#f6f6f1', stroke: '#d5ded8' }));
    group.append(svgElement('text', { x: 623, y: y - 11, style: 'font-size:9px;fill:#61717a;letter-spacing:1px' }, `CASE ${item.number}`));
    group.append(svgElement('text', { x: 623, y: y + 7, 'font-weight': '600' }, item.label));
    group.append(svgElement('text', { x: 623, y: y + 23, style: 'font-size:10px;fill:#61717a' }, `E ${counts.explicit}   /   I ${counts.implicit} paragraphs`));
    map.append(group);
  }
  if (!terms.length) map.append(svgElement('text', { x: 50, y: 100 }, 'No matching terms. Adjust the search or filters.'));
  $('connection-summary').textContent = `${connections} ${state.allEdges ? 'visible' : 'focused'} connections`;
  $('all-edges').textContent = state.allEdges ? 'Focus selected term' : 'Show all connections';
  $('all-edges').setAttribute('aria-pressed', String(state.allEdges));
  renderEvidence();
  const ledger = $('ledger'); ledger.replaceChildren();
  for (const term of terms) {
    const counts = metrics(relevantEdges(term.id));
    const row = element('tr', { className: term.id === state.selected ? 'selected' : '' });
    const cell = element('td'); const button = element('button', { type: 'button' }, term.label);
    button.addEventListener('click', () => selectTerm(term.id)); cell.append(button); row.append(cell);
    for (const key of ['explicit', 'implicit', 'mentions']) {
      const td = element('td', {}, String(counts[key]));
      if (key !== 'mentions') {
        const meter = element('span', { className: 'meter' }), fill = element('i');
        meter.setAttribute('aria-hidden', 'true'); fill.style.width = `${counts[key] / DATA.paragraphs.length * 100}%`;
        meter.append(fill); td.append(meter);
      }
      row.append(td);
    }
    ledger.append(row);
  }
  if (!terms.length) { const row = element('tr'), cell = element('td', { colSpan: 4 }, 'No matching terms.'); row.append(cell); ledger.append(row); }
  $('table-caption').textContent = `${$('case').selectedOptions[0].textContent} · ${$('mode').selectedOptions[0].textContent}`;
}
function renderEvidence() {
  const term = DATA.terms.find((entry) => entry.id === state.selected);
  const container = $('evidence'); container.replaceChildren();
  if (!term) {
    $('selected-label').textContent = 'No matching terms'; $('selected-counts').textContent = 'Change the search or filters to inspect a concept.';
    $('vocabulary-link').hidden = true; return;
  }
  $('vocabulary-link').hidden = false;
  $('selected-label').textContent = term.label;
  const counts = metrics(relevantEdges(term.id));
  $('selected-counts').textContent = `${counts.explicit} explicit paragraphs · ${counts.implicit} implicit paragraphs · ${counts.mentions} explicit mentions`;
  $('vocabulary-link').href = `../vocabulary.md#${term.id}`;
  for (const edge of relevantEdges(term.id)) {
    const item = DATA.cases.find((entry) => entry.id === edge.caseId);
    for (const entry of edge.evidence.filter((entry) => allowed(entry.kind))) {
      const article = element('article', { className: 'evidence-item' });
      const heading = element('h3'); heading.append(element('span', { className: `tag ${entry.kind}` }, entry.kind === 'explicit' ? 'E' : 'I'), document.createTextNode(item.label));
      article.append(heading, element('a', { href: `../research.md#${entry.paragraphId}`, className: 'source-link' }, `${entry.paragraphId} · Open report ↗`));
      if (entry.kind === 'explicit') {
        article.append(element('p', {}, `Named matches (${entry.mentions}): ${entry.matches.join(' / ')}`), element('blockquote', {}, entry.text));
      } else {
        article.append(element('blockquote', {}, entry.quote), element('p', {}, entry.rationale));
      }
      container.append(article);
    }
  }
}
for (const id of ['search', 'mode', 'case']) $(id).addEventListener(id === 'search' ? 'input' : 'change', render);
$('all-edges').addEventListener('click', () => { state.allEdges = !state.allEdges; render(); });
$('source-hash').textContent = `Report SHA-256: ${DATA.metadata.reportSha256} · Vocabulary SHA-256: ${DATA.metadata.vocabularySha256}`;
render();
