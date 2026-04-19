const CODING_LANGUAGES = [
  'C++',
  'Java',
  'JavaScript',
  'Python',
  'C',
  'C#',
  'Go',
  'TypeScript',
  'PHP',
  'Rust',
];

const PROBLEM_TEMPLATES = [
  {
    title: 'Reverse a String',
    difficulty: 'beginner',
    description: language => `Write a solution in ${language} that returns the reversed version of the input string.`,
    sampleInput: 'smart',
    sampleOutput: 'trams',
  },
  {
    title: 'FizzBuzz',
    difficulty: 'beginner',
    description: language => `Write a solution in ${language} that prints the FizzBuzz sequence from 1 to N.`,
    sampleInput: '15',
    sampleOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz',
  },
  {
    title: 'Array Sum',
    difficulty: 'beginner',
    description: language => `Write a solution in ${language} that returns the sum of all values in the array.`,
    sampleInput: '[4, 8, 15, 16, 23, 42]',
    sampleOutput: '108',
  },
  {
    title: 'Palindrome Checker',
    difficulty: 'beginner',
    description: language => `Write a solution in ${language} that checks whether the input string is a palindrome.`,
    sampleInput: 'level',
    sampleOutput: 'true',
  },
  {
    title: 'Binary Search',
    difficulty: 'intermediate',
    description: language => `Write a solution in ${language} that returns the index of the target value in a sorted array using binary search.`,
    sampleInput: 'nums=[1,3,5,7,9], target=7',
    sampleOutput: '3',
  },
  {
    title: 'Linked List Reversal',
    difficulty: 'intermediate',
    description: language => `Write a solution in ${language} that reverses a singly linked list.`,
    sampleInput: '1->2->3->4->5',
    sampleOutput: '5->4->3->2->1',
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'intermediate',
    description: language => `Write a solution in ${language} that validates whether brackets in the string are balanced.`,
    sampleInput: '{[()]}',
    sampleOutput: 'true',
  },
  {
    title: 'Merge Intervals',
    difficulty: 'advanced',
    description: language => `Write a solution in ${language} that merges all overlapping intervals and returns the simplified list.`,
    sampleInput: '[[1,3],[2,6],[8,10],[15,18]]',
    sampleOutput: '[[1,6],[8,10],[15,18]]',
  },
  {
    title: 'Longest Common Subsequence',
    difficulty: 'advanced',
    description: language => `Write a solution in ${language} that returns the length of the longest common subsequence for the two input strings.`,
    sampleInput: 'ABCBDAB, BDCABA',
    sampleOutput: '4',
  },
  {
    title: 'Top K Frequent Elements',
    difficulty: 'advanced',
    description: language => `Write a solution in ${language} that returns the k most frequent numbers in the array.`,
    sampleInput: 'nums=[1,1,1,2,2,3], k=2',
    sampleOutput: '[1,2]',
  },
];

const CODING_PROBLEMS = CODING_LANGUAGES.flatMap(language =>
  PROBLEM_TEMPLATES.map(problem => ({
    title: problem.title,
    description: problem.description(language),
    difficulty: problem.difficulty,
    language,
    sample_input: problem.sampleInput,
    sample_output: problem.sampleOutput,
  }))
);

module.exports = {
  CODING_LANGUAGES,
  CODING_PROBLEMS,
  PROBLEM_TEMPLATES,
};
