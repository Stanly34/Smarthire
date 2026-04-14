/**
 * Seed script: 20 demo students, 10 demo companies, 20 extra coding problems
 * Run: node scripts/seed_demo.js
 */
const bcrypt = require('bcrypt');
const db = require('../db');

const PASS_HASH = bcrypt.hashSync('demo123', 10);

// ── Students ──────────────────────────────────────────────────────────────────
const students = [
  { email: 'arjun.sharma@student.com',   full_name: 'Arjun Sharma',      department: 'Computer Science',       year: 3, cgpa: 8.9, coding_score: 82, skills: [1,6,7,10,34] },
  { email: 'priya.nair@student.com',     full_name: 'Priya Nair',        department: 'Information Technology', year: 4, cgpa: 9.2, coding_score: 91, skills: [2,9,24,8,34] },
  { email: 'rahul.verma@student.com',    full_name: 'Rahul Verma',       department: 'Computer Science',       year: 3, cgpa: 7.5, coding_score: 70, skills: [3,27,8,10,34] },
  { email: 'sneha.patel@student.com',    full_name: 'Sneha Patel',       department: 'Electronics',            year: 4, cgpa: 8.1, coding_score: 65, skills: [1,30,6,38,37] },
  { email: 'karthik.r@student.com',      full_name: 'Karthik R',         department: 'Computer Science',       year: 2, cgpa: 8.7, coding_score: 88, skills: [2,9,24,42,10] },
  { email: 'divya.menon@student.com',    full_name: 'Divya Menon',       department: 'Information Technology', year: 4, cgpa: 9.0, coding_score: 78, skills: [1,6,30,39,36] },
  { email: 'vikram.singh@student.com',   full_name: 'Vikram Singh',      department: 'Computer Science',       year: 3, cgpa: 7.8, coding_score: 72, skills: [4,5,10,42,35] },
  { email: 'ananya.kumar@student.com',   full_name: 'Ananya Kumar',      department: 'Data Science',           year: 4, cgpa: 9.4, coding_score: 95, skills: [2,9,24,8,34] },
  { email: 'rohan.das@student.com',      full_name: 'Rohan Das',         department: 'Computer Science',       year: 3, cgpa: 7.2, coding_score: 60, skills: [1,7,19,22,39] },
  { email: 'pooja.iyer@student.com',     full_name: 'Pooja Iyer',        department: 'Information Technology', year: 4, cgpa: 8.5, coding_score: 80, skills: [3,27,8,21,34] },
  { email: 'aditya.joshi@student.com',   full_name: 'Aditya Joshi',      department: 'Computer Science',       year: 2, cgpa: 8.3, coding_score: 76, skills: [1,6,7,30,37] },
  { email: 'meera.pillai@student.com',   full_name: 'Meera Pillai',      department: 'AI & ML',                year: 4, cgpa: 9.1, coding_score: 93, skills: [2,9,24,42,10] },
  { email: 'suresh.babu@student.com',    full_name: 'Suresh Babu',       department: 'Computer Science',       year: 3, cgpa: 7.0, coding_score: 55, skills: [3,8,10,34,35] },
  { email: 'lakshmi.n@student.com',      full_name: 'Lakshmi N',         department: 'Information Technology', year: 4, cgpa: 8.8, coding_score: 85, skills: [1,6,29,38,36] },
  { email: 'nikhil.gupta@student.com',   full_name: 'Nikhil Gupta',      department: 'Computer Science',       year: 3, cgpa: 8.0, coding_score: 74, skills: [31,32,33,35,34] },
  { email: 'kavya.reddy@student.com',    full_name: 'Kavya Reddy',       department: 'Data Science',           year: 4, cgpa: 9.3, coding_score: 90, skills: [2,9,24,8,40] },
  { email: 'amit.chauhan@student.com',   full_name: 'Amit Chauhan',      department: 'Computer Science',       year: 2, cgpa: 7.6, coding_score: 68, skills: [1,7,19,39,34] },
  { email: 'shreya.bose@student.com',    full_name: 'Shreya Bose',       department: 'Information Technology', year: 4, cgpa: 8.6, coding_score: 83, skills: [3,27,21,8,39] },
  { email: 'pranav.more@student.com',    full_name: 'Pranav More',       department: 'Computer Science',       year: 3, cgpa: 7.9, coding_score: 71, skills: [4,5,10,42,43] },
  { email: 'ishaan.kapoor@student.com',  full_name: 'Ishaan Kapoor',     department: 'Computer Science',       year: 4, cgpa: 8.4, coding_score: 79, skills: [1,6,30,28,38] },
];

// ── Companies ────────────────────────────────────────────────────────────────
const companies = [
  { email: 'infosys@hire.com',        password: 'company123', company_name: 'Infosys',           industry: 'IT Services',     location: 'Bengaluru',  contact_person: 'Ravi Anand',    phone: '9800001111',
    jobs: [
      { title: 'Systems Engineer',        description: 'Design and implement scalable systems.', location: 'Bengaluru', salary_range: '4-7 LPA',   min_cgpa: 6.5, min_coding_score: 55, skills: [3,8,10,34] },
      { title: 'Java Backend Developer',  description: 'Build microservices with Spring Boot.',  location: 'Pune',      salary_range: '6-10 LPA',  min_cgpa: 7.0, min_coding_score: 60, skills: [3,27,8,21] },
    ]
  },
  { email: 'tcs@hire.com',            password: 'company123', company_name: 'TCS',               industry: 'IT Consulting',   location: 'Mumbai',     contact_person: 'Anjali Mehta',  phone: '9800002222',
    jobs: [
      { title: 'Associate Software Engineer', description: 'Full lifecycle software development.', location: 'Hyderabad', salary_range: '3.5-6 LPA', min_cgpa: 6.0, min_coding_score: 50, skills: [1,3,8,34] },
    ]
  },
  { email: 'wipro@hire.com',          password: 'company123', company_name: 'Wipro',             industry: 'IT Services',     location: 'Hyderabad',  contact_person: 'Sunil Rao',     phone: '9800003333',
    jobs: [
      { title: 'Frontend Developer',      description: 'Build user interfaces using React.',     location: 'Chennai',   salary_range: '5-9 LPA',   min_cgpa: 6.5, min_coding_score: 60, skills: [1,6,30,36,37] },
    ]
  },
  { email: 'google@hire.com',         password: 'company123', company_name: 'Google India',      industry: 'Technology',      location: 'Bengaluru',  contact_person: 'Preethi S',     phone: '9800004444',
    jobs: [
      { title: 'Software Engineer III',   description: 'Work on large-scale distributed systems.', location: 'Bengaluru', salary_range: '25-45 LPA', min_cgpa: 8.5, min_coding_score: 90, skills: [1,2,10,42,43] },
      { title: 'ML Engineer',             description: 'Build and deploy ML models at scale.',   location: 'Bengaluru', salary_range: '30-50 LPA', min_cgpa: 8.5, min_coding_score: 88, skills: [2,9,24,42,10] },
    ]
  },
  { email: 'amazon@hire.com',         password: 'company123', company_name: 'Amazon Development Center', industry: 'E-Commerce / Cloud', location: 'Hyderabad', contact_person: 'Deepak Nair', phone: '9800005555',
    jobs: [
      { title: 'SDE-1 (Backend)',         description: 'Build Amazon services in Java/Python.',  location: 'Hyderabad', salary_range: '20-35 LPA', min_cgpa: 8.0, min_coding_score: 85, skills: [1,2,3,10,42] },
    ]
  },
  { email: 'flipkart@hire.com',       password: 'company123', company_name: 'Flipkart',          industry: 'E-Commerce',      location: 'Bengaluru',  contact_person: 'Anand Krishnan', phone: '9800006666',
    jobs: [
      { title: 'Product Engineer',        description: 'Own and build product features end-to-end.', location: 'Bengaluru', salary_range: '18-28 LPA', min_cgpa: 7.5, min_coding_score: 80, skills: [1,7,8,19,39] },
      { title: 'Data Engineer',           description: 'Build data pipelines and analytics.',    location: 'Bengaluru', salary_range: '15-25 LPA', min_cgpa: 7.5, min_coding_score: 75, skills: [2,8,24,21,34] },
    ]
  },
  { email: 'zomato@hire.com',         password: 'company123', company_name: 'Zomato',            industry: 'Food-Tech',       location: 'Gurugram',   contact_person: 'Nitin Sharma',  phone: '9800007777',
    jobs: [
      { title: 'Backend Engineer',        description: 'Scale Zomato ordering infrastructure.',  location: 'Gurugram',  salary_range: '12-20 LPA', min_cgpa: 7.0, min_coding_score: 70, skills: [2,7,19,8,39] },
    ]
  },
  { email: 'swiggy@hire.com',         password: 'company123', company_name: 'Swiggy',            industry: 'Food-Tech',       location: 'Bengaluru',  contact_person: 'Rahul Jain',    phone: '9800008888',
    jobs: [
      { title: 'Full Stack Engineer',     description: 'Build consumer-facing features.',        location: 'Bengaluru', salary_range: '14-22 LPA', min_cgpa: 7.0, min_coding_score: 72, skills: [1,6,7,30,39] },
    ]
  },
  { email: 'razorpay@hire.com',       password: 'company123', company_name: 'Razorpay',          industry: 'FinTech',         location: 'Bengaluru',  contact_person: 'Vivek Kumar',   phone: '9800009999',
    jobs: [
      { title: 'Software Engineer – Payments', description: 'Build reliable payment systems.', location: 'Bengaluru', salary_range: '16-26 LPA', min_cgpa: 7.5, min_coding_score: 78, skills: [1,7,8,19,43] },
    ]
  },
  { email: 'byju@hire.com',           password: 'company123', company_name: "BYJU'S",            industry: 'EdTech',          location: 'Bengaluru',  contact_person: 'Sanjana Pillai', phone: '9800000000',
    jobs: [
      { title: 'React Developer',         description: 'Build interactive learning UI.',          location: 'Bengaluru', salary_range: '8-14 LPA',  min_cgpa: 6.5, min_coding_score: 60, skills: [1,6,30,38,36] },
    ]
  },
];

// ── Coding Problems ──────────────────────────────────────────────────────────
const problems = [
  // Easy
  { title: 'Reverse a String',            difficulty: 'beginner',   topic: 'Strings',          language: 'python',     description: 'Write a function to reverse a given string.',
    sample_input: '"hello"', sample_output: '"olleh"',
    solution_template: 'def reverse_string(s):\n    # your code here\n    pass',
    explanation: 'Use slicing s[::-1] or a loop to reverse the string.' },
  { title: 'Count Vowels',                 difficulty: 'beginner',   topic: 'Strings',          language: 'python',     description: 'Count the number of vowels in a string.',
    sample_input: '"education"', sample_output: '5',
    solution_template: 'def count_vowels(s):\n    # your code here\n    pass',
    explanation: 'Iterate and check if each character is in "aeiouAEIOU".' },
  { title: 'Find Maximum in Array',        difficulty: 'beginner',   topic: 'Arrays',           language: 'python',     description: 'Find the maximum element in an unsorted array.',
    sample_input: '[3, 1, 7, 2, 9, 4]', sample_output: '9',
    solution_template: 'def find_max(arr):\n    # your code here\n    pass',
    explanation: 'Use built-in max() or iterate to track the maximum.' },
  { title: 'Check Palindrome',             difficulty: 'beginner',   topic: 'Strings',          language: 'python',     description: 'Check if a string is a palindrome.',
    sample_input: '"racecar"', sample_output: 'True',
    solution_template: 'def is_palindrome(s):\n    # your code here\n    pass',
    explanation: 'Compare string with its reverse: s == s[::-1].' },
  { title: 'Sum of Digits',                difficulty: 'beginner',   topic: 'Math',             language: 'python',     description: 'Find the sum of digits of a given number.',
    sample_input: '1234', sample_output: '10',
    solution_template: 'def sum_of_digits(n):\n    # your code here\n    pass',
    explanation: 'Extract each digit using % 10 and divide by 10.' },
  { title: 'Remove Duplicates from Array', difficulty: 'beginner',   topic: 'Arrays',           language: 'javascript', description: 'Remove duplicate elements from an array.',
    sample_input: '[1, 2, 2, 3, 4, 4, 5]', sample_output: '[1, 2, 3, 4, 5]',
    solution_template: 'function removeDuplicates(arr) {\n  // your code here\n}',
    explanation: 'Use [...new Set(arr)] or filter with indexOf.' },
  { title: 'Count Words in String',        difficulty: 'beginner',   topic: 'Strings',          language: 'python',     description: 'Count the number of words in a sentence.',
    sample_input: '"hello world foo"', sample_output: '3',
    solution_template: 'def count_words(s):\n    # your code here\n    pass',
    explanation: 'Split by whitespace and return length: len(s.split()).' },

  // Medium
  { title: 'Two Sum',                      difficulty: 'intermediate', topic: 'Arrays',           language: 'python',     description: 'Given an array and a target sum, return indices of two numbers that add up to the target.',
    sample_input: 'nums=[2,7,11,15], target=9', sample_output: '[0, 1]',
    solution_template: 'def two_sum(nums, target):\n    # your code here\n    pass',
    explanation: 'Use a hashmap to store complements. O(n) time complexity.' },
  { title: 'Longest Common Prefix',        difficulty: 'intermediate', topic: 'Strings',          language: 'python',     description: 'Find the longest common prefix string amongst an array of strings.',
    sample_input: '["flower","flow","flight"]', sample_output: '"fl"',
    solution_template: 'def longest_common_prefix(strs):\n    # your code here\n    pass',
    explanation: 'Sort the list and compare the first and last strings character by character.' },
  { title: 'Valid Parentheses',            difficulty: 'intermediate', topic: 'Stacks',           language: 'javascript', description: 'Determine if a string of parentheses, brackets, and braces is valid.',
    sample_input: '"()[]{}"', sample_output: 'true',
    solution_template: 'function isValid(s) {\n  // your code here\n}',
    explanation: 'Use a stack: push open brackets, pop and verify on close brackets.' },
  { title: 'Binary Search',               difficulty: 'intermediate', topic: 'Searching',        language: 'python',     description: 'Implement binary search on a sorted array.',
    sample_input: 'arr=[1,3,5,7,9], target=5', sample_output: '2',
    solution_template: 'def binary_search(arr, target):\n    # your code here\n    pass',
    explanation: 'Maintain lo and hi pointers, check mid each iteration.' },
  { title: 'Merge Two Sorted Arrays',      difficulty: 'intermediate', topic: 'Arrays',           language: 'python',     description: 'Merge two sorted arrays into one sorted array.',
    sample_input: '[1,3,5], [2,4,6]', sample_output: '[1,2,3,4,5,6]',
    solution_template: 'def merge_sorted(a, b):\n    # your code here\n    pass',
    explanation: 'Use two pointers, compare elements and build result array.' },
  { title: 'Fibonacci with Memoization',   difficulty: 'intermediate', topic: 'Dynamic Programming', language: 'python',  description: 'Return the nth Fibonacci number using memoization.',
    sample_input: 'n=10', sample_output: '55',
    solution_template: 'def fib(n, memo={}):\n    # your code here\n    pass',
    explanation: 'Cache results in a dictionary to avoid redundant recursive calls.' },
  { title: 'Rotate Array',                 difficulty: 'intermediate', topic: 'Arrays',           language: 'javascript', description: 'Rotate an array to the right by k steps.',
    sample_input: 'nums=[1,2,3,4,5,6,7], k=3', sample_output: '[5,6,7,1,2,3,4]',
    solution_template: 'function rotate(nums, k) {\n  // your code here\n}',
    explanation: 'Use three reverses: reverse all, reverse first k, reverse rest.' },
  { title: 'Anagram Check',               difficulty: 'intermediate', topic: 'Strings',          language: 'python',     description: 'Check if two strings are anagrams of each other.',
    sample_input: '"anagram", "nagaram"', sample_output: 'True',
    solution_template: 'def is_anagram(s, t):\n    # your code here\n    pass',
    explanation: 'Sort both strings and compare, or use character frequency maps.' },
  { title: 'Linked List Cycle Detection',  difficulty: 'intermediate', topic: 'Linked Lists',     language: 'python',     description: 'Detect if a linked list has a cycle.',
    sample_input: 'head = [3,2,0,-4] with tail connects to node 1', sample_output: 'True',
    solution_template: 'def has_cycle(head):\n    # your code here\n    pass',
    explanation: "Floyd's cycle detection: use slow and fast pointers." },

  // Hard
  { title: 'Longest Substring Without Repeating Characters', difficulty: 'advanced', topic: 'Strings', language: 'python',
    description: 'Find the length of the longest substring without repeating characters.',
    sample_input: '"abcabcbb"', sample_output: '3',
    solution_template: 'def length_of_longest_substring(s):\n    # your code here\n    pass',
    explanation: 'Sliding window + hashmap to track character positions. O(n) time.' },
  { title: 'Maximum Subarray (Kadane\'s)', difficulty: 'advanced', topic: 'Dynamic Programming', language: 'python',
    description: 'Find the contiguous subarray with the largest sum.',
    sample_input: '[-2,1,-3,4,-1,2,1,-5,4]', sample_output: '6',
    solution_template: 'def max_subarray(nums):\n    # your code here\n    pass',
    explanation: "Kadane's algorithm: track current_sum and max_sum, reset when current_sum < 0." },
  { title: 'Course Schedule (Topological Sort)', difficulty: 'advanced', topic: 'Graphs', language: 'python',
    description: 'Given n courses and prerequisites, determine if you can finish all courses.',
    sample_input: 'numCourses=2, prerequisites=[[1,0]]', sample_output: 'True',
    solution_template: 'def can_finish(numCourses, prerequisites):\n    # your code here\n    pass',
    explanation: 'Build adjacency list, use DFS/BFS with cycle detection (topological sort).' },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('Starting seed...\n');

  // Insert students
  console.log('Inserting 20 students...');
  for (const s of students) {
    try {
      const existing = await db.query('SELECT id FROM users WHERE email=$1', [s.email]);
      if (existing.rows.length > 0) { console.log(`  SKIP (exists): ${s.email}`); continue; }

      const uRes = await db.query(
        'INSERT INTO users (email, password, role, is_approved) VALUES ($1,$2,$3,$4) RETURNING id',
        [s.email, PASS_HASH, 'student', true]
      );
      const userId = uRes.rows[0].id;

      const sRes = await db.query(
        `INSERT INTO students (user_id, full_name, department, year_of_study, cgpa, coding_score,
          bio, linkedin_url, github_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [userId, s.full_name, s.department, s.year, s.cgpa, s.coding_score,
          `Passionate ${s.department} student with ${s.year} years of experience in software development.`,
          `https://linkedin.com/in/${s.full_name.toLowerCase().replace(/ /g, '-')}`,
          `https://github.com/${s.full_name.toLowerCase().replace(/ /g, '')}`
        ]
      );
      const studentId = sRes.rows[0].id;

      for (const skillId of s.skills) {
        await db.query(
          'INSERT INTO student_skills (student_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [studentId, skillId]
        ).catch(() => {});
      }
      console.log(`  ✓ ${s.full_name}`);
    } catch (err) {
      console.error(`  ✗ ${s.email}: ${err.message}`);
    }
  }

  // Insert companies + jobs
  console.log('\nInserting 10 companies...');
  for (const c of companies) {
    try {
      const existing = await db.query('SELECT id FROM users WHERE email=$1', [c.email]);
      let companyId;

      if (existing.rows.length > 0) {
        console.log(`  SKIP user (exists): ${c.email}`);
        const cRow = await db.query('SELECT id FROM companies WHERE user_id=$1', [existing.rows[0].id]);
        if (!cRow.rows.length) continue;
        companyId = cRow.rows[0].id;
      } else {
        const hash = bcrypt.hashSync(c.password, 10);
        const uRes = await db.query(
          'INSERT INTO users (email, password, role, is_approved) VALUES ($1,$2,$3,$4) RETURNING id',
          [c.email, hash, 'company', true]
        );
        const userId = uRes.rows[0].id;

        const cRes = await db.query(
          `INSERT INTO companies (user_id, company_name, industry, location, contact_person, phone)
           VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
          [userId, c.company_name, c.industry, c.location, c.contact_person, c.phone]
        );
        companyId = cRes.rows[0].id;
        console.log(`  ✓ ${c.company_name}`);
      }

      // Insert jobs for company
      for (const j of c.jobs) {
        const existing_job = await db.query(
          'SELECT id FROM jobs WHERE company_id=$1 AND title=$2', [companyId, j.title]
        );
        if (existing_job.rows.length > 0) { console.log(`    SKIP job: ${j.title}`); continue; }

        const jRes = await db.query(
          `INSERT INTO jobs (company_id, title, description, location, salary_range,
            min_cgpa, min_coding_score, status, job_type)
           VALUES ($1,$2,$3,$4,$5,$6,$7,'open','full-time') RETURNING id`,
          [companyId, j.title, j.description, j.location, j.salary_range, j.min_cgpa, j.min_coding_score]
        );
        const jobId = jRes.rows[0].id;
        for (const skillId of j.skills) {
          await db.query(
            'INSERT INTO job_skills (job_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [jobId, skillId]
          ).catch(() => {});
        }
        console.log(`    + Job: ${j.title}`);
      }
    } catch (err) {
      console.error(`  ✗ ${c.company_name}: ${err.message}`);
    }
  }

  // Insert coding problems
  console.log('\nInserting 20 coding problems...');
  for (const p of problems) {
    try {
      const existing = await db.query('SELECT id FROM coding_problems WHERE title=$1', [p.title]);
      if (existing.rows.length > 0) { console.log(`  SKIP: ${p.title}`); continue; }

      await db.query(
        `INSERT INTO coding_problems
           (title, difficulty, topic, language, description, sample_input, sample_output,
            solution_template, explanation)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [p.title, p.difficulty, p.topic, p.language, p.description,
         p.sample_input, p.sample_output, p.solution_template, p.explanation]
      );
      console.log(`  ✓ [${p.difficulty}] ${p.title}`);
    } catch (err) {
      console.error(`  ✗ ${p.title}: ${err.message}`);
    }
  }

  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error('Fatal:', err); process.exit(1); });
