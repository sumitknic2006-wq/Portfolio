export const dsaProblems = [
  {
    id: 'two-sum-sorted',
    title: 'Two Sum II — Input Array Is Sorted',
    problemNumber: 'LeetCode #167',
    difficulty: 'Medium',
    category: 'Two Pointers',
    platform: 'LeetCode',
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
        highlight: 'currentSum (17) > target (9): Sum is too large for sorted array. Decrement right pointer to 2.',
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
        highlight: 'currentSum (9) == target (9): Target match! Return 1-based indices: [left + 1, right + 1] -> [1, 2].',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    cppCode: `// C++ Optimal Solution using Two Pointers (LeetCode #167)
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
    id: 'longest-substring-without-repeats',
    title: 'Longest Substring Without Repeating Characters',
    problemNumber: 'LeetCode #3',
    difficulty: 'Medium',
    category: 'Sliding Window',
    platform: 'LeetCode',
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
    cppCode: `// C++ Optimal Sliding Window with Hash Array (LeetCode #3)
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
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    problemNumber: 'LeetCode #42',
    difficulty: 'Hard',
    category: 'Two Pointers',
    platform: 'LeetCode',
    problemUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    summary: 'Compute how much water an elevation map can trap after raining.',
    approach:
      'Use two pointers (left and right) with maxLeft and maxRight trackers. At each iteration, advance pointer corresponding to the smaller maximum height, accumulating water as maxBoundary - currentHeight in O(1) auxiliary space.',
    dryRun:
      'Heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]. Pointers converge from outside in. Since height[left] <= height[right], water trapped depends solely on maxLeft, enabling constant space accumulation.',
    dryRunSteps: [
      {
        step: 1,
        description: 'left=0 (h=0), right=11 (h=1). maxLeft=0, maxRight=0.',
        variables: { left: 0, right: 11, 'height[left]': 0, 'height[right]': 1, trappedWater: 0 },
        highlight: 'height[left] <= height[right]. Update maxLeft = max(0, 0) = 0. Advance left to 1.',
      },
      {
        step: 2,
        description: 'left=1 (h=1), right=11 (h=1). maxLeft=1, maxRight=0.',
        variables: { left: 1, right: 11, 'height[left]': 1, 'height[right]': 1, trappedWater: 0 },
        highlight: 'Update maxLeft = 1. Advance left to 2.',
      },
      {
        step: 3,
        description: 'left=2 (h=0), right=11 (h=1). maxLeft=1, maxRight=0.',
        variables: { left: 2, right: 11, 'height[left]': 0, 'height[right]': 1, trappedWater: 1 },
        highlight: 'height[left] (0) < maxLeft (1)! Trap water = 1 - 0 = 1 unit. Advance left to 3.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    cppCode: `// C++ Two-Pointer Constant Space Solution (LeetCode #42)
#include <vector>
#include <algorithm>

int trap(std::vector<int>& height) {
    if (height.empty()) return 0;
    int left = 0, right = static_cast<int>(height.size()) - 1;
    int maxLeft = 0, maxRight = 0;
    int trappedWater = 0;
    
    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                trappedWater += maxLeft - height[left];
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                trappedWater += maxRight - height[right];
            }
            right--;
        }
    }
    return trappedWater;
}`,
  },
  {
    id: 'subsets-backtracking',
    title: 'Subsets (Power Set)',
    problemNumber: 'LeetCode #78',
    difficulty: 'Medium',
    category: 'Recursion & Backtracking',
    platform: 'LeetCode',
    problemUrl: 'https://leetcode.com/problems/subsets/',
    summary: 'Given an integer array of unique elements, return all possible subsets (the power set).',
    approach:
      'Recursively explore choices: at each recursion level, add the current subset to result, then iterate through remaining elements, pushing an element, recurring deeper, and popping it off (backtracking step).',
    dryRun:
      'Nums: [1, 2]. Call backtrack(0, []): adds []. Choice 1: push 1 -> [1], call backtrack(1) -> adds [1]. Choice 2 inside: push 2 -> [1,2], adds [1,2]. Backtrack pop 2, pop 1. Next choice 2: push 2 -> adds [2]. Result: [[], [1], [1,2], [2]].',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize backtrack with start=0, current=[]. Add [] to result set.',
        variables: { start: 0, current: '[]', resultCount: 1 },
        highlight: 'Result has [[]].',
      },
      {
        step: 2,
        description: 'Choose element at index 0 (nums[0]=1). Push 1 -> current=[1]. Recurse with start=1.',
        variables: { start: 1, current: '[1]', resultCount: 2 },
        highlight: 'Add [1] to result set. Results: [[], [1]].',
      },
      {
        step: 3,
        description: 'Choose element at index 1 (nums[1]=2). Push 2 -> current=[1, 2]. Recurse with start=2.',
        variables: { start: 2, current: '[1, 2]', resultCount: 3 },
        highlight: 'Add [1, 2] to result set. Start reaches end (2 == size). Return to previous frame.',
      },
      {
        step: 4,
        description: 'Backtrack: pop 2, then pop 1. Now choose element at index 1 directly -> current=[2]. Recurse start=2.',
        variables: { start: 2, current: '[2]', resultCount: 4 },
        highlight: 'Add [2] to result set. All recursive calls complete. Final Power Set: [[], [1], [1, 2], [2]].',
      },
    ],
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) recursion stack',
    cppCode: `// C++ Backtracking Solution (LeetCode #78)
#include <vector>

void backtrack(int start, std::vector<int>& nums, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    for (int i = start; i < static_cast<int>(nums.size()); ++i) {
        current.push_back(nums[i]);
        backtrack(i + 1, nums, current, result);
        current.pop_back(); // Backtracking step
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
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    problemNumber: 'LeetCode #125',
    difficulty: 'Easy',
    category: 'Strings',
    platform: 'LeetCode',
    problemUrl: 'https://leetcode.com/problems/valid-palindrome/',
    summary: 'Determine if a string is a palindrome, considering only alphanumeric characters and ignoring cases.',
    approach:
      'Initialize two pointers at opposite ends of the string. Advance left past non-alphanumeric characters, decrement right past non-alphanumeric characters, and verify lowercase equivalence at each valid pair.',
    dryRun:
      'String: "A man, a plan, a canal: Panama". Left at \'A\', right at \'a\' -> match. Left advances to \'m\', right to \'m\' -> match. Continues inward until pointers cross -> return true.',
    dryRunSteps: [
      {
        step: 1,
        description: 'left=0 (\'A\'), right=29 (\'a\'). Both are alphanumeric. tolower(\'A\') == tolower(\'a\') (\'a\' == \'a\').',
        variables: { left: 0, right: 29, 's[left]': 'A', 's[right]': 'a', match: true },
        highlight: 'Match found! Increment left to 1, decrement right to 28.',
      },
      {
        step: 2,
        description: 'left=1 (\' \'). Skip whitespace -> left moves to 2 (\'m\'). right=28 (\'m\'). Both match (\'m\' == \'m\').',
        variables: { left: 2, right: 28, 's[left]': 'm', 's[right]': 'm', match: true },
        highlight: 'Non-alphanumeric skipped, characters match! Continue inward.',
      },
      {
        step: 3,
        description: 'Pointers continue scanning inward. All alphanumeric character pairs match symmetrically.',
        variables: { left: 15, right: 15, 's[left]': 'c', 's[right]': 'c', match: true },
        highlight: 'Pointers meet at center character. String is confirmed to be a valid palindrome.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    cppCode: `// C++ Optimal Two-Pointer In-Place Palindrome (LeetCode #125)
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
    id: 'group-anagrams',
    title: 'Group Anagrams',
    problemNumber: 'LeetCode #49',
    difficulty: 'Medium',
    category: 'Hashing',
    platform: 'LeetCode',
    problemUrl: 'https://leetcode.com/problems/group-anagrams/',
    summary: 'Given an array of strings, group the anagrams together in any order.',
    approach:
      'Use an unordered_map with key as the sorted string (canonical anagram representation) and value as vector of strings belonging to that anagram group. Iterate through all words, insert into map, and collect grouped vectors.',
    dryRun:
      'Input: ["eat","tea","tan","ate","nat","bat"]. "eat" sorted is "aet" -> map["aet"] = ["eat"]. "tea" sorted is "aet" -> map["aet"] = ["eat","tea"]. "tan" sorted is "ant" -> map["ant"] = ["tan"]. "ate" sorted is "aet" -> map["aet"] = ["eat","tea","ate"]. Final groups: [["bat"],["nat","tan"],["ate","eat","tea"]].',
    dryRunSteps: [
      {
        step: 1,
        description: 'Process "eat": canonical sorted key is "aet". Map: {"aet": ["eat"]}.',
        variables: { word: 'eat', sortedKey: 'aet', mapGroups: 1 },
        highlight: 'New anagram cluster created for key "aet".',
      },
      {
        step: 2,
        description: 'Process "tea": canonical sorted key is "aet". Append to existing group: {"aet": ["eat", "tea"]}.',
        variables: { word: 'tea', sortedKey: 'aet', mapGroups: 1 },
        highlight: 'Added to existing "aet" group.',
      },
      {
        step: 3,
        description: 'Process "tan": canonical sorted key is "ant". Map: {"aet": ["eat", "tea"], "ant": ["tan"]}.',
        variables: { word: 'tan', sortedKey: 'ant', mapGroups: 2 },
        highlight: 'Second anagram cluster created for key "ant".',
      },
      {
        step: 4,
        description: 'Process "bat": canonical sorted key is "abt". Map now contains 3 unique anagram clusters.',
        variables: { word: 'bat', sortedKey: 'abt', mapGroups: 3 },
        highlight: 'All words mapped to their respective anagram clusters.',
      },
    ],
    timeComplexity: 'O(N * K log K) where K is max string length',
    spaceComplexity: 'O(N * K)',
    cppCode: `// C++ Hash Map Canonical Sorting Solution (LeetCode #49)
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
    std::unordered_map<std::string, std::vector<std::string>> anagramMap;
    
    for (const std::string& str : strs) {
        std::string key = str;
        std::sort(key.begin(), key.end());
        anagramMap[key].push_back(str);
    }
    
    std::vector<std::vector<std::string>> result;
    result.reserve(anagramMap.size());
    for (auto& pair : anagramMap) {
        result.push_back(std::move(pair.second));
    }
    return result;
}`,
  },
  {
    id: 'maximum-subarray-kadane',
    title: "Maximum Subarray (Kadane's Algorithm)",
    problemNumber: 'LeetCode #53',
    difficulty: 'Medium',
    category: 'Arrays',
    platform: 'LeetCode',
    problemUrl: 'https://leetcode.com/problems/maximum-subarray/',
    summary: 'Find the contiguous subarray with the largest sum and return its sum.',
    approach:
      "Kadane's Dynamic Programming Algorithm: iterate through the array maintaining currentSubarraySum = max(num, currentSubarraySum + num). Update maxGlobalSum = max(maxGlobalSum, currentSubarraySum).",
    dryRun:
      'Nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4]. i=0: cur=-2, max=-2. i=1: cur=max(1, -1)=1, max=1. i=2: cur=max(-3, -2)=-2, max=1. i=3: cur=max(4, 2)=4, max=4. i=4: cur=3, max=4. i=5: cur=5, max=5. i=6: cur=6, max=6. Subarray [4, -1, 2, 1] has largest sum 6.',
    dryRunSteps: [
      {
        step: 1,
        description: 'Initialize with first element: nums[0] = -2. currentSum = -2, maxSum = -2.',
        variables: { i: 0, 'nums[i]': -2, currentSum: -2, maxSum: -2 },
        highlight: 'Base state established.',
      },
      {
        step: 2,
        description: 'i=1 (nums[1]=1): currentSum = max(1, -2 + 1) = 1. maxSum = max(-2, 1) = 1.',
        variables: { i: 1, 'nums[i]': 1, currentSum: 1, maxSum: 1 },
        highlight: 'Start fresh subarray at index 1 because extending the negative prefix (-2) would hurt.',
      },
      {
        step: 3,
        description: 'i=3 (nums[3]=4): currentSum resets to 4. maxSum updates to 4.',
        variables: { i: 3, 'nums[i]': 4, currentSum: 4, maxSum: 4 },
        highlight: 'New positive subarray begins at index 3.',
      },
      {
        step: 4,
        description: 'After indices 4, 5, 6: adding -1, 2, 1 brings currentSum to 6. maxSum reaches peak 6.',
        variables: { i: 6, 'nums[i]': 1, currentSum: 6, maxSum: 6 },
        highlight: 'Contiguous subarray [4, -1, 2, 1] yields maximum possible sum = 6.',
      },
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    cppCode: `// C++ Kadane's Algorithm for Maximum Subarray (LeetCode #53)
#include <vector>
#include <algorithm>

int maxSubArray(std::vector<int>& nums) {
    if (nums.empty()) return 0;
    int currentSum = nums[0];
    int maxSum = nums[0];
    
    for (size_t i = 1; i < nums.size(); ++i) {
        currentSum = std::max(nums[i], currentSum + nums[i]);
        maxSum = std::max(maxSum, currentSum);
    }
    return maxSum;
}`,
  },
];
