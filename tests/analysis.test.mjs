import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, countExplicit, extractParagraphs } from '../scripts/analysis.mjs';

const terms = [
  { id: 'prompt', aliases: ['prompt', 'prompts'] },
  { id: 'prompt-injection', aliases: ['prompt injection'] },
  { id: 'rag', aliases: ['RAG', 'retrieval-augmented generation'] },
];

test('longest phrase takes precedence; boundaries prevent substring matches', () => {
  const hits = countExplicit('Prompt injection uses a PROMPT; prompts differ from prompting. A fragment is not RAG.', terms);
  assert.deepEqual(hits.map((hit) => hit.termId), ['prompt-injection', 'prompt', 'prompt', 'rag']);
});

test('matching normalizes dash variants and case', () => {
  assert.equal(countExplicit('Retrieval‑augmented generation and rag', terms).filter((hit) => hit.termId === 'rag').length, 2);
});

test('several named mentions count as one explicit paragraph', () => {
  const result = analyze([{ id: 'support-p1', caseId: 'support', text: 'A prompt plus another prompt.' }], terms, []);
  const term = result.terms.find((item) => item.id === 'prompt');
  assert.equal(term.mentions, 2); assert.equal(term.explicit, 1); assert.equal(term.implicit, 0);
});

test('implicit evidence requires an exact quotation and excludes explicit pairs', () => {
  const paragraph = { id: 'support-p1', caseId: 'support', text: 'A structured brief.' };
  const entry = { termId: 'prompt', paragraphId: paragraph.id, quote: paragraph.text, rationale: 'Task instructions supplied to a model.' };
  assert.equal(analyze([paragraph], terms, [entry]).terms[0].implicit, 1);
  assert.throws(() => analyze([paragraph], terms, [{ ...entry, quote: 'Missing words' }]), /Missing evidence/);
  assert.throws(() => analyze([paragraph], terms, [entry, entry]), /Duplicate annotation/);
  assert.throws(() => analyze([{ ...paragraph, text: 'A prompt.' }], terms, [{ ...entry, quote: 'A prompt.' }]), /overlap/);
});

test('corpus parser rejects a missing or repeated case paragraph', () => {
  assert.throws(() => extractParagraphs('<a id="support-p1"></a>\n\nOnly one paragraph.'), /exactly two/);
});
