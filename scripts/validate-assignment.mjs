#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const readText = async (relativePath) => readFile(path.join(rootDir, relativePath), 'utf8');
const fileExists = async (relativePath) => {
  try {
    await access(path.join(rootDir, relativePath), constants.F_OK);
    return true;
  } catch {
    return false;
  }
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pushError = (errors, message) => errors.push(message);

const fail = (errors) => {
  console.error('Assignment validation failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
};

(async () => {
  const errors = [];

  const reportText = await readText('research.md');
  const vocabularyText = await readText('vocabulary.md');
  const accessText = await readText('access-checks.md');
  const readmeText = await readText('README.md');
  const terms = JSON.parse(await readText('graph/terms.json'));
  const usageData = JSON.parse(await readText('graph/usage-data.json'));

  const caseHeadingMatches = [...reportText.matchAll(/^##\s+(\d+)\.\s+([^\n]+)$/gm)];
  if (caseHeadingMatches.length !== 6) {
    pushError(errors, `Expected six numbered application cases, found ${caseHeadingMatches.length}.`);
  }

  const paragraphMatches = [...reportText.matchAll(/<a id="([a-z0-9-]+-p[12])"><\/a>/g)];
  const paragraphIds = paragraphMatches.map((match) => match[1]);
  const paragraphsByCase = new Map();
  for (const paragraphId of paragraphIds) {
    const caseId = paragraphId.replace(/-p[12]$/, '');
    const current = paragraphsByCase.get(caseId) ?? [];
    current.push(paragraphId);
    paragraphsByCase.set(caseId, current);
  }
  if (paragraphIds.length !== 12) {
    pushError(errors, `Expected 12 anchored analysis paragraphs, found ${paragraphIds.length}.`);
  }
  for (const [caseId, ids] of paragraphsByCase.entries()) {
    if (ids.length !== 2) {
      pushError(errors, `Case ${caseId} must have exactly two anchored analysis paragraphs; found ${ids.length}.`);
    }
  }

  const numberedCaseSections = [];
  for (let index = 0; index < caseHeadingMatches.length; index += 1) {
    const match = caseHeadingMatches[index];
    const start = match.index + match[0].length;
    const end = caseHeadingMatches[index + 1]?.index ?? reportText.length;
    numberedCaseSections.push({
      number: match[1],
      title: match[2].trim(),
      section: reportText.slice(start, end),
    });
  }

  for (const section of numberedCaseSections) {
    const implementationMatch = section.section.match(/### Existing implementations\s*([\s\S]+)/i);
    if (!implementationMatch) {
      pushError(errors, `Case ${section.title} is missing an "Existing implementations" section.`);
      continue;
    }
    const bulletMatches = [...implementationMatch[1].matchAll(/^-\s*\*\*\[[^\]]+\]\((https?:\/\/[^)]+)\)\*\*(.*)$/gm)];
    if (bulletMatches.length < 2) {
      pushError(errors, `Case ${section.title} must contain at least two implementation bullets with bold-linked names.`);
    }
    for (const [, , description] of bulletMatches) {
      if (!description.trim()) {
        pushError(errors, `Case ${section.title} has an implementation bullet with an empty description.`);
      }
    }
  }

  const sourceRows = [...reportText.matchAll(/^\|\s*(S\d+)\s*\|\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)\s*\|\s*[^|]+\|\s*$/gm)];
  const sourceIds = sourceRows.map((match) => match[1]);
  if (sourceIds.length !== 14 || new Set(sourceIds).size !== 14) {
    pushError(errors, `Expected 14 unique source IDs in the report table; found ${sourceIds.length} rows with ${new Set(sourceIds).size} unique IDs.`);
  }
  for (const match of sourceRows) {
    if (!match[2].startsWith('https://')) {
      pushError(errors, `Source ${match[1]} does not use an HTTPS link: ${match[2]}`);
    }
  }

  const referenceIds = [...new Set([...reportText.matchAll(/\[(S\d+(?:\s*,\s*S\d+)*)\]/g)].flatMap((match) => match[1].split(/\s*,\s*/)))];
  const validReportIds = new Set(sourceIds);
  for (const refId of referenceIds) {
    if (!validReportIds.has(refId)) {
      pushError(errors, `Source marker ${refId} is used in the report but missing from the source table.`);
    }
  }

  const termList = Array.isArray(terms) ? terms : [];
  if (termList.length !== 20 || new Set(termList.map((term) => term.id)).size !== 20) {
    pushError(errors, `Expected 20 unique vocabulary term IDs in graph/terms.json; found ${termList.length} entries.`);
  }
  const termIdSet = new Set();
  const vocabularyAnchorMatches = [...vocabularyText.matchAll(/<a id="([a-z0-9-]+)"><\/a>/g)];
  const vocabAnchorIds = vocabularyAnchorMatches.map((match) => match[1]);
  for (const term of termList) {
    if (!term.id || typeof term.id !== 'string') {
      pushError(errors, 'Encountered a term without an ID.');
      continue;
    }
    if (termIdSet.has(term.id)) {
      pushError(errors, `Duplicate term ID found in graph/terms.json: ${term.id}`);
    }
    termIdSet.add(term.id);
    if (!term.label || !String(term.label).trim()) {
      pushError(errors, `Term ${term.id} is missing a nonempty label.`);
    }
    if (!Array.isArray(term.aliases) || term.aliases.length === 0 || term.aliases.some((alias) => typeof alias !== 'string' || !alias.trim())) {
      pushError(errors, `Term ${term.id} must have at least one nonempty alias.`);
    }
    const anchorCount = vocabAnchorIds.filter((anchorId) => anchorId === term.id).length;
    if (anchorCount !== 1) {
      pushError(errors, `Term ${term.id} must have exactly one vocabulary anchor; found ${anchorCount}.`);
    }
    const termSectionAnchorIndex = vocabularyAnchorMatches.findIndex((match) => match[1] === term.id);
    if (termSectionAnchorIndex === -1) {
      continue;
    }
    const nextAnchorIndex = vocabularyAnchorMatches[termSectionAnchorIndex + 1]?.index ?? vocabularyText.length;
    const section = vocabularyText.slice(vocabularyAnchorMatches[termSectionAnchorIndex].index + vocabularyAnchorMatches[termSectionAnchorIndex][0].length, nextAnchorIndex);
    const reportLinks = [...section.matchAll(/\[report\]\(research\.md#([a-z0-9-]+)\)/g)].map((match) => match[1]);
    if (reportLinks.length === 0) {
      pushError(errors, `Term ${term.id} has no valid report example link in vocabulary.md.`);
    }
    const validParagraphIds = new Set(paragraphIds);
    for (const reportLink of reportLinks) {
      if (!validParagraphIds.has(reportLink)) {
        pushError(errors, `Term ${term.id} points to a missing paragraph anchor: research.md#${reportLink}`);
      }
    }
  }

  const htmlExists = await fileExists('graph/index.html');
  if (!htmlExists) {
    pushError(errors, 'graph/index.html is missing.');
  } else {
    const htmlText = await readText('graph/index.html');
    if (!/const\s+DATA\s*=|"cases"\s*:\s*\[/.test(htmlText)) {
      pushError(errors, 'graph/index.html does not contain embedded graph data.');
    }
  }

  const reportSha256 = createHash('sha256').update(reportText, 'utf8').digest('hex');
  const vocabularySha256 = createHash('sha256').update(vocabularyText, 'utf8').digest('hex');
  if (!usageData?.metadata) {
    pushError(errors, 'graph/usage-data.json is missing metadata for the report and vocabulary hashes.');
  } else {
    if (usageData.metadata.reportSha256 !== reportSha256) {
      pushError(errors, `Report hash mismatch: graph metadata reports ${usageData.metadata.reportSha256}, but research.md is ${reportSha256}.`);
    }
    if (usageData.metadata.vocabularySha256 !== vocabularySha256) {
      pushError(errors, `Vocabulary hash mismatch: graph metadata reports ${usageData.metadata.vocabularySha256}, but vocabulary.md is ${vocabularySha256}.`);
    }
  }

  if (!Array.isArray(usageData?.cases) || usageData.cases.length !== 6) {
    pushError(errors, `graph/usage-data.json must contain exactly six cases; found ${usageData?.cases?.length ?? 'none'}.`);
  }
  if (!Array.isArray(usageData?.paragraphs) || usageData.paragraphs.length !== 12) {
    pushError(errors, `graph/usage-data.json must contain exactly twelve paragraphs; found ${usageData?.paragraphs?.length ?? 'none'}.`);
  }
  if (!Array.isArray(usageData?.terms) || usageData.terms.length !== 20) {
    pushError(errors, `graph/usage-data.json must contain exactly twenty terms; found ${usageData?.terms?.length ?? 'none'}.`);
  }

  const validCaseIds = new Set((usageData?.cases ?? []).map((entry) => entry.id));
  const validTermIds = new Set((usageData?.terms ?? []).map((entry) => entry.id));
  const validParagraphIds = new Set((usageData?.paragraphs ?? []).map((entry) => entry.id));
  const edgeCaseSeen = new Set();
  const paragraphEvidenceSeen = new Set();
  const paragraphKindSeen = new Map();

  for (const edge of usageData?.edges ?? []) {
    if (!validTermIds.has(edge.termId)) {
      pushError(errors, `Edge references an unknown term ID: ${edge.termId}`);
    }
    if (!validCaseIds.has(edge.caseId)) {
      pushError(errors, `Edge references an unknown case ID: ${edge.caseId}`);
    }
    const key = `${edge.termId}:${edge.caseId}`;
    if (edgeCaseSeen.has(key)) {
      pushError(errors, `Duplicate term/case edge found: ${key}`);
    }
    edgeCaseSeen.add(key);

    if (!Array.isArray(edge.evidence)) {
      pushError(errors, `Edge ${key} is missing evidence.`);
      continue;
    }
    const recomputedExplicit = edge.evidence.filter((entry) => entry.kind === 'explicit').length;
    const recomputedImplicit = edge.evidence.filter((entry) => entry.kind === 'implicit').length;
    const recomputedMentions = edge.evidence.reduce((sum, entry) => sum + (Number(entry.mentions) || 0), 0);
    if (edge.explicit !== recomputedExplicit || edge.implicit !== recomputedImplicit || edge.mentions !== recomputedMentions) {
      pushError(errors, `Edge ${key} totals do not match its evidence counts: explicit=${edge.explicit}/${recomputedExplicit}, implicit=${edge.implicit}/${recomputedImplicit}, mentions=${edge.mentions}/${recomputedMentions}.`);
    }

    for (const evidence of edge.evidence) {
      if (!validParagraphIds.has(evidence.paragraphId)) {
        pushError(errors, `Edge ${key} references an unknown paragraph ID: ${evidence.paragraphId}`);
        continue;
      }

      const paragraphKey = `${edge.termId}:${evidence.paragraphId}`;
      if (paragraphEvidenceSeen.has(paragraphKey)) {
        pushError(errors, `Duplicate term/paragraph evidence pair found: ${paragraphKey}`);
      }
      paragraphEvidenceSeen.add(paragraphKey);
      const kindSet = paragraphKindSeen.get(paragraphKey) ?? new Set();
      kindSet.add(evidence.kind);
      paragraphKindSeen.set(paragraphKey, kindSet);
      if (kindSet.size > 1) {
        pushError(errors, `Term/paragraph pair ${paragraphKey} contains both explicit and implicit evidence.`);
      }
    }
  }

  for (const term of usageData?.terms ?? []) {
    const edgesForTerm = (usageData?.edges ?? []).filter((edge) => edge.termId === term.id);
    const sumExplicit = edgesForTerm.reduce((sum, edge) => sum + edge.explicit, 0);
    const sumImplicit = edgesForTerm.reduce((sum, edge) => sum + edge.implicit, 0);
    const sumMentions = edgesForTerm.reduce((sum, edge) => sum + edge.mentions, 0);
    if (term.explicit !== sumExplicit || term.implicit !== sumImplicit || term.mentions !== sumMentions) {
      pushError(errors, `Term totals do not match edge totals for ${term.id}: term=${term.explicit}/${term.implicit}/${term.mentions}; edges=${sumExplicit}/${sumImplicit}/${sumMentions}.`);
    }
  }

  if (!/https:\/\/github\.com\/Kzen07\/epam(?:\.git)?/i.test(readmeText)) {
    pushError(errors, 'README.md does not document the repository remote URL for Kzen07/epam.');
  }
  if (!/AIST/i.test(accessText) || !/EliteA/i.test(accessText)) {
    pushError(errors, 'access-checks.md must record the known unavailable resources (AIST and EliteA).');
  }
  if (/maximum grade|maximum score.*grade|grade.*awarded|awarded.*grade/i.test(readmeText) || /maximum grade|maximum score.*grade|grade.*awarded|awarded.*grade/i.test(accessText)) {
    pushError(errors, 'The report should not claim that a maximum grade has been awarded.');
  }

  if (errors.length > 0) {
    fail(errors);
  }

  console.log('Assignment validation checks passed: report structure, source resolution, vocabulary anchors, graph integrity, HTML embedding, and access metadata.');
})().catch((error) => {
  console.error('Assignment validation failed unexpectedly.');
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
