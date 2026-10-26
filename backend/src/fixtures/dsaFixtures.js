/**
 * Authentic Curated Problem Solutions Dataset
 * Contains documented C++ solutions with dry-runs, Big-O complexities, and problem references.
 */
const rawCuratedDsaProblems = [
  // --- LEETCODE PROBLEMS ---
  {
    slug: 'two-sum-sorted',
    platform: 'leetcode',
    problemId: '167',
    title: 'Two Sum II — Input Array Is Sorted',
    difficulty: 'Medium',
    rating: null,
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Binary Search'],
    problemUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    summary: 'Find two numbers that add up to a specific target number in a 1-indexed sorted array.',
    approach:
      'Initialize left pointer at the beginning (index 0) and right pointer at the end (size - 1). Compute currentSum: if sum equals target, return 1-based indices; if sum is less than target, advance left pointer to increase sum; if greater, decrement right pointer.',
    dryRun:
      'Array: [2, 7, 11, 15], Target: 9. Step 1: left=0 (2), right=3 (15), sum=17 > 9 -> right=2. Step 2: left=0 (2), right=2 (11), sum=13 > 9 -> right=1. Step 3: left=0 (2), right=1 (7), sum=9 == target -> Return indices [1, 2].',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize left=0 (val=2), right=3 (val=15). Calculate sum = 2 + 15 = 17.',
        variables: { left: 0, right: 3, 'nums[left]': 2, 'nums[right]': 15, currentSum: 17, target: 9 },
        highlight: 'currentSum (17) > target (9): Decrement right pointer to 2.',
      },
      {
        step: 2,
        description: 'Now left=0 (val=2), right=2 (val=11). Calculate sum = 2 + 11 = 13.',
        variables: { left: 0, right: 2, 'nums[left]': 2, 'nums[right]': 11, currentSum: 13, target: 9 },
        highlight: 'currentSum (13) > target (9): Still too large. Decrement right pointer to 1.',
      },
      {
        step: 3,
        description: 'Now left=0 (val=2), right=1 (val=7). Calculate sum = 2 + 7 = 9.',
        variables: { left: 0, right: 1, 'nums[left]': 2, 'nums[right]': 7, currentSum: 9, target: 9 },
        highlight: 'currentSum (9) == target (9): Target match! Return 1-based indices: [1, 2].',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '3 ms',
    memory: '15.8 MB',
    sourceCode: `// C++ Optimal Solution using Two Pointers (LeetCode #167)
#include <vector>

std::vector<int> twoSum(std::vector<int>& numbers, int target) {
    int left = 0;
    int right = static_cast<int>(numbers.size()) - 1;
    
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        if (currentSum == target) {
            return {left + 1, right + 1}; // 1-indexed return
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {};
}`,
  },
  {
    slug: 'longest-substring-without-repeats',
    platform: 'leetcode',
    problemId: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    rating: null,
    category: 'Sliding Window',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    problemUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    summary: 'Given a string s, find the length of the longest substring without duplicate characters.',
    approach:
      'Maintain dynamic sliding window [left, right] alongside a 256-element array storing the latest index of each encountered character. When duplicate occurs, jump left pointer to lastIndex[s[right]] + 1.',
    dryRun:
      'String: "abcabcbb". Window expands: "a" (len 1), "ab" (len 2), "abc" (len 3). At next "a", duplicate detected at index 0 -> left moves to 1 ("bca", maxLen=3). Final max window length is 3.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Start window at right=0, char "a". Not seen before. Update lastIndex[\'a\']=0, maxLen=1.',
        variables: { left: 0, right: 0, 's[right]': 'a', window: '"a"', maxLength: 1 },
        highlight: 'Window is valid with 1 unique character.',
      },
      {
        step: 2,
        description: 'Expand to right=1, char "b". Not seen before. lastIndex[\'b\']=1, maxLen=2.',
        variables: { left: 0, right: 1, 's[right]': 'b', window: '"ab"', maxLength: 2 },
        highlight: 'Window expands to length 2 without duplicates.',
      },
      {
        step: 3,
        description: 'Expand to right=2, char "c". Not seen before. lastIndex[\'c\']=2, maxLen=3.',
        variables: { left: 0, right: 2, 's[right]': 'c', window: '"abc"', maxLength: 3 },
        highlight: 'Window expands to length 3.',
      },
      {
        step: 4,
        description: 'Expand to right=3, char "a". Duplicate detected! previous lastIndex[\'a\']=0 >= left (0). Jump left to 0 + 1 = 1.',
        variables: { left: 1, right: 3, 's[right]': 'a', window: '"bca"', maxLength: 3 },
        highlight: 'Duplicate resolved by sliding left pointer to 1. Window "bca" maintains length 3.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M)) where M is alphabet size',
    language: 'C++',
    status: 'Solved',
    runtime: '7 ms',
    memory: '8.4 MB',
    sourceCode: `// C++ Optimal Sliding Window with Hash Array (LeetCode #3)
#include <string>
#include <vector>
#include <algorithm>

int lengthOfLongestSubstring(std::string s) {
    std::vector<int> lastIndex(256, -1);
    int maxLength = 0;
    int left = 0;
    
    for (int right = 0; right < static_cast<int>(s.length()); ++right) {
        unsigned char c = static_cast<unsigned char>(s[right]);
        if (lastIndex[c] >= left) {
            left = lastIndex[c] + 1;
        }
        lastIndex[c] = right;
        maxLength = std::max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
  },
  {
    slug: 'trapping-rain-water',
    platform: 'leetcode',
    problemId: '42',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    rating: null,
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    problemUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    summary: 'Compute how much water an elevation map can trap after raining.',
    approach:
      'Use two pointers (left and right) with maxLeft and maxRight trackers. At each iteration, advance pointer corresponding to the smaller maximum height, accumulating water as maxBoundary - currentHeight in O(1) auxiliary space.',
    dryRun:
      'Elevation: [0,1,0,2,1,0,1,3,2,1,2,1]. Water trapped above index 2 is 1 unit; index 4 is 1 unit; index 5 is 2 units; index 6 is 1 unit; index 9 is 1 unit. Total trapped = 6 units.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize left=0 (height=0), right=11 (height=1), maxL=0, maxR=0, total=0.',
        variables: { left: 0, right: 11, maxLeft: 0, maxRight: 0, trapped: 0 },
        highlight: 'height[left] <= height[right]: Process left side first.',
      },
      {
        step: 2,
        description: 'left advances to index 1 (height=1). Update maxLeft=1.',
        variables: { left: 1, right: 11, maxLeft: 1, maxRight: 1, trapped: 0 },
        highlight: 'Boundary established at left.',
      },
      {
        step: 3,
        description: 'left advances to index 2 (height=0). Trapped = maxLeft - height[2] = 1 - 0 = 1.',
        variables: { left: 2, right: 11, maxLeft: 1, maxRight: 1, trapped: 1 },
        highlight: 'Water collected: +1 unit.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '0 ms',
    memory: '23.4 MB',
    sourceCode: `// C++ Optimal Two-Pointer In-Place Trapping Water (LeetCode #42)
#include <vector>
#include <algorithm>

int trap(std::vector<int>& height) {
    if (height.empty()) return 0;
    
    int left = 0, right = static_cast<int>(height.size()) - 1;
    int maxLeft = 0, maxRight = 0;
    int totalWater = 0;
    
    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                totalWater += (maxLeft - height[left]);
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                totalWater += (maxRight - height[right]);
            }
            right--;
        }
    }
    return totalWater;
}`,
  },
  {
    slug: 'valid-palindrome',
    platform: 'leetcode',
    problemId: '125',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    rating: null,
    category: 'Two Pointers',
    tags: ['Two Pointers', 'String'],
    problemUrl: 'https://leetcode.com/problems/valid-palindrome/',
    summary: 'Determine if a given string is a palindrome after converting all uppercase letters into lowercase and removing all non-alphanumeric characters.',
    approach:
      'Maintain two pointers left and right. Advance left and decrement right skipping non-alphanumeric characters using std::isalnum. Compare characters in lowercase; if mismatch occurs, return false immediately.',
    dryRun:
      'Input: "A man, a plan, a canal: Panama". Clean characters: "amanaplanacanalpanama". Compares equal from outside in. Returns true.',
    dryRunSteps: [
      {
        step: 1,
        description: 'left=0 (\'A\'), right=29 (\'a\'). Lowercase match \'a\' == \'a\'. Advance both.',
        variables: { left: 0, right: 29, charLeft: 'a', charRight: 'a' },
        highlight: 'Valid match.',
      },
      {
        step: 2,
        description: 'Skip spaces and punctuation. left=2 (\'m\'), right=27 (\'m\'). Match \'m\' == \'m\'.',
        variables: { left: 2, right: 27, charLeft: 'm', charRight: 'm' },
        highlight: 'Matches smoothly.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '4 ms',
    memory: '7.8 MB',
    sourceCode: `// C++ In-Place Two Pointers (LeetCode #125)
#include <string>
#include <cctype>

bool isPalindrome(std::string s) {
    int left = 0;
    int right = static_cast<int>(s.length()) - 1;
    
    while (left < right) {
        while (left < right && !std::isalnum(static_cast<unsigned char>(s[left]))) {
            left++;
        }
        while (left < right && !std::isalnum(static_cast<unsigned char>(s[right]))) {
            right--;
        }
        if (std::tolower(static_cast<unsigned char>(s[left])) != 
            std::tolower(static_cast<unsigned char>(s[right]))) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
  },
  {
    slug: 'container-with-most-water',
    platform: 'leetcode',
    problemId: '11',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    rating: null,
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    problemUrl: 'https://leetcode.com/problems/container-with-most-water/',
    summary: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    approach:
      'Begin with widest possible container (left=0, right=size-1). Compute area = min(height[left], height[right]) * (right - left). The shorter line limits the area; shift the shorter line inward seeking a taller boundary.',
    dryRun:
      'Heights: [1,8,6,2,5,4,8,3,7]. Width=8, minH=1 -> area 8. Left shifts to index 1 (height 8). Maximum area achieved is 49 (indices 1 and 8: min(8,7)*7 = 49).',
    dryRunSteps: [
      {
        step: 1,
        description: 'left=0 (h=1), right=8 (h=7). width=8, area=min(1,7)*8 = 8. maxArea=8.',
        variables: { left: 0, right: 8, heightLeft: 1, heightRight: 7, currentArea: 8, maxArea: 8 },
        highlight: 'height[left] < height[right]: Move left to index 1.',
      },
      {
        step: 2,
        description: 'left=1 (h=8), right=8 (h=7). width=7, area=min(8,7)*7 = 49. maxArea=49.',
        variables: { left: 1, right: 8, heightLeft: 8, heightRight: 7, currentArea: 49, maxArea: 49 },
        highlight: 'Substantial area increase: 49 units.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '48 ms',
    memory: '59.2 MB',
    sourceCode: `// C++ Greedy Two-Pointer Optimization (LeetCode #11)
#include <vector>
#include <algorithm>

int maxArea(std::vector<int>& height) {
    int left = 0;
    int right = static_cast<int>(height.size()) - 1;
    int maxWater = 0;
    
    while (left < right) {
        int currentHeight = std::min(height[left], height[right]);
        int currentWidth = right - left;
        maxWater = std::max(maxWater, currentHeight * currentWidth);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}`,
  },
  {
    slug: 'subsets',
    platform: 'leetcode',
    problemId: '78',
    title: 'Subsets (Power Set)',
    difficulty: 'Medium',
    rating: null,
    category: 'Recursion & Backtracking',
    tags: ['Array', 'Backtracking', 'Bit Manipulation'],
    problemUrl: 'https://leetcode.com/problems/subsets/',
    summary: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
    approach:
      'Use depth-first recursive backtracking. At index i, explore both decisions: either include nums[i] in the current subset and recurse, then backtrack (pop element) and explore the branch without nums[i].',
    dryRun:
      'nums = [1, 2, 3]. Generates 2^3 = 8 subsets: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3].',
    dryRunSteps: [
      {
        step: 1,
        description: 'Start with empty subset []. Add [] to result set.',
        variables: { index: 0, currentSubset: '[]', totalSubsets: 1 },
        highlight: 'Base empty subset added.',
      },
      {
        step: 2,
        description: 'Include 1 -> [1]. Recurse.',
        variables: { index: 1, currentSubset: '[1]', totalSubsets: 2 },
        highlight: 'Branching on element 1.',
      },
    ],
    timeComplexity: 'O(N * 2^N)',
    spaceComplexity: 'O(N) recursion stack',
    language: 'C++',
    status: 'Solved',
    runtime: '0 ms',
    memory: '7.4 MB',
    sourceCode: `// C++ Backtracking Power Set Generation (LeetCode #78)
#include <vector>

void backtrack(int index, const std::vector<int>& nums, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    
    for (int i = index; i < static_cast<int>(nums.size()); ++i) {
        current.push_back(nums[i]);
        backtrack(i + 1, nums, current, result);
        current.pop_back(); // Backtrack
    }
}

std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
    std::vector<std::vector<int>> result;
    std::vector<int> current;
    backtrack(0, nums, current, result);
    return result;
}`,
  },
  {
    slug: 'subarray-sum-equals-k',
    platform: 'leetcode',
    problemId: '560',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    rating: null,
    category: 'Hashing',
    tags: ['Array', 'Hash Table', 'Prefix Sum'],
    problemUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    summary: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
    approach:
      'Maintain running prefixSum. For current sum S, any prior prefix sum equal to (S - k) implies the intermediate subarray sums to k. Store frequencies of prefix sums in an unordered_map, initialized with map[0] = 1.',
    dryRun:
      'nums = [1, 1, 1], k = 2. prefixSum sequence: 1, 2, 3. At index 1 (sum=2), sum-k = 0 (freq 1) -> count=1. At index 2 (sum=3), sum-k = 1 (freq 1) -> count=2. Returns 2.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize map={0:1}, prefixSum=0, count=0.',
        variables: { prefixSum: 0, count: 0, 'map[0]': 1 },
        highlight: 'Base prefix frequency initialized.',
      },
      {
        step: 2,
        description: 'Index 0, val=1. prefixSum=1. map[1-2]=map[-1] not found. Add map[1]=1.',
        variables: { prefixSum: 1, count: 0 },
        highlight: 'Running sum recorded.',
      },
      {
        step: 3,
        description: 'Index 1, val=1. prefixSum=2. map[2-2]=map[0]=1. count becomes 1. Add map[2]=1.',
        variables: { prefixSum: 2, count: 1 },
        highlight: 'Subarray [1, 1] found!',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    language: 'C++',
    status: 'Solved',
    runtime: '58 ms',
    memory: '46.1 MB',
    sourceCode: `// C++ Optimal Prefix Sum with Hash Map (LeetCode #560)
#include <vector>
#include <unordered_map>

int subarraySum(std::vector<int>& nums, int k) {
    std::unordered_map<int, int> prefixFreq;
    prefixFreq[0] = 1; // Base case: prefix sum of 0 appears once
    
    int prefixSum = 0;
    int totalCount = 0;
    
    for (int num : nums) {
        prefixSum += num;
        if (prefixFreq.find(prefixSum - k) != prefixFreq.end()) {
            totalCount += prefixFreq[prefixSum - k];
        }
        prefixFreq[prefixSum]++;
    }
    return totalCount;
}`,
  },

  // --- CODEFORCES PROBLEMS ---
  {
    slug: 'watermelon',
    platform: 'codeforces',
    problemId: '4A',
    title: 'Watermelon',
    difficulty: '800',
    rating: 800,
    category: 'Brute Force & Math',
    tags: ['brute force', 'math'],
    problemUrl: 'https://codeforces.com/problemset/problem/4/A',
    summary: 'Determine whether a watermelon weighing w kilos can be split into two parts such that each part weighs an even positive number of kilos.',
    approach:
      'The sum of two even numbers is always even. Thus, w must be even. Furthermore, each positive even part is at least 2, meaning w >= 4. If w > 2 and w % 2 == 0, output "YES", otherwise "NO".',
    dryRun:
      'Input w = 8. 8 is even and > 2 (can be split as 4+4 or 2+6). Output: YES. Input w = 2. Smallest even split is 1+1 (odd). Output: NO.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Read weight w from stdin.',
        variables: { w: 8 },
        highlight: 'Check constraints: w % 2 == 0 and w > 2.',
      },
      {
        step: 2,
        description: 'Evaluate condition: 8 % 2 == 0 (true) and 8 > 2 (true).',
        variables: { condition: true },
        highlight: 'Print "YES".',
      },
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '30 ms',
    memory: '0 KB',
    sourceCode: `// Codeforces #4A - Watermelon
#include <iostream>

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    
    int w;
    if (std::cin >> w) {
        if (w > 2 && w % 2 == 0) {
            std::cout << "YES\\n";
        } else {
            std::cout << "NO\\n";
        }
    }
    return 0;
}`,
  },
  {
    slug: 'way-too-long-words',
    platform: 'codeforces',
    problemId: '71A',
    title: 'Way Too Long Words',
    difficulty: '800',
    rating: 800,
    category: 'Strings',
    tags: ['strings'],
    problemUrl: 'https://codeforces.com/problemset/problem/71/A',
    summary: 'Replace words with length strictly greater than 10 by an abbreviation: first character + count of omitted characters + last character.',
    approach:
      'For each word, inspect its length L. If L > 10, print s[0] followed by (L - 2) and s[L - 1]. Otherwise, print the original string unchanged.',
    dryRun:
      'Input "localization" (length 12). L > 10 -> first=\'l\', middle=(12-2)=10, last=\'n\'. Output: "l10n". Input "word" (length 4). L <= 10 -> Output: "word".',
    dryRunSteps: [
      {
        step: 1,
        description: 'Word "internationalization" has length 20 > 10.',
        variables: { word: 'internationalization', length: 20 },
        highlight: 'Abbreviation triggered: i + (20-2) + n = i18n.',
      },
    ],
    timeComplexity: 'O(N * L)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '15 ms',
    memory: '0 KB',
    sourceCode: `// Codeforces #71A - Way Too Long Words
#include <iostream>
#include <string>

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    
    int n;
    if (std::cin >> n) {
        while (n--) {
            std::string s;
            std::cin >> s;
            if (s.length() > 10) {
                std::cout << s.front() << (s.length() - 2) << s.back() << "\\n";
            } else {
                std::cout << s << "\\n";
            }
        }
    }
    return 0;
}`,
  },
  {
    slug: 'team',
    platform: 'codeforces',
    problemId: '231A',
    title: 'Team',
    difficulty: '800',
    rating: 800,
    category: 'Greedy & Brute Force',
    tags: ['brute force', 'greedy'],
    problemUrl: 'https://codeforces.com/problemset/problem/231/A',
    summary: 'Three friends decide whether to implement a problem if at least two of them are sure about the solution.',
    approach:
      'For each problem, sum the three opinions (each 0 or 1). If the sum is greater than or equal to 2, increment the solved counter.',
    dryRun:
      'Problem 1: 1 1 0 (sum=2 >= 2) -> solved. Problem 2: 1 1 1 (sum=3 >= 2) -> solved. Problem 3: 1 0 0 (sum=1 < 2) -> skip. Total solved = 2.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Read n=3 problems. Evaluate sum of opinions.',
        variables: { n: 3, totalSolved: 2 },
        highlight: 'Increment count whenever sum >= 2.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '30 ms',
    memory: '0 KB',
    sourceCode: `// Codeforces #231A - Team
#include <iostream>

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    
    int n;
    if (std::cin >> n) {
        int implemented = 0;
        for (int i = 0; i < n; ++i) {
            int a, b, c;
            std::cin >> a >> b >> c;
            if (a + b + c >= 2) {
                implemented++;
            }
        }
        std::cout << implemented << "\\n";
    }
    return 0;
}`,
  },
  {
    slug: 'next-round',
    platform: 'codeforces',
    problemId: '158A',
    title: 'Next Round',
    difficulty: '800',
    rating: 800,
    category: 'Implementation',
    tags: ['special problem', 'implementation'],
    problemUrl: 'https://codeforces.com/problemset/problem/158/A',
    summary: 'Contestants who score equal to or greater than the k-th place finisher\'s score advance to the next round, provided the score is positive.',
    approach:
      'Read scores into an array. Identify threshold = scores[k - 1]. Count participants whose score > 0 and score >= threshold.',
    dryRun:
      '8 participants, k=5: [10, 9, 8, 7, 7, 7, 5, 5]. Threshold = scores[4] = 7. Scores >= 7 and > 0 are indices 0 through 5 (6 participants). Output: 6.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Determine threshold score from index k-1.',
        variables: { k: 5, thresholdScore: 7 },
        highlight: 'All scores >= 7 advance if strictly positive.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    language: 'C++',
    status: 'Solved',
    runtime: '30 ms',
    memory: '0 KB',
    sourceCode: `// Codeforces #158A - Next Round
#include <iostream>
#include <vector>

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    
    int n, k;
    if (std::cin >> n >> k) {
        std::vector<int> a(n);
        for (int i = 0; i < n; ++i) {
            std::cin >> a[i];
        }
        
        int threshold = a[k - 1];
        int count = 0;
        for (int score : a) {
            if (score > 0 && score >= threshold) {
                count++;
            }
        }
        std::cout << count << "\\n";
    }
    return 0;
}`,
  },
  {
    slug: 'beautiful-matrix',
    platform: 'codeforces',
    problemId: '263A',
    title: 'Beautiful Matrix',
    difficulty: '800',
    rating: 800,
    category: 'Implementation',
    tags: ['implementation'],
    problemUrl: 'https://codeforces.com/problemset/problem/263/A',
    summary: 'Find the minimum number of moves to bring the single number 1 in a 5x5 matrix to the center at position (3, 3).',
    approach:
      'The number of moves is the Manhattan distance between the coordinate (r, c) of the cell containing 1 and the center (3, 3): |r - 3| + |c - 3|.',
    dryRun:
      'Matrix has 1 at row 2, column 5 (1-based). Manhattan distance = |2 - 3| + |5 - 3| = 1 + 2 = 3 moves. Output: 3.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Locate 1 at coordinates (r=2, c=5).',
        variables: { row: 2, col: 5 },
        highlight: 'Calculate |2 - 3| + |5 - 3| = 1 + 2 = 3.',
      },
    ],
    timeComplexity: 'O(1) (fixed 5x5 matrix)',
    spaceComplexity: 'O(1)',
    language: 'C++',
    status: 'Solved',
    runtime: '30 ms',
    memory: '0 KB',
    sourceCode: `// Codeforces #263A - Beautiful Matrix
#include <iostream>
#include <cmath>

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    
    int r = 0, c = 0;
    for (int i = 1; i <= 5; ++i) {
        for (int j = 1; j <= 5; ++j) {
            int val;
            std::cin >> val;
            if (val == 1) {
                r = i;
                c = j;
            }
        }
    }
    std::cout << (std::abs(r - 3) + std::abs(c - 3)) << "\\n";
    return 0;
}`,
  },
];

export const curatedDsaProblems = rawCuratedDsaProblems.map((p) => ({
  ...p,
  provenance: 'curated_example',
}));

export default curatedDsaProblems;
