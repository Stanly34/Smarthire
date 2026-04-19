const axios = require('axios');

const IN_QUEUE_STATUS = 1;
const PROCESSING_STATUS = 2;
const ACCEPTED_STATUS = 3;
const POLL_ATTEMPTS = 20;
const POLL_DELAY_MS = 500;
const DEFAULT_JUDGE0_URL = 'https://ce.judge0.com';

let languageCache = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJudge0BaseUrl() {
  return (process.env.JUDGE0_URL || DEFAULT_JUDGE0_URL).replace(/\/+$/, '');
}

function getJudge0Headers() {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.JUDGE0_API_KEY) {
    headers['X-Auth-Token'] = process.env.JUDGE0_API_KEY;
  }

  return headers;
}

function pickLatestLanguageId(languages, matcher, fallbackMatcher) {
  const directMatches = languages.filter(language => matcher(language.name));
  const targetMatches = directMatches.length > 0 ? directMatches : languages.filter(language => fallbackMatcher(language.name));

  if (targetMatches.length === 0) {
    return null;
  }

  return targetMatches.sort((left, right) => right.id - left.id)[0].id;
}

function resolveLanguageId(languageName, languages) {
  switch (languageName) {
    case 'C':
      return pickLatestLanguageId(
        languages,
        name => /^C\s*\(/.test(name),
        name => /^C\b/.test(name) && !/^C\+\+/.test(name) && !/^C#/.test(name)
      );
    case 'C++':
      return pickLatestLanguageId(languages, name => /^C\+\+\s*\(/.test(name), name => /^C\+\+/.test(name));
    case 'Java':
      return pickLatestLanguageId(languages, name => /^Java\s*\(/.test(name), name => /^Java\b/.test(name));
    case 'JavaScript':
      return pickLatestLanguageId(languages, name => /^JavaScript\s*\(/.test(name), name => /^JavaScript\b/.test(name));
    case 'Python':
      return pickLatestLanguageId(languages, name => /^Python\s*\(3/.test(name), name => /^Python\b/.test(name));
    case 'PHP':
      return pickLatestLanguageId(languages, name => /^PHP\s*\(/.test(name), name => /^PHP\b/.test(name));
    case 'C#':
      return pickLatestLanguageId(languages, name => /^C#\s*\(/.test(name), name => /^C#/.test(name));
    case 'Go':
      return pickLatestLanguageId(languages, name => /^Go\s*\(/.test(name), name => /^Go\b/.test(name));
    case 'TypeScript':
      return pickLatestLanguageId(languages, name => /^TypeScript\s*\(/.test(name), name => /^TypeScript\b/.test(name));
    case 'Rust':
      return pickLatestLanguageId(languages, name => /^Rust\s*\(/.test(name), name => /^Rust\b/.test(name));
    default:
      return null;
  }
}

async function fetchLanguages() {
  if (languageCache) {
    return languageCache;
  }

  const response = await axios.get(`${getJudge0BaseUrl()}/languages`, {
    headers: getJudge0Headers(),
  });

  languageCache = response.data;
  return languageCache;
}

async function getLanguageId(languageName) {
  const languages = await fetchLanguages();
  const languageId = resolveLanguageId(languageName, languages);

  if (!languageId) {
    throw new Error(`Judge0 does not support configured language "${languageName}".`);
  }

  return languageId;
}

async function createSubmissionBatch(submissions) {
  const response = await axios.post(
    `${getJudge0BaseUrl()}/submissions/batch?base64_encoded=false`,
    { submissions },
    { headers: getJudge0Headers() }
  );

  return Array.isArray(response.data) ? response.data : response.data?.submissions || [];
}

async function fetchSubmissionBatch(tokens) {
  const response = await axios.get(`${getJudge0BaseUrl()}/submissions/batch`, {
    headers: getJudge0Headers(),
    params: {
      tokens: tokens.join(','),
      base64_encoded: false,
      fields: 'token,stdout,stderr,compile_output,message,status',
    },
  });

  return Array.isArray(response.data) ? response.data : response.data?.submissions || [];
}

async function waitForBatchResults(tokens) {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    const results = await fetchSubmissionBatch(tokens);
    const isComplete = results.every(
      result => result.status && ![IN_QUEUE_STATUS, PROCESSING_STATUS].includes(result.status.id)
    );

    if (isComplete) {
      return results;
    }

    await sleep(POLL_DELAY_MS);
  }

  throw new Error('Judge0 execution timed out while waiting for submission results.');
}

function formatFailureFeedback(result, index) {
  const compilerOutput = result.compile_output?.trim();
  const stderr = result.stderr?.trim();
  const message = result.message?.trim();
  const details = compilerOutput || stderr || message || result.status?.description || 'Unknown execution failure';
  return `Test case ${index + 1} failed: ${details}`;
}

async function executeCodeAgainstTests({ language, sourceCode, testCases }) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error('This coding problem does not have executable test cases configured.');
  }

  const languageId = await getLanguageId(language);
  const submissions = testCases.map(testCase => ({
    language_id: languageId,
    source_code: sourceCode,
    stdin: testCase.stdin,
    expected_output: testCase.expectedOutput,
    cpu_time_limit: 2,
    wall_time_limit: 5,
    memory_limit: 128000,
  }));

  let tokenPayload;
  try {
    tokenPayload = await createSubmissionBatch(submissions);
  } catch (error) {
    const remoteMessage = error.response?.data?.error || error.response?.data?.message;
    throw new Error(remoteMessage || `Judge0 submission failed: ${error.message}`);
  }

  const tokens = tokenPayload.map(item => item.token).filter(Boolean);
  if (tokens.length !== submissions.length) {
    throw new Error('Judge0 rejected one or more submission payloads.');
  }

  let results;
  try {
    results = await waitForBatchResults(tokens);
  } catch (error) {
    throw new Error(error.message || 'Judge0 did not return execution results in time.');
  }

  const caseResults = results.map((result, index) => ({
    index,
    passed: result.status?.id === ACCEPTED_STATUS,
    status: result.status?.description || 'Unknown',
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compile_output: result.compile_output || '',
    message: result.message || '',
  }));

  const passedCount = caseResults.filter(testCase => testCase.passed).length;
  const totalCases = caseResults.length;
  const passed = passedCount === totalCases;
  const score = Math.round((passedCount / totalCases) * 100);
  const firstFailure = caseResults.find(testCase => !testCase.passed);

  return {
    passed,
    score,
    passedCount,
    totalCases,
    caseResults,
    feedback: passed ? 'All hidden test cases passed.' : formatFailureFeedback(firstFailure, firstFailure.index),
  };
}

module.exports = {
  executeCodeAgainstTests,
};
