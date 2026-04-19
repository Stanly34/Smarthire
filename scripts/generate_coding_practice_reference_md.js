const fs = require('fs');
const path = require('path');
const { CODING_PROBLEMS, LANGUAGE_GROUPS, LANGUAGE_ORDER } = require('../db/codingPracticeSeed');

const OUTPUT_FILE = path.join(process.cwd(), 'seed-data', 'coding-practice-questions-and-answers.md');

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];
const LEVEL_TITLES = {
  beginner: 'Beginner Level',
  intermediate: 'Intermediate Level',
  advanced: 'Advanced Level',
};

const FENCE_BY_LANGUAGE = {
  C: 'c',
  'C++': 'cpp',
  JavaScript: 'javascript',
  Python: 'python',
  Java: 'java',
  PHP: 'php',
  'C#': 'csharp',
  Go: 'go',
  TypeScript: 'typescript',
  Rust: 'rust',
};

const LANGUAGE_LEVEL = Object.entries(LANGUAGE_GROUPS).reduce((acc, [level, languages]) => {
  languages.forEach(language => {
    acc[language] = level;
  });
  return acc;
}, {});

const SOLUTIONS = {
  C: {
    'Reverse a String': String.raw`#include <stdio.h>
#include <string.h>

int main(void) {
    char text[2005];
    if (!fgets(text, sizeof(text), stdin)) {
        return 0;
    }

    int length = (int)strlen(text);
    if (length > 0 && text[length - 1] == '\n') {
        text[--length] = '\0';
    }

    for (int i = length - 1; i >= 0; --i) {
        putchar(text[i]);
    }
    putchar('\n');
    return 0;
}`,
    FizzBuzz: String.raw`#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    for (int i = 1; i <= n; ++i) {
        if (i > 1) {
            printf(" ");
        }
        if (i % 15 == 0) {
            printf("FizzBuzz");
        } else if (i % 3 == 0) {
            printf("Fizz");
        } else if (i % 5 == 0) {
            printf("Buzz");
        } else {
            printf("%d", i);
        }
    }
    printf("\n");
    return 0;
}`,
    'Array Sum': String.raw`#include <stdio.h>

int main(void) {
    int n, value;
    long long sum = 0;

    if (scanf("%d", &n) != 1) {
        return 0;
    }

    for (int i = 0; i < n; ++i) {
        scanf("%d", &value);
        sum += value;
    }

    printf("%lld\n", sum);
    return 0;
}`,
    'Palindrome Checker': String.raw`#include <stdio.h>
#include <string.h>

int main(void) {
    char text[2005];
    if (scanf("%2000s", text) != 1) {
        return 0;
    }

    int left = 0;
    int right = (int)strlen(text) - 1;
    int ok = 1;

    while (left < right) {
        if (text[left] != text[right]) {
            ok = 0;
            break;
        }
        ++left;
        --right;
    }

    printf("%s\n", ok ? "true" : "false");
    return 0;
}`,
    'Count Vowels': String.raw`#include <ctype.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    char text[2005];
    if (!fgets(text, sizeof(text), stdin)) {
        return 0;
    }

    int count = 0;
    for (int i = 0; text[i] != '\0'; ++i) {
        char ch = (char)tolower((unsigned char)text[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            ++count;
        }
    }

    printf("%d\n", count);
    return 0;
}`,
    'Find Maximum Element': String.raw`#include <stdio.h>

int main(void) {
    int n, value, best;
    if (scanf("%d", &n) != 1 || n <= 0) {
        return 0;
    }

    scanf("%d", &best);
    for (int i = 1; i < n; ++i) {
        scanf("%d", &value);
        if (value > best) {
            best = value;
        }
    }

    printf("%d\n", best);
    return 0;
}`,
    'Linear Search': String.raw`#include <stdio.h>

int main(void) {
    int n, target, answer = -1;
    int values[2005];

    if (scanf("%d", &n) != 1) {
        return 0;
    }

    for (int i = 0; i < n; ++i) {
        scanf("%d", &values[i]);
    }
    scanf("%d", &target);

    for (int i = 0; i < n; ++i) {
        if (values[i] == target) {
            answer = i;
            break;
        }
    }

    printf("%d\n", answer);
    return 0;
}`,
    Factorial: String.raw`#include <stdio.h>

int main(void) {
    int n;
    long long answer = 1;

    if (scanf("%d", &n) != 1) {
        return 0;
    }

    for (int i = 2; i <= n; ++i) {
        answer *= i;
    }

    printf("%lld\n", answer);
    return 0;
}`,
    'Prime Number Check': String.raw`#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    if (n < 2) {
        printf("false\n");
        return 0;
    }

    for (int d = 2; d * d <= n; ++d) {
        if (n % d == 0) {
            printf("false\n");
            return 0;
        }
    }

    printf("true\n");
    return 0;
}`,
    'Remove Duplicates': String.raw`#include <stdio.h>

int main(void) {
    int n, values[2005], unique[2005], uniqueCount = 0;
    if (scanf("%d", &n) != 1) {
        return 0;
    }

    for (int i = 0; i < n; ++i) {
        scanf("%d", &values[i]);
    }

    for (int i = 0; i < n; ++i) {
        int seen = 0;
        for (int j = 0; j < uniqueCount; ++j) {
            if (unique[j] == values[i]) {
                seen = 1;
                break;
            }
        }
        if (!seen) {
            unique[uniqueCount++] = values[i];
        }
    }

    for (int i = 0; i < uniqueCount; ++i) {
        if (i > 0) {
            printf(" ");
        }
        printf("%d", unique[i]);
    }
    printf("\n");
    return 0;
}`,
  },
  'C++': {
    'Reverse a String': String.raw`#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    getline(cin, text);
    reverse(text.begin(), text.end());
    cout << text << '\n';
    return 0;
}`,
    FizzBuzz: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) {
        return 0;
    }

    for (int i = 1; i <= n; ++i) {
        if (i > 1) {
            cout << ' ';
        }
        if (i % 15 == 0) {
            cout << "FizzBuzz";
        } else if (i % 3 == 0) {
            cout << "Fizz";
        } else if (i % 5 == 0) {
            cout << "Buzz";
        } else {
            cout << i;
        }
    }
    cout << '\n';
    return 0;
}`,
    'Array Sum': String.raw`#include <iostream>
using namespace std;

int main() {
    int n, value;
    long long sum = 0;
    if (!(cin >> n)) {
        return 0;
    }
    for (int i = 0; i < n; ++i) {
        cin >> value;
        sum += value;
    }
    cout << sum << '\n';
    return 0;
}`,
    'Palindrome Checker': String.raw`#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    cin >> text;
    string reversed = text;
    reverse(reversed.begin(), reversed.end());
    cout << (text == reversed ? "true" : "false") << '\n';
    return 0;
}`,
    'Count Vowels': String.raw`#include <cctype>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    getline(cin, text);
    int count = 0;
    for (char ch : text) {
        ch = static_cast<char>(tolower(static_cast<unsigned char>(ch)));
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            ++count;
        }
    }
    cout << count << '\n';
    return 0;
}`,
    'Find Maximum Element': String.raw`#include <iostream>
using namespace std;

int main() {
    int n, value, best;
    if (!(cin >> n)) {
        return 0;
    }
    cin >> best;
    for (int i = 1; i < n; ++i) {
        cin >> value;
        if (value > best) {
            best = value;
        }
    }
    cout << best << '\n';
    return 0;
}`,
    'Linear Search': String.raw`#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    vector<int> values(n);
    for (int i = 0; i < n; ++i) {
        cin >> values[i];
    }
    cin >> target;

    int answer = -1;
    for (int i = 0; i < n; ++i) {
        if (values[i] == target) {
            answer = i;
            break;
        }
    }
    cout << answer << '\n';
    return 0;
}`,
    Factorial: String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    long long answer = 1;
    cin >> n;
    for (int i = 2; i <= n; ++i) {
        answer *= i;
    }
    cout << answer << '\n';
    return 0;
}`,
    'Prime Number Check': String.raw`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n < 2) {
        cout << "false\n";
        return 0;
    }
    for (int d = 2; d * d <= n; ++d) {
        if (n % d == 0) {
            cout << "false\n";
            return 0;
        }
    }
    cout << "true\n";
    return 0;
}`,
    'Remove Duplicates': String.raw`#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    unordered_set<int> seen;
    vector<int> answer;
    for (int i = 0; i < n; ++i) {
        int value;
        cin >> value;
        if (!seen.count(value)) {
            seen.insert(value);
            answer.push_back(value);
        }
    }
    for (int i = 0; i < static_cast<int>(answer.size()); ++i) {
        if (i > 0) {
            cout << ' ';
        }
        cout << answer[i];
    }
    cout << '\n';
    return 0;
}`,
  },
  JavaScript: {
    'Reverse a String': String.raw`const fs = require('fs');
const text = fs.readFileSync(0, 'utf8').replace(/\r/g, '').replace(/\n$/, '');
console.log(Array.from(text).reverse().join(''));`,
    FizzBuzz: String.raw`const fs = require('fs');
const n = Number(fs.readFileSync(0, 'utf8').trim());
const answer = [];

for (let value = 1; value <= n; value += 1) {
  if (value % 15 === 0) {
    answer.push('FizzBuzz');
  } else if (value % 3 === 0) {
    answer.push('Fizz');
  } else if (value % 5 === 0) {
    answer.push('Buzz');
  } else {
    answer.push(String(value));
  }
}

console.log(answer.join(' '));`,
    'Array Sum': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const count = numbers[0];
let sum = 0;

for (let i = 1; i <= count; i += 1) {
  sum += numbers[i];
}

console.log(sum);`,
    'Palindrome Checker': String.raw`const fs = require('fs');
const text = fs.readFileSync(0, 'utf8').trim();
const reversed = Array.from(text).reverse().join('');
console.log(text === reversed ? 'true' : 'false');`,
    'Count Vowels': String.raw`const fs = require('fs');
const text = fs.readFileSync(0, 'utf8').trim().toLowerCase();
let count = 0;

for (const ch of text) {
  if ('aeiou'.includes(ch)) {
    count += 1;
  }
}

console.log(count);`,
    'Find Maximum Element': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const count = numbers[0];
let best = numbers[1];

for (let i = 2; i <= count; i += 1) {
  if (numbers[i] > best) {
    best = numbers[i];
  }
}

console.log(best);`,
    'Linear Search': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const count = numbers[0];
const values = numbers.slice(1, 1 + count);
const target = numbers[1 + count];

let answer = -1;
for (let i = 0; i < values.length; i += 1) {
  if (values[i] === target) {
    answer = i;
    break;
  }
}

console.log(answer);`,
    Factorial: String.raw`const fs = require('fs');
const n = Number(fs.readFileSync(0, 'utf8').trim());
let answer = 1;

for (let i = 2; i <= n; i += 1) {
  answer *= i;
}

console.log(answer);`,
    'Prime Number Check': String.raw`const fs = require('fs');
const n = Number(fs.readFileSync(0, 'utf8').trim());

if (n < 2) {
  console.log('false');
} else {
  let prime = true;
  for (let d = 2; d * d <= n; d += 1) {
    if (n % d === 0) {
      prime = false;
      break;
    }
  }
  console.log(prime ? 'true' : 'false');
}`,
    'Remove Duplicates': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const count = numbers[0];
const values = numbers.slice(1, 1 + count);
const seen = new Set();
const answer = [];

for (const value of values) {
  if (!seen.has(value)) {
    seen.add(value);
    answer.push(value);
  }
}

console.log(answer.join(' '));`,
  },
  Python: {
    'Reverse a String': String.raw`import sys

text = sys.stdin.read().rstrip('\n')
print(text[::-1])`,
    FizzBuzz: String.raw`import sys

n = int(sys.stdin.read().strip())
answer = []
for value in range(1, n + 1):
    if value % 15 == 0:
        answer.append('FizzBuzz')
    elif value % 3 == 0:
        answer.append('Fizz')
    elif value % 5 == 0:
        answer.append('Buzz')
    else:
        answer.append(str(value))
print(' '.join(answer))`,
    'Array Sum': String.raw`import sys

numbers = list(map(int, sys.stdin.read().split()))
count = numbers[0]
values = numbers[1:1 + count]
print(sum(values))`,
    'Palindrome Checker': String.raw`import sys

text = sys.stdin.read().strip()
print('true' if text == text[::-1] else 'false')`,
    'Count Vowels': String.raw`import sys

text = sys.stdin.read().strip().lower()
count = sum(1 for ch in text if ch in 'aeiou')
print(count)`,
    'Find Maximum Element': String.raw`import sys

numbers = list(map(int, sys.stdin.read().split()))
count = numbers[0]
values = numbers[1:1 + count]
print(max(values))`,
    'Linear Search': String.raw`import sys

numbers = list(map(int, sys.stdin.read().split()))
count = numbers[0]
values = numbers[1:1 + count]
target = numbers[1 + count]
answer = -1

for index, value in enumerate(values):
    if value == target:
        answer = index
        break

print(answer)`,
    Factorial: String.raw`import sys

n = int(sys.stdin.read().strip())
answer = 1
for value in range(2, n + 1):
    answer *= value
print(answer)`,
    'Prime Number Check': String.raw`import sys

n = int(sys.stdin.read().strip())
if n < 2:
    print('false')
else:
    prime = True
    divisor = 2
    while divisor * divisor <= n:
        if n % divisor == 0:
            prime = False
            break
        divisor += 1
    print('true' if prime else 'false')`,
    'Remove Duplicates': String.raw`import sys

numbers = list(map(int, sys.stdin.read().split()))
count = numbers[0]
values = numbers[1:1 + count]
seen = set()
answer = []

for value in values:
    if value not in seen:
        seen.add(value)
        answer.append(str(value))

print(' '.join(answer))`,
  },
  Java: {
    'Binary Search': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) {
            values[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();

        int left = 0;
        int right = n - 1;
        int answer = -1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (values[mid] == target) {
                answer = mid;
                break;
            }
            if (values[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        System.out.println(answer);
    }
}`,
    'Linked List Reversal': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) {
            values[i] = scanner.nextInt();
        }

        StringBuilder output = new StringBuilder();
        for (int i = n - 1; i >= 0; i--) {
            if (output.length() > 0) {
                output.append(' ');
            }
            output.append(values[i]);
        }
        System.out.println(output);
    }
}`,
    'Valid Parentheses': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.next();
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put(')', '(');
        pairs.put(']', '[');
        pairs.put('}', '{');

        boolean valid = true;
        for (char ch : text.toCharArray()) {
            if (ch == '(' || ch == '[' || ch == '{') {
                stack.push(ch);
            } else if (stack.isEmpty() || stack.peek() != pairs.get(ch)) {
                valid = false;
                break;
            } else {
                stack.pop();
            }
        }

        if (!stack.isEmpty()) {
            valid = false;
        }

        System.out.println(valid ? "true" : "false");
    }
}`,
    'Merge Two Sorted Arrays': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int leftCount = scanner.nextInt();
        int rightCount = scanner.nextInt();
        int[] left = new int[leftCount];
        int[] right = new int[rightCount];
        for (int i = 0; i < leftCount; i++) {
            left[i] = scanner.nextInt();
        }
        for (int i = 0; i < rightCount; i++) {
            right[i] = scanner.nextInt();
        }

        List<Integer> merged = new ArrayList<>();
        int i = 0;
        int j = 0;
        while (i < leftCount && j < rightCount) {
            if (left[i] <= right[j]) {
                merged.add(left[i++]);
            } else {
                merged.add(right[j++]);
            }
        }
        while (i < leftCount) {
            merged.add(left[i++]);
        }
        while (j < rightCount) {
            merged.add(right[j++]);
        }

        StringBuilder output = new StringBuilder();
        for (int value : merged) {
            if (output.length() > 0) {
                output.append(' ');
            }
            output.append(value);
        }
        System.out.println(output);
    }
}`,
    'Two Sum': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) {
            values[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();

        Map<Integer, Integer> seen = new HashMap<>();
        String answer = "-1";
        for (int i = 0; i < n; i++) {
            int need = target - values[i];
            if (seen.containsKey(need)) {
                answer = seen.get(need) + " " + i;
                break;
            }
            seen.putIfAbsent(values[i], i);
        }

        System.out.println(answer);
    }
}`,
    'Frequency Counter': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        TreeMap<Integer, Integer> frequency = new TreeMap<>();
        for (int i = 0; i < n; i++) {
            int value = scanner.nextInt();
            frequency.put(value, frequency.getOrDefault(value, 0) + 1);
        }

        StringBuilder output = new StringBuilder();
        for (Map.Entry<Integer, Integer> entry : frequency.entrySet()) {
            if (output.length() > 0) {
                output.append(' ');
            }
            output.append(entry.getKey()).append(':').append(entry.getValue());
        }
        System.out.println(output);
    }
}`,
    'Rotate Array': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) {
            values[i] = scanner.nextInt();
        }
        int steps = scanner.nextInt() % n;

        StringBuilder output = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) {
                output.append(' ');
            }
            output.append(values[(i - steps + n) % n]);
        }
        System.out.println(output);
    }
}`,
    'Queue Using Stacks': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int q = scanner.nextInt();
        Deque<Integer> inStack = new ArrayDeque<>();
        Deque<Integer> outStack = new ArrayDeque<>();
        List<String> outputs = new ArrayList<>();

        for (int i = 0; i < q; i++) {
            String command = scanner.next();
            if (command.equals("PUSH")) {
                inStack.push(scanner.nextInt());
            } else {
                if (outStack.isEmpty()) {
                    while (!inStack.isEmpty()) {
                        outStack.push(inStack.pop());
                    }
                }
                if (command.equals("POP")) {
                    outputs.add(outStack.isEmpty() ? "EMPTY" : String.valueOf(outStack.pop()));
                } else {
                    outputs.add(outStack.isEmpty() ? "EMPTY" : String.valueOf(outStack.peek()));
                }
            }
        }

        System.out.println(String.join(" ", outputs));
    }
}`,
    'Longest Common Prefix': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        String prefix = scanner.nextLine().trim();

        for (int i = 1; i < n; i++) {
            String word = scanner.nextLine().trim();
            while (!word.startsWith(prefix) && !prefix.isEmpty()) {
                prefix = prefix.substring(0, prefix.length() - 1);
            }
        }

        System.out.println(prefix.isEmpty() ? "-" : prefix);
    }
}`,
    'Group Anagrams': String.raw`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, List<String>> groups = new HashMap<>();

        for (int i = 0; i < n; i++) {
            String word = scanner.nextLine().trim();
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, unused -> new ArrayList<>()).add(word);
        }

        List<List<String>> orderedGroups = new ArrayList<>(groups.values());
        for (List<String> group : orderedGroups) {
            Collections.sort(group);
        }
        orderedGroups.sort(Comparator.comparing(group -> group.get(0)));

        List<String> parts = new ArrayList<>();
        for (List<String> group : orderedGroups) {
            parts.add(String.join(" ", group));
        }
        System.out.println(String.join(" | ", parts));
    }
}`,
  },
  PHP: {
    'Binary Search': String.raw`<?php
$tokens = preg_split('/\s+/', trim(stream_get_contents(STDIN)));
$index = 0;
$n = intval($tokens[$index++]);
$values = [];
for ($i = 0; $i < $n; $i++) {
    $values[] = intval($tokens[$index++]);
}
$target = intval($tokens[$index++]);

$left = 0;
$right = $n - 1;
$answer = -1;
while ($left <= $right) {
    $mid = intdiv($left + $right, 2);
    if ($values[$mid] === $target) {
        $answer = $mid;
        break;
    }
    if ($values[$mid] < $target) {
        $left = $mid + 1;
    } else {
        $right = $mid - 1;
    }
}

echo $answer . PHP_EOL;`,
    'Linked List Reversal': String.raw`<?php
$tokens = preg_split('/\s+/', trim(stream_get_contents(STDIN)));
$index = 0;
$n = intval($tokens[$index++]);
$values = [];
for ($i = 0; $i < $n; $i++) {
    $values[] = intval($tokens[$index++]);
}
$values = array_reverse($values);
echo implode(' ', $values) . PHP_EOL;`,
    'Valid Parentheses': String.raw`<?php
$text = trim(stream_get_contents(STDIN));
$pairs = [')' => '(', ']' => '[', '}' => '{'];
$stack = [];
$valid = true;

foreach (str_split($text) as $ch) {
    if ($ch === '(' || $ch === '[' || $ch === '{') {
        $stack[] = $ch;
    } else {
        if (empty($stack) || end($stack) !== $pairs[$ch]) {
            $valid = false;
            break;
        }
        array_pop($stack);
    }
}

if (!empty($stack)) {
    $valid = false;
}

echo ($valid ? 'true' : 'false') . PHP_EOL;`,
    'Merge Two Sorted Arrays': String.raw`<?php
$tokens = preg_split('/\s+/', trim(stream_get_contents(STDIN)));
$index = 0;
$leftCount = intval($tokens[$index++]);
$rightCount = intval($tokens[$index++]);
$left = [];
$right = [];

for ($i = 0; $i < $leftCount; $i++) {
    $left[] = intval($tokens[$index++]);
}
for ($i = 0; $i < $rightCount; $i++) {
    $right[] = intval($tokens[$index++]);
}

$merged = [];
$i = 0;
$j = 0;
while ($i < $leftCount && $j < $rightCount) {
    if ($left[$i] <= $right[$j]) {
        $merged[] = $left[$i++];
    } else {
        $merged[] = $right[$j++];
    }
}
while ($i < $leftCount) {
    $merged[] = $left[$i++];
}
while ($j < $rightCount) {
    $merged[] = $right[$j++];
}

echo implode(' ', $merged) . PHP_EOL;`,
    'Two Sum': String.raw`<?php
$tokens = preg_split('/\s+/', trim(stream_get_contents(STDIN)));
$index = 0;
$n = intval($tokens[$index++]);
$values = [];
for ($i = 0; $i < $n; $i++) {
    $values[] = intval($tokens[$index++]);
}
$target = intval($tokens[$index++]);

$seen = [];
$answer = '-1';
for ($i = 0; $i < $n; $i++) {
    $need = $target - $values[$i];
    if (array_key_exists($need, $seen)) {
        $answer = $seen[$need] . ' ' . $i;
        break;
    }
    if (!array_key_exists($values[$i], $seen)) {
        $seen[$values[$i]] = $i;
    }
}

echo $answer . PHP_EOL;`,
    'Frequency Counter': String.raw`<?php
$tokens = preg_split('/\s+/', trim(stream_get_contents(STDIN)));
$index = 0;
$n = intval($tokens[$index++]);
$frequency = [];
for ($i = 0; $i < $n; $i++) {
    $value = intval($tokens[$index++]);
    if (!isset($frequency[$value])) {
        $frequency[$value] = 0;
    }
    $frequency[$value] += 1;
}

ksort($frequency, SORT_NUMERIC);
$parts = [];
foreach ($frequency as $value => $count) {
    $parts[] = $value . ':' . $count;
}

echo implode(' ', $parts) . PHP_EOL;`,
    'Rotate Array': String.raw`<?php
$tokens = preg_split('/\s+/', trim(stream_get_contents(STDIN)));
$index = 0;
$n = intval($tokens[$index++]);
$values = [];
for ($i = 0; $i < $n; $i++) {
    $values[] = intval($tokens[$index++]);
}
$steps = intval($tokens[$index++]) % $n;
$rotated = [];
for ($i = 0; $i < $n; $i++) {
    $rotated[] = $values[($i - $steps + $n) % $n];
}
echo implode(' ', $rotated) . PHP_EOL;`,
    'Queue Using Stacks': String.raw`<?php
$lines = preg_split('/\r?\n/', trim(stream_get_contents(STDIN)));
$q = intval(array_shift($lines));
$inStack = [];
$outStack = [];
$outputs = [];

for ($i = 0; $i < $q; $i++) {
    $parts = explode(' ', trim($lines[$i]));
    $command = $parts[0];
    if ($command === 'PUSH') {
        $inStack[] = intval($parts[1]);
    } else {
        if (empty($outStack)) {
            while (!empty($inStack)) {
                $outStack[] = array_pop($inStack);
            }
        }
        if ($command === 'POP') {
            $outputs[] = empty($outStack) ? 'EMPTY' : strval(array_pop($outStack));
        } else {
            $outputs[] = empty($outStack) ? 'EMPTY' : strval(end($outStack));
        }
    }
}

echo implode(' ', $outputs) . PHP_EOL;`,
    'Longest Common Prefix': String.raw`<?php
$lines = preg_split('/\r?\n/', trim(stream_get_contents(STDIN)));
$n = intval(array_shift($lines));
$words = array_slice($lines, 0, $n);
$prefix = $words[0];

for ($i = 1; $i < $n; $i++) {
    while ($prefix !== '' && strpos($words[$i], $prefix) !== 0) {
        $prefix = substr($prefix, 0, -1);
    }
}

echo ($prefix === '' ? '-' : $prefix) . PHP_EOL;`,
    'Group Anagrams': String.raw`<?php
$lines = preg_split('/\r?\n/', trim(stream_get_contents(STDIN)));
$n = intval(array_shift($lines));
$groups = [];

for ($i = 0; $i < $n; $i++) {
    $word = trim($lines[$i]);
    $chars = str_split($word);
    sort($chars);
    $key = implode('', $chars);
    if (!isset($groups[$key])) {
        $groups[$key] = [];
    }
    $groups[$key][] = $word;
}

$orderedGroups = array_values($groups);
foreach ($orderedGroups as &$group) {
    sort($group, SORT_STRING);
}
unset($group);

usort($orderedGroups, function ($left, $right) {
    return strcmp($left[0], $right[0]);
});

$parts = [];
foreach ($orderedGroups as $group) {
    $parts[] = implode(' ', $group);
}

echo implode(' | ', $parts) . PHP_EOL;`,
  },
  'C#': {
    'Binary Search': String.raw`using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int index = 0;
        int n = numbers[index++];
        int[] values = new int[n];
        for (int i = 0; i < n; i++)
        {
            values[i] = numbers[index++];
        }
        int target = numbers[index];

        int left = 0, right = n - 1, answer = -1;
        while (left <= right)
        {
            int mid = (left + right) / 2;
            if (values[mid] == target)
            {
                answer = mid;
                break;
            }
            if (values[mid] < target) left = mid + 1;
            else right = mid - 1;
        }

        Console.WriteLine(answer);
    }
}`,
    'Linked List Reversal': String.raw`using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int index = 0;
        int n = numbers[index++];
        int[] values = new int[n];
        for (int i = 0; i < n; i++)
        {
            values[i] = numbers[index++];
        }

        Array.Reverse(values);
        Console.WriteLine(string.Join(" ", values));
    }
}`,
    'Valid Parentheses': String.raw`using System;
using System.Collections.Generic;

public class Program
{
    public static void Main()
    {
        string text = Console.In.ReadToEnd().Trim();
        var stack = new Stack<char>();
        var pairs = new Dictionary<char, char>
        {
            [')'] = '(',
            [']'] = '[',
            ['}'] = '{'
        };

        bool valid = true;
        foreach (char ch in text)
        {
            if (ch == '(' || ch == '[' || ch == '{')
            {
                stack.Push(ch);
            }
            else if (stack.Count == 0 || stack.Peek() != pairs[ch])
            {
                valid = false;
                break;
            }
            else
            {
                stack.Pop();
            }
        }

        if (stack.Count > 0) valid = false;
        Console.WriteLine(valid ? "true" : "false");
    }
}`,
    'Merge Two Sorted Arrays': String.raw`using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int index = 0;
        int leftCount = numbers[index++];
        int rightCount = numbers[index++];
        int[] left = new int[leftCount];
        int[] right = new int[rightCount];
        for (int i = 0; i < leftCount; i++) left[i] = numbers[index++];
        for (int i = 0; i < rightCount; i++) right[i] = numbers[index++];

        var merged = new List<int>();
        int a = 0, b = 0;
        while (a < leftCount && b < rightCount)
        {
            if (left[a] <= right[b]) merged.Add(left[a++]);
            else merged.Add(right[b++]);
        }
        while (a < leftCount) merged.Add(left[a++]);
        while (b < rightCount) merged.Add(right[b++]);

        Console.WriteLine(string.Join(" ", merged));
    }
}`,
    'Two Sum': String.raw`using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int index = 0;
        int n = numbers[index++];
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = numbers[index++];
        int target = numbers[index];

        var seen = new Dictionary<int, int>();
        string answer = "-1";
        for (int i = 0; i < n; i++)
        {
            int need = target - values[i];
            if (seen.ContainsKey(need))
            {
                answer = seen[need] + " " + i;
                break;
            }
            if (!seen.ContainsKey(values[i]))
            {
                seen[values[i]] = i;
            }
        }

        Console.WriteLine(answer);
    }
}`,
    'Frequency Counter': String.raw`using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int index = 0;
        int n = numbers[index++];
        var frequency = new SortedDictionary<int, int>();
        for (int i = 0; i < n; i++)
        {
            int value = numbers[index++];
            frequency[value] = frequency.ContainsKey(value) ? frequency[value] + 1 : 1;
        }

        Console.WriteLine(string.Join(" ", frequency.Select(pair => pair.Key + ":" + pair.Value)));
    }
}`,
    'Rotate Array': String.raw`using System;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var numbers = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        int index = 0;
        int n = numbers[index++];
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = numbers[index++];
        int steps = numbers[index] % n;

        int[] rotated = new int[n];
        for (int i = 0; i < n; i++)
        {
            rotated[i] = values[(i - steps + n) % n];
        }

        Console.WriteLine(string.Join(" ", rotated));
    }
}`,
    'Queue Using Stacks': String.raw`using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var lines = Console.In.ReadToEnd()
            .Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

        int q = int.Parse(lines[0]);
        var inStack = new Stack<int>();
        var outStack = new Stack<int>();
        var outputs = new List<string>();

        void Shift()
        {
            if (outStack.Count == 0)
            {
                while (inStack.Count > 0)
                {
                    outStack.Push(inStack.Pop());
                }
            }
        }

        for (int i = 1; i <= q; i++)
        {
            var parts = lines[i].Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts[0] == "PUSH")
            {
                inStack.Push(int.Parse(parts[1]));
            }
            else
            {
                Shift();
                if (parts[0] == "POP")
                {
                    outputs.Add(outStack.Count == 0 ? "EMPTY" : outStack.Pop().ToString());
                }
                else
                {
                    outputs.Add(outStack.Count == 0 ? "EMPTY" : outStack.Peek().ToString());
                }
            }
        }

        Console.WriteLine(string.Join(" ", outputs));
    }
}`,
    'Longest Common Prefix': String.raw`using System;

public class Program
{
    public static void Main()
    {
        var lines = Console.In.ReadToEnd()
            .Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

        int n = int.Parse(lines[0]);
        string prefix = lines[1];
        for (int i = 2; i <= n; i++)
        {
            string word = lines[i];
            while (prefix.Length > 0 && !word.StartsWith(prefix))
            {
                prefix = prefix.Substring(0, prefix.Length - 1);
            }
        }

        Console.WriteLine(prefix.Length == 0 ? "-" : prefix);
    }
}`,
    'Group Anagrams': String.raw`using System;
using System.Collections.Generic;
using System.Linq;

public class Program
{
    public static void Main()
    {
        var lines = Console.In.ReadToEnd()
            .Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);

        int n = int.Parse(lines[0]);
        var groups = new Dictionary<string, List<string>>();
        for (int i = 1; i <= n; i++)
        {
            string word = lines[i];
            char[] chars = word.ToCharArray();
            Array.Sort(chars);
            string key = new string(chars);
            if (!groups.ContainsKey(key))
            {
                groups[key] = new List<string>();
            }
            groups[key].Add(word);
        }

        var orderedGroups = groups.Values.ToList();
        foreach (var group in orderedGroups)
        {
            group.Sort(StringComparer.Ordinal);
        }
        orderedGroups.Sort((left, right) => string.CompareOrdinal(left[0], right[0]));

        Console.WriteLine(string.Join(" | ", orderedGroups.Select(group => string.Join(" ", group))));
    }
}`,
  },
  Go: {
    'Merge Intervals': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
)

type interval struct {
	start int
	end   int
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var n int
	if _, err := fmt.Fscan(in, &n); err != nil {
		return
	}

	intervals := make([]interval, n)
	for i := 0; i < n; i++ {
		fmt.Fscan(in, &intervals[i].start, &intervals[i].end)
	}

	sort.Slice(intervals, func(i, j int) bool {
		if intervals[i].start == intervals[j].start {
			return intervals[i].end < intervals[j].end
		}
		return intervals[i].start < intervals[j].start
	})

	merged := []interval{}
	for _, current := range intervals {
		if len(merged) == 0 || current.start > merged[len(merged)-1].end {
			merged = append(merged, current)
		} else if current.end > merged[len(merged)-1].end {
			merged[len(merged)-1].end = current.end
		}
	}

	for i, item := range merged {
		if i > 0 {
			fmt.Print(" | ")
		}
		fmt.Printf("%d %d", item.start, item.end)
	}
	fmt.Println()
}`,
    'Longest Common Subsequence': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
)

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var first, second string
	fmt.Fscan(in, &first, &second)

	dp := make([][]int, len(first)+1)
	for i := range dp {
		dp[i] = make([]int, len(second)+1)
	}

	for i := 1; i <= len(first); i++ {
		for j := 1; j <= len(second); j++ {
			if first[i-1] == second[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else {
				dp[i][j] = max(dp[i-1][j], dp[i][j-1])
			}
		}
	}

	fmt.Println(dp[len(first)][len(second)])
}`,
    'Top K Frequent Elements': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
)

type item struct {
	value int
	count int
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var n, k int
	if _, err := fmt.Fscan(in, &n, &k); err != nil {
		return
	}

	freq := map[int]int{}
	for i := 0; i < n; i++ {
		var value int
		fmt.Fscan(in, &value)
		freq[value]++
	}

	items := make([]item, 0, len(freq))
	for value, count := range freq {
		items = append(items, item{value: value, count: count})
	}

	sort.Slice(items, func(i, j int) bool {
		if items[i].count == items[j].count {
			return items[i].value < items[j].value
		}
		return items[i].count > items[j].count
	})

	for i := 0; i < k; i++ {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(items[i].value)
	}
	fmt.Println()
}`,
    'Course Schedule': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	in := bufio.NewReader(os.Stdin)
	var courseCount, pairCount int
	if _, err := fmt.Fscan(in, &courseCount, &pairCount); err != nil {
		return
	}

	graph := make([][]int, courseCount)
	indegree := make([]int, courseCount)
	for i := 0; i < pairCount; i++ {
		var course, prereq int
		fmt.Fscan(in, &course, &prereq)
		graph[prereq] = append(graph[prereq], course)
		indegree[course]++
	}

	queue := make([]int, 0)
	for i := 0; i < courseCount; i++ {
		if indegree[i] == 0 {
			queue = append(queue, i)
		}
	}

	visited := 0
	for head := 0; head < len(queue); head++ {
		node := queue[head]
		visited++
		for _, neighbor := range graph[node] {
			indegree[neighbor]--
			if indegree[neighbor] == 0 {
				queue = append(queue, neighbor)
			}
		}
	}

	if visited == courseCount {
		fmt.Println("true")
	} else {
		fmt.Println("false")
	}
}`,
    'Dijkstra Shortest Path': String.raw`package main

import (
	"bufio"
	"container/heap"
	"fmt"
	"os"
)

type edge struct {
	to     int
	weight int
}

type node struct {
	cost int
	id   int
}

type priorityQueue []node

func (pq priorityQueue) Len() int            { return len(pq) }
func (pq priorityQueue) Less(i, j int) bool  { return pq[i].cost < pq[j].cost }
func (pq priorityQueue) Swap(i, j int)       { pq[i], pq[j] = pq[j], pq[i] }
func (pq *priorityQueue) Push(x interface{}) { *pq = append(*pq, x.(node)) }
func (pq *priorityQueue) Pop() interface{} {
	old := *pq
	last := old[len(old)-1]
	*pq = old[:len(old)-1]
	return last
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var nodeCount, edgeCount int
	if _, err := fmt.Fscan(in, &nodeCount, &edgeCount); err != nil {
		return
	}

	graph := make([][]edge, nodeCount+1)
	for i := 0; i < edgeCount; i++ {
		var start, end, weight int
		fmt.Fscan(in, &start, &end, &weight)
		graph[start] = append(graph[start], edge{to: end, weight: weight})
	}

	var source, target int
	fmt.Fscan(in, &source, &target)

	const inf = int(1e18)
	distance := make([]int, nodeCount+1)
	for i := range distance {
		distance[i] = inf
	}
	distance[source] = 0

	pq := &priorityQueue{{cost: 0, id: source}}
	heap.Init(pq)

	for pq.Len() > 0 {
		current := heap.Pop(pq).(node)
		if current.cost != distance[current.id] {
			continue
		}
		for _, next := range graph[current.id] {
			newCost := current.cost + next.weight
			if newCost < distance[next.to] {
				distance[next.to] = newCost
				heap.Push(pq, node{cost: newCost, id: next.to})
			}
		}
	}

	if distance[target] == inf {
		fmt.Println(-1)
	} else {
		fmt.Println(distance[target])
	}
}`,
    'Sliding Window Maximum': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	in := bufio.NewReader(os.Stdin)
	var n, k int
	if _, err := fmt.Fscan(in, &n, &k); err != nil {
		return
	}

	values := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Fscan(in, &values[i])
	}

	deque := make([]int, 0)
	answer := make([]int, 0)
	for i := 0; i < n; i++ {
		for len(deque) > 0 && deque[0] <= i-k {
			deque = deque[1:]
		}
		for len(deque) > 0 && values[deque[len(deque)-1]] <= values[i] {
			deque = deque[:len(deque)-1]
		}
		deque = append(deque, i)
		if i+1 >= k {
			answer = append(answer, values[deque[0]])
		}
	}

	for i, value := range answer {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(value)
	}
	fmt.Println()
}`,
    'LRU Cache': String.raw`package main

import (
	"bufio"
	"container/list"
	"fmt"
	"os"
)

type entry struct {
	key   int
	value int
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var capacity, q int
	if _, err := fmt.Fscan(in, &capacity, &q); err != nil {
		return
	}

	order := list.New()
	positions := map[int]*list.Element{}
	outputs := make([]string, 0)

	moveToFront := func(key, value int) {
		if element, ok := positions[key]; ok {
			element.Value = entry{key: key, value: value}
			order.MoveToFront(element)
			return
		}
		element := order.PushFront(entry{key: key, value: value})
		positions[key] = element
		if order.Len() > capacity {
			last := order.Back()
			item := last.Value.(entry)
			delete(positions, item.key)
			order.Remove(last)
		}
	}

	for i := 0; i < q; i++ {
		var command string
		fmt.Fscan(in, &command)
		if command == "PUT" {
			var key, value int
			fmt.Fscan(in, &key, &value)
			moveToFront(key, value)
		} else {
			var key int
			fmt.Fscan(in, &key)
			if element, ok := positions[key]; ok {
				order.MoveToFront(element)
				outputs = append(outputs, fmt.Sprintf("%d", element.Value.(entry).value))
			} else {
				outputs = append(outputs, "-1")
			}
		}
	}

	for i, value := range outputs {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(value)
	}
	fmt.Println()
}`,
    'Trie Prefix Search': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	in := bufio.NewReader(os.Stdin)
	var wordCount, queryCount int
	if _, err := fmt.Fscan(in, &wordCount, &queryCount); err != nil {
		return
	}

	words := make([]string, wordCount)
	for i := 0; i < wordCount; i++ {
		fmt.Fscan(in, &words[i])
	}

	answer := make([]int, queryCount)
	for i := 0; i < queryCount; i++ {
		var prefix string
		fmt.Fscan(in, &prefix)
		for _, word := range words {
			if len(word) >= len(prefix) && word[:len(prefix)] == prefix {
				answer[i]++
			}
		}
	}

	for i, value := range answer {
		if i > 0 {
			fmt.Print(" ")
		}
		fmt.Print(value)
	}
	fmt.Println()
}`,
    'Word Ladder': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
)

type state struct {
	word  string
	steps int
}

func main() {
	in := bufio.NewReader(os.Stdin)
	var beginWord, endWord string
	if _, err := fmt.Fscan(in, &beginWord, &endWord); err != nil {
		return
	}
	var wordCount int
	fmt.Fscan(in, &wordCount)

	words := map[string]bool{}
	for i := 0; i < wordCount; i++ {
		var word string
		fmt.Fscan(in, &word)
		words[word] = true
	}

	if !words[endWord] {
		fmt.Println(0)
		return
	}

	queue := []state{{word: beginWord, steps: 1}}
	visited := map[string]bool{beginWord: true}

	for head := 0; head < len(queue); head++ {
		current := queue[head]
		if current.word == endWord {
			fmt.Println(current.steps)
			return
		}

		letters := []byte(current.word)
		for i := range letters {
			original := letters[i]
			for ch := byte('a'); ch <= 'z'; ch++ {
				if ch == original {
					continue
				}
				letters[i] = ch
				nextWord := string(letters)
				if words[nextWord] && !visited[nextWord] {
					visited[nextWord] = true
					queue = append(queue, state{word: nextWord, steps: current.steps + 1})
				}
			}
			letters[i] = original
		}
	}

	fmt.Println(0)
}`,
    'Kth Largest Element': String.raw`package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
)

func main() {
	in := bufio.NewReader(os.Stdin)
	var n, k int
	if _, err := fmt.Fscan(in, &n, &k); err != nil {
		return
	}

	values := make([]int, n)
	for i := 0; i < n; i++ {
		fmt.Fscan(in, &values[i])
	}

	sort.Slice(values, func(i, j int) bool { return values[i] > values[j] })
	fmt.Println(values[k-1])
}`,
  },
  TypeScript: {
    'Merge Intervals': String.raw`const fs = require('fs');
const tokens = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let index = 0;
const n = tokens[index++];
const intervals: Array<[number, number]> = [];

for (let i = 0; i < n; i += 1) {
  intervals.push([tokens[index++], tokens[index++]]);
}

intervals.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
const merged: Array<[number, number]> = [];

for (const current of intervals) {
  if (merged.length === 0 || current[0] > merged[merged.length - 1][1]) {
    merged.push([current[0], current[1]]);
  } else {
    merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], current[1]);
  }
}

console.log(merged.map(item => item[0] + ' ' + item[1]).join(' | '));`,
    'Longest Common Subsequence': String.raw`const fs = require('fs');
const parts = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
const first = parts[0] || '';
const second = parts[1] || '';
const dp: number[][] = Array.from({ length: first.length + 1 }, () => Array(second.length + 1).fill(0));

for (let i = 1; i <= first.length; i += 1) {
  for (let j = 1; j <= second.length; j += 1) {
    if (first[i - 1] === second[j - 1]) {
      dp[i][j] = dp[i - 1][j - 1] + 1;
    } else {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
}

console.log(dp[first.length][second.length]);`,
    'Top K Frequent Elements': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let index = 0;
const n = numbers[index++];
const k = numbers[index++];
const frequency = new Map<number, number>();

for (let i = 0; i < n; i += 1) {
  const value = numbers[index++];
  frequency.set(value, (frequency.get(value) || 0) + 1);
}

const ordered = Array.from(frequency.entries()).sort((left, right) => {
  if (right[1] === left[1]) {
    return left[0] - right[0];
  }
  return right[1] - left[1];
});

console.log(ordered.slice(0, k).map(item => item[0]).join(' '));`,
    'Course Schedule': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let index = 0;
const courseCount = numbers[index++];
const pairCount = numbers[index++];
const graph: number[][] = Array.from({ length: courseCount }, () => []);
const indegree: number[] = Array(courseCount).fill(0);

for (let i = 0; i < pairCount; i += 1) {
  const course = numbers[index++];
  const prereq = numbers[index++];
  graph[prereq].push(course);
  indegree[course] += 1;
}

const queue: number[] = [];
for (let i = 0; i < courseCount; i += 1) {
  if (indegree[i] === 0) {
    queue.push(i);
  }
}

let visited = 0;
for (let head = 0; head < queue.length; head += 1) {
  const node = queue[head];
  visited += 1;
  for (const neighbor of graph[node]) {
    indegree[neighbor] -= 1;
    if (indegree[neighbor] === 0) {
      queue.push(neighbor);
    }
  }
}

console.log(visited === courseCount ? 'true' : 'false');`,
    'Dijkstra Shortest Path': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let index = 0;
const nodeCount = numbers[index++];
const edgeCount = numbers[index++];
const graph: Array<Array<{ to: number; weight: number }>> = Array.from({ length: nodeCount + 1 }, () => []);

for (let i = 0; i < edgeCount; i += 1) {
  const start = numbers[index++];
  const end = numbers[index++];
  const weight = numbers[index++];
  graph[start].push({ to: end, weight });
}

const source = numbers[index++];
const target = numbers[index++];
const distance = Array(nodeCount + 1).fill(Number.MAX_SAFE_INTEGER);
distance[source] = 0;
const heap: Array<{ cost: number; node: number }> = [{ cost: 0, node: source }];

while (heap.length > 0) {
  heap.sort((a, b) => a.cost - b.cost);
  const current = heap.shift()!;
  if (current.cost !== distance[current.node]) {
    continue;
  }
  for (const next of graph[current.node]) {
    const nextCost = current.cost + next.weight;
    if (nextCost < distance[next.to]) {
      distance[next.to] = nextCost;
      heap.push({ cost: nextCost, node: next.to });
    }
  }
}

console.log(distance[target] === Number.MAX_SAFE_INTEGER ? -1 : distance[target]);`,
    'Sliding Window Maximum': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let index = 0;
const n = numbers[index++];
const k = numbers[index++];
const values = numbers.slice(index, index + n);
const deque: number[] = [];
const answer: number[] = [];

for (let i = 0; i < values.length; i += 1) {
  while (deque.length > 0 && deque[0] <= i - k) {
    deque.shift();
  }
  while (deque.length > 0 && values[deque[deque.length - 1]] <= values[i]) {
    deque.pop();
  }
  deque.push(i);
  if (i + 1 >= k) {
    answer.push(values[deque[0]]);
  }
}

console.log(answer.join(' '));`,
    'LRU Cache': String.raw`const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split(/\r?\n/);
const [capacity, q] = lines[0].trim().split(/\s+/).map(Number);
const cache = new Map<number, number>();
const outputs: string[] = [];

function touch(key: number, value: number): void {
  if (cache.has(key)) {
    cache.delete(key);
  }
  cache.set(key, value);
  if (cache.size > capacity) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

for (let i = 1; i <= q; i += 1) {
  const parts = lines[i].trim().split(/\s+/);
  if (parts[0] === 'PUT') {
    touch(Number(parts[1]), Number(parts[2]));
  } else {
    const key = Number(parts[1]);
    if (cache.has(key)) {
      const value = cache.get(key)!;
      touch(key, value);
      outputs.push(String(value));
    } else {
      outputs.push('-1');
    }
  }
}

console.log(outputs.join(' '));`,
    'Trie Prefix Search': String.raw`const fs = require('fs');
const tokens = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
let index = 0;
const wordCount = Number(tokens[index++]);
const queryCount = Number(tokens[index++]);
const words: string[] = [];
for (let i = 0; i < wordCount; i += 1) {
  words.push(tokens[index++]);
}

const answers: number[] = [];
for (let i = 0; i < queryCount; i += 1) {
  const prefix = tokens[index++];
  let count = 0;
  for (const word of words) {
    if (word.startsWith(prefix)) {
      count += 1;
    }
  }
  answers.push(count);
}

console.log(answers.join(' '));`,
    'Word Ladder': String.raw`const fs = require('fs');
const tokens = fs.readFileSync(0, 'utf8').trim().split(/\s+/);
let index = 0;
const beginWord = tokens[index++];
const endWord = tokens[index++];
const wordCount = Number(tokens[index++]);
const words = new Set<string>();
for (let i = 0; i < wordCount; i += 1) {
  words.add(tokens[index++]);
}

if (!words.has(endWord)) {
  console.log(0);
  process.exit(0);
}

const queue: Array<{ word: string; steps: number }> = [{ word: beginWord, steps: 1 }];
const visited = new Set<string>([beginWord]);

for (let head = 0; head < queue.length; head += 1) {
  const current = queue[head];
  if (current.word === endWord) {
    console.log(current.steps);
    process.exit(0);
  }

  const chars = current.word.split('');
  for (let i = 0; i < chars.length; i += 1) {
    const original = chars[i];
    for (let code = 97; code <= 122; code += 1) {
      const ch = String.fromCharCode(code);
      if (ch === original) continue;
      chars[i] = ch;
      const nextWord = chars.join('');
      if (words.has(nextWord) && !visited.has(nextWord)) {
        visited.add(nextWord);
        queue.push({ word: nextWord, steps: current.steps + 1 });
      }
    }
    chars[i] = original;
  }
}

console.log(0);`,
    'Kth Largest Element': String.raw`const fs = require('fs');
const numbers = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
let index = 0;
const n = numbers[index++];
const k = numbers[index++];
const values = numbers.slice(index, index + n).sort((a, b) => b - a);
console.log(values[k - 1]);`,
  },
  Rust: {
    'Merge Intervals': String.raw`use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();

    let n: usize = match iter.next() {
        Some(value) => value.parse().unwrap(),
        None => return,
    };

    let mut intervals: Vec<(i32, i32)> = Vec::with_capacity(n);
    for _ in 0..n {
        let start: i32 = iter.next().unwrap().parse().unwrap();
        let end: i32 = iter.next().unwrap().parse().unwrap();
        intervals.push((start, end));
    }

    intervals.sort();
    let mut merged: Vec<(i32, i32)> = Vec::new();
    for (start, end) in intervals {
        if let Some(last) = merged.last_mut() {
            if start <= last.1 {
                if end > last.1 {
                    last.1 = end;
                }
            } else {
                merged.push((start, end));
            }
        } else {
            merged.push((start, end));
        }
    }

    let output: Vec<String> = merged
        .iter()
        .map(|(start, end)| format!("{} {}", start, end))
        .collect();
    println!("{}", output.join(" | "));
}`,
    'Longest Common Subsequence': String.raw`use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let parts: Vec<&str> = input.split_whitespace().collect();
    if parts.len() < 2 {
        return;
    }

    let first = parts[0].as_bytes();
    let second = parts[1].as_bytes();
    let mut dp = vec![vec![0usize; second.len() + 1]; first.len() + 1];

    for i in 1..=first.len() {
        for j in 1..=second.len() {
            if first[i - 1] == second[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]);
            }
        }
    }

    println!("{}", dp[first.len()][second.len()]);
}`,
    'Top K Frequent Elements': String.raw`use std::collections::HashMap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let numbers: Vec<i32> = input.split_whitespace().map(|value| value.parse().unwrap()).collect();
    if numbers.len() < 2 {
        return;
    }

    let n = numbers[0] as usize;
    let k = numbers[1] as usize;
    let mut freq: HashMap<i32, i32> = HashMap::new();
    for value in &numbers[2..2 + n] {
        *freq.entry(*value).or_insert(0) += 1;
    }

    let mut items: Vec<(i32, i32)> = freq.into_iter().collect();
    items.sort_by(|left, right| right.1.cmp(&left.1).then(left.0.cmp(&right.0)));

    let answer: Vec<String> = items.iter().take(k).map(|(value, _)| value.to_string()).collect();
    println!("{}", answer.join(" "));
}`,
    'Course Schedule': String.raw`use std::collections::VecDeque;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let numbers: Vec<usize> = input.split_whitespace().map(|value| value.parse().unwrap()).collect();
    if numbers.len() < 2 {
        return;
    }

    let course_count = numbers[0];
    let pair_count = numbers[1];
    let mut graph = vec![Vec::<usize>::new(); course_count];
    let mut indegree = vec![0usize; course_count];
    let mut index = 2;

    for _ in 0..pair_count {
        let course = numbers[index];
        let prereq = numbers[index + 1];
        index += 2;
        graph[prereq].push(course);
        indegree[course] += 1;
    }

    let mut queue = VecDeque::new();
    for i in 0..course_count {
        if indegree[i] == 0 {
            queue.push_back(i);
        }
    }

    let mut visited = 0usize;
    while let Some(node) = queue.pop_front() {
        visited += 1;
        for &neighbor in &graph[node] {
            indegree[neighbor] -= 1;
            if indegree[neighbor] == 0 {
                queue.push_back(neighbor);
            }
        }
    }

    println!("{}", if visited == course_count { "true" } else { "false" });
}`,
    'Dijkstra Shortest Path': String.raw`use std::cmp::Reverse;
use std::collections::BinaryHeap;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let numbers: Vec<i64> = input.split_whitespace().map(|value| value.parse().unwrap()).collect();
    if numbers.len() < 2 {
        return;
    }

    let node_count = numbers[0] as usize;
    let edge_count = numbers[1] as usize;
    let mut graph = vec![Vec::<(usize, i64)>::new(); node_count + 1];
    let mut index = 2;

    for _ in 0..edge_count {
        let start = numbers[index] as usize;
        let end = numbers[index + 1] as usize;
        let weight = numbers[index + 2];
        index += 3;
        graph[start].push((end, weight));
    }

    let source = numbers[index] as usize;
    let target = numbers[index + 1] as usize;
    let inf = i64::MAX / 4;
    let mut distance = vec![inf; node_count + 1];
    distance[source] = 0;

    let mut heap = BinaryHeap::new();
    heap.push((Reverse(0_i64), source));

    while let Some((Reverse(cost), node)) = heap.pop() {
        if cost != distance[node] {
            continue;
        }
        for &(next, weight) in &graph[node] {
            let next_cost = cost + weight;
            if next_cost < distance[next] {
                distance[next] = next_cost;
                heap.push((Reverse(next_cost), next));
            }
        }
    }

    if distance[target] == inf {
        println!("-1");
    } else {
        println!("{}", distance[target]);
    }
}`,
    'Sliding Window Maximum': String.raw`use std::collections::VecDeque;
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let numbers: Vec<i32> = input.split_whitespace().map(|value| value.parse().unwrap()).collect();
    if numbers.len() < 2 {
        return;
    }

    let n = numbers[0] as usize;
    let k = numbers[1] as usize;
    let values = &numbers[2..2 + n];

    let mut deque: VecDeque<usize> = VecDeque::new();
    let mut answer: Vec<String> = Vec::new();

    for i in 0..values.len() {
        while deque.front().map_or(false, |&front| front + k <= i) {
            deque.pop_front();
        }
        while deque.back().map_or(false, |&back| values[back] <= values[i]) {
            deque.pop_back();
        }
        deque.push_back(i);
        if i + 1 >= k {
            answer.push(values[*deque.front().unwrap()].to_string());
        }
    }

    println!("{}", answer.join(" "));
}`,
    'LRU Cache': String.raw`use std::collections::{HashMap, VecDeque};
use std::io::{self, Read};

fn touch(order: &mut VecDeque<i32>, key: i32) {
    if let Some(position) = order.iter().position(|&value| value == key) {
        order.remove(position);
    }
    order.push_front(key);
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();

    let capacity: usize = match iter.next() {
        Some(value) => value.parse().unwrap(),
        None => return,
    };
    let q: usize = iter.next().unwrap().parse().unwrap();

    let mut values: HashMap<i32, i32> = HashMap::new();
    let mut order: VecDeque<i32> = VecDeque::new();
    let mut outputs: Vec<String> = Vec::new();

    for _ in 0..q {
        let command = iter.next().unwrap();
        if command == "PUT" {
            let key: i32 = iter.next().unwrap().parse().unwrap();
            let value: i32 = iter.next().unwrap().parse().unwrap();
            values.insert(key, value);
            touch(&mut order, key);
            if order.len() > capacity {
                if let Some(oldest) = order.pop_back() {
                    values.remove(&oldest);
                }
            }
        } else {
            let key: i32 = iter.next().unwrap().parse().unwrap();
            if let Some(&value) = values.get(&key) {
                touch(&mut order, key);
                outputs.push(value.to_string());
            } else {
                outputs.push("-1".to_string());
            }
        }
    }

    println!("{}", outputs.join(" "));
}`,
    'Trie Prefix Search': String.raw`use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();

    let word_count: usize = match iter.next() {
        Some(value) => value.parse().unwrap(),
        None => return,
    };
    let query_count: usize = iter.next().unwrap().parse().unwrap();

    let mut words = Vec::with_capacity(word_count);
    for _ in 0..word_count {
        words.push(iter.next().unwrap().to_string());
    }

    let mut outputs = Vec::with_capacity(query_count);
    for _ in 0..query_count {
        let prefix = iter.next().unwrap();
        let count = words.iter().filter(|word| word.starts_with(prefix)).count();
        outputs.push(count.to_string());
    }

    println!("{}", outputs.join(" "));
}`,
    'Word Ladder': String.raw`use std::collections::{HashSet, VecDeque};
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();

    let begin_word = match iter.next() {
        Some(value) => value.to_string(),
        None => return,
    };
    let end_word = iter.next().unwrap().to_string();
    let word_count: usize = iter.next().unwrap().parse().unwrap();

    let mut words = HashSet::new();
    for _ in 0..word_count {
        words.insert(iter.next().unwrap().to_string());
    }

    if !words.contains(&end_word) {
        println!("0");
        return;
    }

    let mut queue = VecDeque::new();
    queue.push_back((begin_word.clone(), 1usize));
    let mut visited = HashSet::new();
    visited.insert(begin_word);

    while let Some((word, steps)) = queue.pop_front() {
        if word == end_word {
            println!("{}", steps);
            return;
        }

        let mut chars: Vec<char> = word.chars().collect();
        for i in 0..chars.len() {
            let original = chars[i];
            for byte in b'a'..=b'z' {
                let ch = byte as char;
                if ch == original {
                    continue;
                }
                chars[i] = ch;
                let next_word: String = chars.iter().collect();
                if words.contains(&next_word) && !visited.contains(&next_word) {
                    visited.insert(next_word.clone());
                    queue.push_back((next_word, steps + 1));
                }
            }
            chars[i] = original;
        }
    }

    println!("0");
}`,
    'Kth Largest Element': String.raw`use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut numbers: Vec<i32> = input.split_whitespace().map(|value| value.parse().unwrap()).collect();
    if numbers.len() < 2 {
        return;
    }

    let n = numbers[0] as usize;
    let k = numbers[1] as usize;
    let mut values = numbers.drain(2..2 + n).collect::<Vec<i32>>();
    values.sort_by(|left, right| right.cmp(left));
    println!("{}", values[k - 1]);
}`,
  },
};

function buildMarkdown() {
  const lines = [];
  lines.push('# Coding Practice Seed Questions And Answers');
  lines.push('');
  lines.push('This file follows the same language order as the Coding Practice UI and uses the exact seeded question text for each language.');
  lines.push('');
  lines.push('Important: students should type code in the website editor.');
  lines.push('');
  lines.push('- Each answer below is language-matched to its section.');
  lines.push('- Languages are listed in the same order as the app sidebar.');
  lines.push('- Every task is shown in a simple Q / A format.');
  lines.push('');

  for (const level of LEVEL_ORDER) {
    lines.push(`## ${LEVEL_TITLES[level]}`);
    lines.push('');

    const languages = LANGUAGE_ORDER.filter(language => LANGUAGE_LEVEL[language] === level);
    for (const language of languages) {
      lines.push(`### ${language}`);
      lines.push('');

      const problems = CODING_PROBLEMS
        .filter(problem => problem.language === language)
        .sort((left, right) => left.task_number - right.task_number);

      for (const problem of problems) {
        const answer = SOLUTIONS[language]?.[problem.title];
        if (!answer) {
          throw new Error(`Missing solution for ${language} -> ${problem.title}`);
        }

        lines.push(`#### Task ${problem.task_number}: ${problem.title}`);
        lines.push('');
        lines.push(`Q: ${problem.description}`);
        lines.push('');
        lines.push(`A: Reference answer in ${language}`);
        lines.push('');
        lines.push(`\`\`\`${FENCE_BY_LANGUAGE[language]}`);
        lines.push(answer);
        lines.push('```');
        lines.push('');
      }
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, buildMarkdown());
console.log(OUTPUT_FILE);
