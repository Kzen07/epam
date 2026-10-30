# Relationship graph methodology

## What the graph represents

This is a bipartite graph: vocabulary terms on the left and research application areas on the right. An edge means that a term is used in at least one analysis paragraph of that application area. It is not a claim that one term causes another or that terms joined to the same case always occur together. Select a term, use the relationship or application filters, or search for an alias. The evidence inspector provides report anchors, named matches, exact quotations, and interpretation reasons.

The [PNG overview](relationships.png) and [SVG version](relationships.svg) show the same bipartite relationships as an adjacency matrix: twenty term rows by six application columns. Each cell contains separate E and I paragraph counts, and the final column contains each term's totals. This view exposes all relationships without crossed lines; the HTML remains the evidence-inspection view.

Solid blue lines represent explicit usage; dashed amber lines represent implicit usage. They are displayed separately even when both kinds occur in different paragraphs of the same case. Edge labels show paragraph counts within that case. The frequency ledger also reports literal explicit mentions as a secondary measure.

## Corpus and units

The corpus is exactly the twelve anchored analysis paragraphs in `research.md`: `support-p1` through `education-p2`, two per case. Headings, introduction, implementation lists, conclusions, source tables, and the vocabulary are excluded. This prevents repeated product descriptions or definitions from inflating frequencies.

For term `t` and application case `c`:

```text
E(t,c) = number of case c's paragraphs with at least one accepted alias match for t
I(t,c) = number of case c's paragraphs with a recorded implicit annotation for t
M(t,c) = number of accepted explicit textual matches for t in those paragraphs
```

E and I use the same primary unit: distinct paragraphs per term. Within a case each ranges from zero to two. Global E and I each range from zero to twelve per term. A term-paragraph pair cannot contribute to both E and I. Different terms may contribute in the same paragraph, so totals summed across terms can exceed twelve. A missing edge means no recorded usage under these rules, not proof that the concept is absent in every possible interpretation.

Example: `large language model (LLM)` contains two accepted explicit mentions of the same concept but contributes just one explicit paragraph. If a different paragraph describes that concept without an alias and has an annotation, it contributes one implicit paragraph instead. The graph never adds M to E or compares mention totals directly with implicit paragraph totals.

## Explicit matching

`terms.json` defines the term IDs, labels, and aliases. The matcher normalizes Unicode compatibility forms and common hyphens, ignores case, and respects letter, number, and underscore boundaries. It matches listed aliases only; it does not infer arbitrary stems or synonyms.

The longest overlapping phrase wins across all terms. For example, `prompt injection` counts for Prompt injection, rather than also being a plain Prompt match. Matches at separate positions remain separate mentions. This makes the narrower term the primary lexical interpretation and avoids nested phrase inflation. It is a documented counting convention rather than a universal linguistic rule.

## Implicit interpretation

`annotations.json` contains curated term-paragraph interpretations. Each includes a known term ID, a known report paragraph ID, an exact quotation from the paragraph, and a rationale. It describes a concept without an accepted explicit match for that term in the same paragraph. At most one implicit observation is recorded for each term-paragraph pair.

For example, document analysis describes a malicious PDF instruction that attempts to redirect the assistant's task without saying `prompt injection`; the quotation and rationale connect it to that term. Generic mentions of “quality” or “time” are not enough on their own. Context and a specific semantic link are required.

These annotations are interpretive and pending learner review. They cover the recorded conceptual references, not all possible implicit meanings. Another reviewer could reasonably change the coding. The script validates evidence integrity and consistency, but cannot prove semantic correctness. Review quotations and reasons before submission and rebuild after edits. No statistical model or external service is invoked during the build.

## Reproduction and validation

```sh
npm run build
npm test
npm run check
npm run check:export
```

The build fails on unknown IDs, missing vocabulary anchors, absent quotes, missing reasons, duplicate implicit pairs, explicit/implicit overlap, missing corpus paragraphs, or vocabulary terms without report usage. It stores report and vocabulary SHA-256 hashes in the generated data. Output is deterministic for identical inputs; no build timestamp changes the files on every run.

Tests exercise word boundaries, overlapping phrases, Unicode dash normalization, occurrence-versus-paragraph counts, evidence validation, and corpus completeness. They verify the calculation rules, not the truth of the report or the educational value of a definition. The HTML embeds its data, styles, and scripts, so it works directly from a downloaded repository.

`npm run export` regenerates the SVG without dependencies. The optional `npm run export:png` command uses `sharp` to regenerate the PNG at double resolution and records source and output hashes in `png-export.json`. See the root README for installation of this optional renderer. The export check validates that the SVG, PNG bytes, and recorded graph-data version agree; no rendering package is needed to check the committed export.
