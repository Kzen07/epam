# epam

EPAM training assignment: practical generative AI applications, a vocabulary, and a reproducible relationship graph.

- [Research report](research.md): six application areas, two analysis paragraphs per case, twelve implementation examples, and fourteen primary sources.
- [Vocabulary](vocabulary.md): twenty technical terms with plain-language definitions and report examples; personal review has started with five terms.
- [Relationship graph](graph/index.html): an interactive, offline map with separate explicit and implicit frequencies and inspectable evidence.
- [Counting methodology](graph/README.md): corpus boundaries, aliases, annotation rules, and limitations.
- [Resource access checks](access-checks.md): the supplied course resources, observed sign-in pages, and outstanding access issues.

## View and reproduce

Download or clone the repository, then open `graph/index.html` in a browser. GitHub's file view displays the HTML source rather than running it. The generated page is self-contained and needs no server, API key, external library, or network connection.

To rebuild, use Node.js 20 or newer. There are no package dependencies and no installation step.

```sh
git clone https://github.com/Kzen07/epam.git
cd epam
npm run build
npm test
npm run check
```

`build` produces `graph/usage-data.json` and `graph/index.html`. `check` fails if those files no longer match their source inputs. GitHub Actions runs the checks on pushes and pull requests.

## Project structure

```text
research.md                 Application report and sources
vocabulary.md               Definitions and examples
access-checks.md            Course resources and access-check results
graph/
  README.md                 Counting and interpretation rules
  terms.json                Term IDs and explicit aliases
  annotations.json          Implicit evidence and reasons
  template.html             Viewer page structure
  style.css                 Viewer styles
  viewer.js                 Filters, graph, and evidence inspector
  usage-data.json            Generated counts and evidence
  index.html                Generated standalone viewer
scripts/
  analysis.mjs              Corpus extraction and counting
  build-graph.mjs            Reproducible artifact generation
tests/
  analysis.test.mjs          Counting and annotation checks
.github/workflows/
  validate.yml              Automated validation
```

## Assignment readiness

| Requirement | Current state |
| --- | --- |
| Dedicated shareable repository | Public repository: [Kzen07/epam](https://github.com/Kzen07/epam) |
| Research Markdown file | Prepared with six cases and linked implementations |
| Vocabulary Markdown file | Prepared; personal learning notes added for five terms, further review pending |
| Optional relationship graph | Implemented with separate paragraph frequencies and evidence |
| Reproducibility | Build, freshness validation, and automated counting tests included |
| Required course-resource access | Check documented: learner reports that only AIST and EliteA do not open; direct observations and the separate Copilot Free / educational-license uncertainty are recorded in [access checks](access-checks.md) |
| Submission text file | Prepared separately as `Intro_Aldiyar_Amantay.txt` with the learner-supplied EPAM email and the verified repository URL |
| Upload and final submission | Pending; requires the learner's explicit confirmation |

The learner has contributed initial explanations for RAG, hallucination, tool calling, and human-in-the-loop, and identified fine-tuning as an unfamiliar concept. The vocabulary records those starting points and clarified distinctions. Further review of the definitions and implicit annotations remains pending; a full independent review is not claimed.

## Access checks

Checked on 30 October 2026: the repository is public, Git clone and push succeeded, the remote commit matched the local commit, and GitHub associated the author and committer with `Kzen07`. The initial GitHub Actions validation completed successfully. A connected GitHub integration returned `Unknown tool`, so this project uses the local Git client.

The learner subsequently supplied the course resource list and confirmed that only AIST and EliteA do not open; the remaining listed resources open in the learner's session. Direct checks observed a DNS failure for the supplied EliteA hostname and a browser navigation timeout for AIST. The authenticated GitHub settings page displayed Copilot Free; the course-provided educational license remains unconfirmed. See [access-checks.md](access-checks.md) for the distinction between direct observations and learner-reported access. Course enrollment and upload controls have not been independently inspected, and no platform submission has been performed.

## Submission procedure

`Intro_Aldiyar_Amantay.txt` has been prepared outside this public repository using the learner-supplied EPAM email and the verified repository URL. It contains exactly those two lines, without labels or extra comments. The Git commit email is not used in place of the EPAM email.

The original instructions allow only one upload attempt. The learner must explicitly confirm uploading the prepared file and submitting it on the training platform. No upload has been performed. Optional work and automation provide evidence of initiative, but the mentor determines the final score.
