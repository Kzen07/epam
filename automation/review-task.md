# Assignment review task

Read the repository and create exactly these two files:

1. `scripts/validate-assignment.mjs`: a Node.js ES module using built-ins only. It must exit nonzero with clear diagnostics when a structural acceptance requirement fails. Make it runnable from any working directory by resolving inputs relative to `import.meta.url`.
2. `automation/acceptance-review.md`: a concise English acceptance matrix with requirement, concrete repository evidence, and limits or remaining human actions. Include a short architecture explanation and evidence of the relationship between vocabulary terms and report paragraphs.

Validate these substantive requirements:

- The research report has six numbered application cases with two anchored analysis paragraphs each, and each case has at least two implementation bullets containing a bold linked name and a nonempty descriptive sentence. Check per case, rather than just a global bullet count.
- The report's source table contains fourteen unique source IDs and HTTPS source links. Every source marker used in analysis paragraphs resolves to an existing source ID.
- There are twenty unique term IDs in `graph/terms.json`, each with nonempty labels and aliases, and each ID has exactly one vocabulary anchor and at least one valid report example link in its vocabulary entry. Validate that the target report paragraph actually exists.
- The generated graph data has exactly six cases, twelve paragraphs, and twenty terms. Validate all edge targets, recompute paragraph counts from the edge evidence, ensure no duplicate term/case edges or term/paragraph evidence pairs, and ensure a term/paragraph pair cannot have both explicit and implicit evidence. Check that the per-term totals equal their edge sums and that the source hashes match the report and vocabulary bytes.
- The standalone HTML file exists and contains embedded graph data. Do not treat the HTML's presence as proof of successful browser testing.
- The repository remote URL is documented, known unavailable resources are recorded, and the report does not claim that a maximum grade has been awarded.

Important scope limits:

- Do not change the research report, definitions, graph source files, existing tests, package scripts, workflow, or Git configuration. The repository owner will review and wire in the new validator.
- Do not create or modify the submission text file or include the learner's private email.
- Do not claim to have run commands: command execution is unavailable to this profile. State which checks are implemented and which require the owner to execute them.
- Treat the current learner-review and resource-access notes honestly. Do not claim that every definition has been manually written or independently reviewed, or that an educational Copilot license was provisioned.
- Do not claim that merely configuring this profile proves it was successfully invoked. The separate execution record will be written only after a verified run.
- The original grading rubric gives a 70-point formal baseline for accounts, a shareable repository, and the two Markdown files; manual vocabulary work and the optional graph can add points, and use of coding or agent tooling demonstrates initiative. Do not calculate or award a final score.

Before finishing, inspect your two files for inconsistent assumptions. Report the files you created and any unresolved questions. Do not commit or push.
