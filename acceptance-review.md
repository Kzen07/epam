# Acceptance review

| Requirement | Concrete repository evidence | Limits or remaining human actions |
| --- | --- | --- |
| Six application cases with two anchored analysis paragraphs each | `research.md` contains six numbered sections (`## 1.` through `## 6.`) and the anchored analysis paragraphs in the report (`support-p1` ... `education-p2`) total twelve. | This confirms structure only; a human reviewer still needs to judge whether the analysis is technically sound and appropriately scoped. |
| Each case has at least two implementation bullets with a bold linked name and a nonempty description | Each numbered case includes an `### Existing implementations` section with at least two bullet entries such as `- **[GitHub Copilot](...)** offers ...` in the report. | The static check does not verify that the product links are current or that the examples are exhaustive. |
| Source table integrity and source-marker resolution | `research.md` lists 14 unique `Sxx` IDs and their HTTPS links, and the document references in the analysis paragraphs resolve to the same IDs. | Browser access to the external vendor pages is not validated by this static check. |
| Twenty-term vocabulary inventory and anchor coverage | `graph/terms.json` contains 20 term IDs, each with a label and aliases; `vocabulary.md` contains one matching anchor per term ID. | Semantic review of the definitions and their examples remains a human responsibility. |
| Vocabulary examples resolve to real report paragraphs | Each vocabulary term includes a `([report](research.md#...))` example and the target paragraph ids exist in `research.md`. | The review does not prove that every example is pedagogically ideal or that the term usage is semantically complete. |
| Graph integrity and structural consistency | `graph/usage-data.json` reports six cases, twelve paragraphs, and twenty terms; edge targets, duplicate checks, total counts, and SHA-256 hashes are consistent with the repository inputs. | The graph validates structure and counts, not the truth of the report or the correctness of every implicit annotation. |
| Standalone HTML exists with embedded graph data | `graph/index.html` exists and embeds the generated graph data (`const DATA = ...`). | Presence of the HTML is not proof of successful browser rendering or interaction. |
| Remote URL and access notes are documented | `README.md` includes the GitHub remote for `Kzen07/epam`, and `access-checks.md` records the known unavailable resources (AIST and EliteA). | The owner still needs to confirm any course login, upload, and final submission steps outside the repository. |
| No maximum-grade claim is made | The repository text states that the final score is determined by the mentor and does not claim a maximum grade or award. | This is a documentation check only; it does not replace the platform's grading decision. |

## Architecture explanation

The repository uses a simple three-layer pipeline. The primary source is `research.md`, which defines the six application cases, twelve analysis paragraphs, and the fourteen source citations. `graph/terms.json` defines the 20 vocabulary terms and their aliases, and `vocabulary.md` contains the human-readable definitions and report examples. `scripts/build-graph.mjs` reads the report and vocabulary, applies the alias and annotation logic, and emits `graph/usage-data.json` plus the standalone `graph/index.html` viewer.

The graph is bipartite: vocabulary terms are linked to application cases by evidence that originates in the anchored paragraphs. A term-case edge may include explicit evidence (matching alias text) or implicit evidence (annotated interpretation without a direct lexical match). The relationship between vocabulary terms and report paragraphs is evidenced by the term definitions in `vocabulary.md`, which point back to actual paragraph anchors like `research.md#support-p1`, and by the graph data in `graph/usage-data.json`, which records paragraph-level evidence for each term-case relationship.

For example, the `llm` term has an anchor in `vocabulary.md` (`<a id="llm"></a>`) and an example that links to `research.md#support-p1`; the generated graph data also records the `llm` term in the support and knowledge cases. This provides traceability from a vocabulary definition to the report paragraph and then to the graph evidence. The same pattern is used across the other term IDs.

## Evidence and review limits

This acceptance review is intentionally structural: it checks required counts, link targets, duplicate relationships, hash consistency, and documented repository metadata. It does not prove scientific correctness, successful platform access, or the final learner grade. The owner should still execute the validator and review the report wording, graph annotations, and course-access status before any submission decision.
