const LANGUAGE_GROUPS = {
  beginner: ['C', 'C++', 'JavaScript', 'Python'],
  intermediate: ['Java', 'PHP', 'C#'],
  advanced: ['Go', 'TypeScript', 'Rust'],
};

const LANGUAGE_ORDER = [
  ...LANGUAGE_GROUPS.beginner,
  ...LANGUAGE_GROUPS.intermediate,
  ...LANGUAGE_GROUPS.advanced,
];

const LANGUAGE_LEVEL_BY_LANGUAGE = Object.entries(LANGUAGE_GROUPS).reduce((acc, [level, languages]) => {
  languages.forEach(language => {
    acc[language] = level;
  });
  return acc;
}, {});

const BEGINNER_TASKS = [
  {
    title: 'Reverse a String',
    description: language => `Write code in ${language} to read a single line string from stdin and print the reversed string.`,
    sampleInput: 'smarthire',
    sampleOutput: 'erihtrams',
    testCases: [
      { stdin: 'smarthire\n', expectedOutput: 'erihtrams\n' },
      { stdin: 'levelup\n', expectedOutput: 'pulevel\n' },
      { stdin: 'abc123\n', expectedOutput: '321cba\n' },
    ],
  },
  {
    title: 'FizzBuzz',
    description: language => `Write code in ${language} to read an integer N and print numbers from 1 to N. Print Fizz for multiples of 3, Buzz for multiples of 5, and FizzBuzz for multiples of both.`,
    sampleInput: '15',
    sampleOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz',
    testCases: [
      { stdin: '5\n', expectedOutput: '1 2 Fizz 4 Buzz\n' },
      { stdin: '15\n', expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz\n' },
      { stdin: '3\n', expectedOutput: '1 2 Fizz\n' },
    ],
  },
  {
    title: 'Array Sum',
    description: language => `Write code in ${language} to read an integer N, then N space-separated integers, and print their sum.`,
    sampleInput: '6\n4 8 15 16 23 42',
    sampleOutput: '108',
    testCases: [
      { stdin: '6\n4 8 15 16 23 42\n', expectedOutput: '108\n' },
      { stdin: '4\n-2 5 7 10\n', expectedOutput: '20\n' },
      { stdin: '1\n99\n', expectedOutput: '99\n' },
    ],
  },
  {
    title: 'Palindrome Checker',
    description: language => `Write code in ${language} to read a string and print true if it is a palindrome, otherwise print false.`,
    sampleInput: 'level',
    sampleOutput: 'true',
    testCases: [
      { stdin: 'level\n', expectedOutput: 'true\n' },
      { stdin: 'coding\n', expectedOutput: 'false\n' },
      { stdin: 'racecar\n', expectedOutput: 'true\n' },
    ],
  },
  {
    title: 'Count Vowels',
    description: language => `Write code in ${language} to read a string and print the number of vowels in it. Treat uppercase and lowercase vowels the same.`,
    sampleInput: 'Education',
    sampleOutput: '5',
    testCases: [
      { stdin: 'Education\n', expectedOutput: '5\n' },
      { stdin: 'sky\n', expectedOutput: '0\n' },
      { stdin: 'OpenAI\n', expectedOutput: '4\n' },
    ],
  },
  {
    title: 'Find Maximum Element',
    description: language => `Write code in ${language} to read an integer N, then N integers, and print the maximum value.`,
    sampleInput: '5\n3 9 1 7 4',
    sampleOutput: '9',
    testCases: [
      { stdin: '5\n3 9 1 7 4\n', expectedOutput: '9\n' },
      { stdin: '4\n-5 -2 -9 -1\n', expectedOutput: '-1\n' },
      { stdin: '1\n42\n', expectedOutput: '42\n' },
    ],
  },
  {
    title: 'Linear Search',
    description: language => `Write code in ${language} to read an integer N, then N integers, then a target value, and print the first index of the target. Print -1 if it does not exist.`,
    sampleInput: '5\n4 2 7 9 7\n7',
    sampleOutput: '2',
    testCases: [
      { stdin: '5\n4 2 7 9 7\n7\n', expectedOutput: '2\n' },
      { stdin: '4\n1 3 5 7\n2\n', expectedOutput: '-1\n' },
      { stdin: '6\n8 8 8 8 8 8\n8\n', expectedOutput: '0\n' },
    ],
  },
  {
    title: 'Factorial',
    description: language => `Write code in ${language} to read an integer N and print N factorial.`,
    sampleInput: '5',
    sampleOutput: '120',
    testCases: [
      { stdin: '5\n', expectedOutput: '120\n' },
      { stdin: '0\n', expectedOutput: '1\n' },
      { stdin: '7\n', expectedOutput: '5040\n' },
    ],
  },
  {
    title: 'Prime Number Check',
    description: language => `Write code in ${language} to read an integer N and print true if it is prime, otherwise print false.`,
    sampleInput: '29',
    sampleOutput: 'true',
    testCases: [
      { stdin: '29\n', expectedOutput: 'true\n' },
      { stdin: '1\n', expectedOutput: 'false\n' },
      { stdin: '18\n', expectedOutput: 'false\n' },
    ],
  },
  {
    title: 'Remove Duplicates',
    description: language => `Write code in ${language} to read an integer N, then N integers, and print the values without duplicates while keeping their first appearance order.`,
    sampleInput: '8\n1 2 2 3 4 4 5 3',
    sampleOutput: '1 2 3 4 5',
    testCases: [
      { stdin: '8\n1 2 2 3 4 4 5 3\n', expectedOutput: '1 2 3 4 5\n' },
      { stdin: '5\n9 9 9 9 9\n', expectedOutput: '9\n' },
      { stdin: '6\n5 4 3 2 1 0\n', expectedOutput: '5 4 3 2 1 0\n' },
    ],
  },
];

const INTERMEDIATE_TASKS = [
  {
    title: 'Binary Search',
    description: language => `Write code in ${language} to read a sorted array and a target value, then print the index of the target using binary search. Print -1 if it is absent.`,
    sampleInput: '5\n1 3 5 7 9\n7',
    sampleOutput: '3',
    testCases: [
      { stdin: '5\n1 3 5 7 9\n7\n', expectedOutput: '3\n' },
      { stdin: '6\n2 4 6 8 10 12\n5\n', expectedOutput: '-1\n' },
      { stdin: '1\n42\n42\n', expectedOutput: '0\n' },
    ],
  },
  {
    title: 'Linked List Reversal',
    description: language => `Write code in ${language} to read an integer N followed by N node values and print the linked list in reverse order as space-separated values.`,
    sampleInput: '5\n1 2 3 4 5',
    sampleOutput: '5 4 3 2 1',
    testCases: [
      { stdin: '5\n1 2 3 4 5\n', expectedOutput: '5 4 3 2 1\n' },
      { stdin: '3\n9 8 7\n', expectedOutput: '7 8 9\n' },
      { stdin: '1\n42\n', expectedOutput: '42\n' },
    ],
  },
  {
    title: 'Valid Parentheses',
    description: language => `Write code in ${language} to read a bracket string and print true if it is balanced, otherwise print false.`,
    sampleInput: '{[()]}',
    sampleOutput: 'true',
    testCases: [
      { stdin: '{[()]}\n', expectedOutput: 'true\n' },
      { stdin: '([)]\n', expectedOutput: 'false\n' },
      { stdin: '(((())))\n', expectedOutput: 'true\n' },
    ],
  },
  {
    title: 'Merge Two Sorted Arrays',
    description: language => `Write code in ${language} to read two sorted arrays and print one merged sorted array.`,
    sampleInput: '3 4\n1 3 5\n2 4 6 8',
    sampleOutput: '1 2 3 4 5 6 8',
    testCases: [
      { stdin: '3 4\n1 3 5\n2 4 6 8\n', expectedOutput: '1 2 3 4 5 6 8\n' },
      { stdin: '2 2\n-3 7\n-5 10\n', expectedOutput: '-5 -3 7 10\n' },
      { stdin: '1 3\n4\n1 2 3\n', expectedOutput: '1 2 3 4\n' },
    ],
  },
  {
    title: 'Two Sum',
    description: language => `Write code in ${language} to read an array and a target sum, then print the indices of the first pair that adds up to the target. Print -1 if no pair exists.`,
    sampleInput: '4\n2 7 11 15\n9',
    sampleOutput: '0 1',
    testCases: [
      { stdin: '4\n2 7 11 15\n9\n', expectedOutput: '0 1\n' },
      { stdin: '5\n3 2 4 6 7\n6\n', expectedOutput: '1 2\n' },
      { stdin: '4\n1 2 3 4\n10\n', expectedOutput: '-1\n' },
    ],
  },
  {
    title: 'Frequency Counter',
    description: language => `Write code in ${language} to read an integer N followed by N integers and print value:count pairs sorted by the numeric value.`,
    sampleInput: '6\n4 4 1 2 2 2',
    sampleOutput: '1:1 2:3 4:2',
    testCases: [
      { stdin: '6\n4 4 1 2 2 2\n', expectedOutput: '1:1 2:3 4:2\n' },
      { stdin: '5\n5 5 5 5 5\n', expectedOutput: '5:5\n' },
      { stdin: '7\n3 1 3 2 1 2 3\n', expectedOutput: '1:2 2:2 3:3\n' },
    ],
  },
  {
    title: 'Rotate Array',
    description: language => `Write code in ${language} to read an array and an integer K, then rotate the array to the right by K steps and print the result.`,
    sampleInput: '7\n1 2 3 4 5 6 7\n3',
    sampleOutput: '5 6 7 1 2 3 4',
    testCases: [
      { stdin: '7\n1 2 3 4 5 6 7\n3\n', expectedOutput: '5 6 7 1 2 3 4\n' },
      { stdin: '5\n10 20 30 40 50\n1\n', expectedOutput: '50 10 20 30 40\n' },
      { stdin: '4\n1 2 3 4\n6\n', expectedOutput: '3 4 1 2\n' },
    ],
  },
  {
    title: 'Queue Using Stacks',
    description: language => `Write code in ${language} to process queue commands using stack-based logic. Input starts with Q, then Q lines of PUSH x, POP, or PEEK. Print outputs for POP and PEEK in order, using EMPTY when needed.`,
    sampleInput: '7\nPUSH 5\nPUSH 9\nPEEK\nPOP\nPOP\nPOP\nPUSH 1',
    sampleOutput: '5 5 9 EMPTY',
    testCases: [
      { stdin: '7\nPUSH 5\nPUSH 9\nPEEK\nPOP\nPOP\nPOP\nPUSH 1\n', expectedOutput: '5 5 9 EMPTY\n' },
      { stdin: '5\nPOP\nPUSH 3\nPEEK\nPOP\nPOP\n', expectedOutput: 'EMPTY 3 3 EMPTY\n' },
      { stdin: '6\nPUSH 1\nPUSH 2\nPOP\nPUSH 3\nPEEK\nPOP\n', expectedOutput: '1 2 2\n' },
    ],
  },
  {
    title: 'Longest Common Prefix',
    description: language => `Write code in ${language} to read N strings and print their longest common prefix. Print - if there is no common prefix.`,
    sampleInput: '3\nflower\nflow\nflight',
    sampleOutput: 'fl',
    testCases: [
      { stdin: '3\nflower\nflow\nflight\n', expectedOutput: 'fl\n' },
      { stdin: '3\ndog\nracecar\ncar\n', expectedOutput: '-\n' },
      { stdin: '4\ninterview\ninternet\ninternal\ninto\n', expectedOutput: 'int\n' },
    ],
  },
  {
    title: 'Group Anagrams',
    description: language => `Write code in ${language} to read N words, group anagrams together, sort each group alphabetically, sort groups by their first word, and print groups joined by " | ".`,
    sampleInput: '6\neat\ntea\ntan\nate\nnat\nbat',
    sampleOutput: 'ate eat tea | bat | nat tan',
    testCases: [
      { stdin: '6\neat\ntea\ntan\nate\nnat\nbat\n', expectedOutput: 'ate eat tea | bat | nat tan\n' },
      { stdin: '4\nabc\nbca\ncab\nfoo\n', expectedOutput: 'abc bca cab | foo\n' },
      { stdin: '5\nlisten\nsilent\nenlist\ngoogle\ngogole\n', expectedOutput: 'enlist listen silent | gogole google\n' },
    ],
  },
];

const ADVANCED_TASKS = [
  {
    title: 'Merge Intervals',
    description: language => `Write code in ${language} to read N intervals and print the merged non-overlapping intervals in the format "start end | start end".`,
    sampleInput: '4\n1 3\n2 6\n8 10\n15 18',
    sampleOutput: '1 6 | 8 10 | 15 18',
    testCases: [
      { stdin: '4\n1 3\n2 6\n8 10\n15 18\n', expectedOutput: '1 6 | 8 10 | 15 18\n' },
      { stdin: '5\n1 4\n4 5\n6 8\n7 9\n10 12\n', expectedOutput: '1 5 | 6 9 | 10 12\n' },
      { stdin: '3\n1 10\n2 3\n4 5\n', expectedOutput: '1 10\n' },
    ],
  },
  {
    title: 'Longest Common Subsequence',
    description: language => `Write code in ${language} to read two strings and print the length of their longest common subsequence.`,
    sampleInput: 'ABCBDAB\nBDCABA',
    sampleOutput: '4',
    testCases: [
      { stdin: 'ABCBDAB\nBDCABA\n', expectedOutput: '4\n' },
      { stdin: 'AGGTAB\nGXTXAYB\n', expectedOutput: '4\n' },
      { stdin: 'abc\ndef\n', expectedOutput: '0\n' },
    ],
  },
  {
    title: 'Top K Frequent Elements',
    description: language => `Write code in ${language} to read an array and an integer K, then print the K most frequent values ordered by frequency descending and value ascending.`,
    sampleInput: '6 2\n1 1 1 2 2 3',
    sampleOutput: '1 2',
    testCases: [
      { stdin: '6 2\n1 1 1 2 2 3\n', expectedOutput: '1 2\n' },
      { stdin: '8 3\n4 4 4 6 6 2 2 2\n', expectedOutput: '2 4 6\n' },
      { stdin: '5 1\n9 9 8 8 7\n', expectedOutput: '8\n' },
    ],
  },
  {
    title: 'Course Schedule',
    description: language => `Write code in ${language} to read the number of courses and prerequisite pairs, then print true if all courses can be finished, otherwise print false.`,
    sampleInput: '2 1\n1 0',
    sampleOutput: 'true',
    testCases: [
      { stdin: '2 1\n1 0\n', expectedOutput: 'true\n' },
      { stdin: '2 2\n1 0\n0 1\n', expectedOutput: 'false\n' },
      { stdin: '4 3\n1 0\n2 1\n3 2\n', expectedOutput: 'true\n' },
    ],
  },
  {
    title: 'Dijkstra Shortest Path',
    description: language => `Write code in ${language} to read a weighted directed graph and print the shortest distance from source to target. Print -1 when the target is unreachable.`,
    sampleInput: '5 6\n1 2 2\n1 3 5\n2 3 1\n2 4 2\n3 5 3\n4 5 1\n1 5',
    sampleOutput: '5',
    testCases: [
      { stdin: '5 6\n1 2 2\n1 3 5\n2 3 1\n2 4 2\n3 5 3\n4 5 1\n1 5\n', expectedOutput: '5\n' },
      { stdin: '4 2\n1 2 4\n3 4 1\n1 4\n', expectedOutput: '-1\n' },
      { stdin: '4 5\n1 2 1\n2 3 2\n1 3 5\n3 4 1\n2 4 6\n1 4\n', expectedOutput: '4\n' },
    ],
  },
  {
    title: 'Sliding Window Maximum',
    description: language => `Write code in ${language} to read an array and a window size K, then print the maximum value in each sliding window.`,
    sampleInput: '8 3\n1 3 -1 -3 5 3 6 7',
    sampleOutput: '3 3 5 5 6 7',
    testCases: [
      { stdin: '8 3\n1 3 -1 -3 5 3 6 7\n', expectedOutput: '3 3 5 5 6 7\n' },
      { stdin: '5 2\n9 7 5 3 1\n', expectedOutput: '9 7 5 3\n' },
      { stdin: '6 4\n4 2 12 3 8 1\n', expectedOutput: '12 12 12\n' },
    ],
  },
  {
    title: 'LRU Cache',
    description: language => `Write code in ${language} to simulate an LRU cache. Input starts with capacity and Q, followed by PUT key value or GET key commands. Print results for GET commands in order, using -1 for missing keys.`,
    sampleInput: '2 9\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4',
    sampleOutput: '1 -1 -1 3 4',
    testCases: [
      { stdin: '2 9\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4\n', expectedOutput: '1 -1 -1 3 4\n' },
      { stdin: '1 6\nPUT 5 50\nGET 5\nPUT 7 70\nGET 5\nGET 7\nGET 8\n', expectedOutput: '50 -1 70 -1\n' },
      { stdin: '3 7\nPUT 1 10\nPUT 2 20\nPUT 3 30\nGET 2\nPUT 4 40\nGET 1\nGET 4\n', expectedOutput: '20 -1 40\n' },
    ],
  },
  {
    title: 'Trie Prefix Search',
    description: language => `Write code in ${language} to build a trie from given words and print how many words match each query prefix.`,
    sampleInput: '5 3\napple\napp\napply\nbat\nbatch\napp\nba\ncat',
    sampleOutput: '3 2 0',
    testCases: [
      { stdin: '5 3\napple\napp\napply\nbat\nbatch\napp\nba\ncat\n', expectedOutput: '3 2 0\n' },
      { stdin: '4 2\ncode\ncoder\ncoding\ncope\nco\ncod\n', expectedOutput: '4 3\n' },
      { stdin: '3 3\nrust\nruby\nrun\nru\nr\nz\n', expectedOutput: '3 3 0\n' },
    ],
  },
  {
    title: 'Word Ladder',
    description: language => `Write code in ${language} to read a begin word, an end word, and a dictionary, then print the shortest transformation length. Print 0 when no transformation exists.`,
    sampleInput: 'hit cog\n6\nhot\ndot\ndog\nlot\nlog\ncog',
    sampleOutput: '5',
    testCases: [
      { stdin: 'hit cog\n6\nhot\ndot\ndog\nlot\nlog\ncog\n', expectedOutput: '5\n' },
      { stdin: 'hit cog\n5\nhot\ndot\ndog\nlot\nlog\n', expectedOutput: '0\n' },
      { stdin: 'lost cost\n5\nmost\nfost\ncost\nhost\nlost\n', expectedOutput: '2\n' },
    ],
  },
  {
    title: 'Kth Largest Element',
    description: language => `Write code in ${language} to read an array and an integer K, then print the Kth largest element.`,
    sampleInput: '6 2\n3 2 1 5 6 4',
    sampleOutput: '5',
    testCases: [
      { stdin: '6 2\n3 2 1 5 6 4\n', expectedOutput: '5\n' },
      { stdin: '9 4\n3 2 3 1 2 4 5 5 6\n', expectedOutput: '4\n' },
      { stdin: '5 1\n7 9 8 4 6\n', expectedOutput: '9\n' },
    ],
  },
];

const TASKS_BY_LEVEL = {
  beginner: BEGINNER_TASKS,
  intermediate: INTERMEDIATE_TASKS,
  advanced: ADVANCED_TASKS,
};

const LANGUAGE_RUNTIME_HINTS = {
  C: 'Read from stdin and print the required output to stdout.',
  'C++': 'Read from stdin and print the required output to stdout.',
  Java: 'Use class Main, read from standard input, and print the required output.',
  JavaScript: 'Read from stdin and print the required output to stdout.',
  Python: 'Read from stdin and print the required output to stdout.',
  PHP: 'Read from STDIN and echo the required output.',
  'C#': 'Use class Program, read from standard input, and print the required output.',
  Go: 'Read from stdin and print the required output to stdout.',
  TypeScript: 'Read from stdin and print the required output to stdout.',
  Rust: 'Read from stdin and print the required output to stdout.',
};

function buildStarterCode(language, title) {
  const comment = `Solve: ${title}`;

  switch (language) {
    case 'C':
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    // ${comment}\n    // ${LANGUAGE_RUNTIME_HINTS[language]}\n    return 0;\n}\n`;
    case 'C++':
      return `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // ${comment}\n    // ${LANGUAGE_RUNTIME_HINTS[language]}\n    return 0;\n}\n`;
    case 'Java':
      return `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // ${comment}\n        // ${LANGUAGE_RUNTIME_HINTS[language]}\n    }\n}\n`;
    case 'JavaScript':
      return `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\n\n// ${comment}\n// ${LANGUAGE_RUNTIME_HINTS[language]}\n`;
    case 'Python':
      return `import sys\n\ninput_data = sys.stdin.read().strip()\n\n# ${comment}\n# ${LANGUAGE_RUNTIME_HINTS[language]}\n`;
    case 'PHP':
      return `<?php\n$input = trim(stream_get_contents(STDIN));\n\n// ${comment}\n// ${LANGUAGE_RUNTIME_HINTS[language]}\n`;
    case 'C#':
      return `using System;\nusing System.Linq;\nusing System.Collections.Generic;\n\npublic class Program {\n    public static void Main() {\n        // ${comment}\n        // ${LANGUAGE_RUNTIME_HINTS[language]}\n    }\n}\n`;
    case 'Go':
      return `package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    _ = bufio.NewReader(os.Stdin)\n    // ${comment}\n    // ${LANGUAGE_RUNTIME_HINTS[language]}\n    fmt.Print(\"\")\n}\n`;
    case 'TypeScript':
      return `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim();\n\n// ${comment}\n// ${LANGUAGE_RUNTIME_HINTS[language]}\n`;
    case 'Rust':
      return `use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    // ${comment}\n    // ${LANGUAGE_RUNTIME_HINTS[language]}\n}\n`;
    default:
      return `// ${comment}\n// ${LANGUAGE_RUNTIME_HINTS[language] || 'Read from stdin and print the required output.'}\n`;
  }
}

const CODING_PROBLEMS = LANGUAGE_ORDER.flatMap(language => {
  const languageLevel = LANGUAGE_LEVEL_BY_LANGUAGE[language];
  const levelTasks = TASKS_BY_LEVEL[languageLevel];

  return levelTasks.map((task, index) => ({
    title: task.title,
    description: task.description(language),
    difficulty: languageLevel,
    language,
    language_level: languageLevel,
    task_number: index + 1,
    starter_code: buildStarterCode(language, task.title),
    sample_input: task.sampleInput,
    sample_output: task.sampleOutput,
    test_cases: task.testCases,
  }));
});

module.exports = {
  CODING_PROBLEMS,
  LANGUAGE_GROUPS,
  LANGUAGE_LEVEL_BY_LANGUAGE,
  LANGUAGE_ORDER,
  TASKS_BY_LEVEL,
};
