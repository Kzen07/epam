# epam

EPAM training assignment: practical generative AI applications, a vocabulary, and a reproducible relationship graph.

- [Research report](research.md): six application areas, two analysis paragraphs per case, twelve implementation examples, and fourteen primary sources.
- [Vocabulary](vocabulary.md): twenty technical terms with plain-language definitions and report examples; learner review is pending.
- [Relationship graph](graph/index.html): an interactive, offline map with separate explicit and implicit frequencies and inspectable evidence.
- [Counting methodology](graph/README.md): corpus boundaries, aliases, annotation rules, and limitations.

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
| Vocabulary Markdown file | Draft prepared; learner selection and explanation review pending |
| Optional relationship graph | Implemented with separate paragraph frequencies and evidence |
| Reproducibility | Build, freshness validation, and automated counting tests included |
| Required course-resource access | Pending: the course resource list and authenticated access checks have not been supplied |
| Submission text file | Pending: confirmed submission name and actual `@epam.com` email are required |
| Upload and final submission | Pending; requires the learner's explicit confirmation |

The plain-language vocabulary is a starting point. Before submission, the learner should select the terms they want to retain, explain selected definitions in their own words, and review the implicit annotations. This activity has not yet been completed and is not represented as finished manual work.

## Access checks

Checked on 30 October 2026: the public repository could be cloned; repository metadata identifies it as public; local Git is available; Git Credential Manager lists the account `Kzen07`. Successful publishing is verified through the actual Git push and subsequent remote checks, rather than inferred from credential presence. A connected GitHub integration returned `Unknown tool`, so this project uses the local Git client.

Public research documentation was read successfully. This does not establish authenticated access to EPAM's platform, DIAL, CodeMie, Copilot, or any paid product. No course login or platform submission has been verified. The original pasted instructions did not include the course's resource links.

## Submission procedure

After reviewing all requirements, prepare `Intro_<first_name>_<last_name>.txt` containing the actual EPAM email and this repository URL. The file is prepared outside this public repository. Do not substitute the Git commit email for the required EPAM email.

The original instructions allow only one upload attempt. The learner must explicitly confirm uploading the prepared file and submitting it on the training platform. No upload has been performed. Optional work and automation provide evidence of initiative, but the mentor determines the final score.
