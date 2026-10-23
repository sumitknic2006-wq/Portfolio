export const dsaProblems = [
  {
    id: 'two-sum-sorted',
    title: 'Two Sum II — Input Array Is Sorted',
    difficulty: 'Medium',
    category: 'Two Pointers',
    platform: 'LeetCode',
    summary: 'Find two numbers that add up to a specific target number in a 1-indexed sorted array.',
    approach:
      'Initialize left pointer at the beginning and right pointer at the end. Compute the sum: if the sum equals target, return the 1-based indices; if less, advance the left pointer to increase sum; if greater, decrement right pointer.',
    dryRun:
      'Array: [2, 7, 11, 15], Target: 9. Step 1: left=0 (2), right=3 (15), sum=17 > 9 -> right=2. Step 2: left=0 (2), right=2 (11), sum=13 > 9 -> right=1. Step 3: left=0 (2), right=1 (7), sum=9 == target -> Return indices [1, 2].',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    cppCode: `// C++ Optimal Solution using Two Pointers
#include <vector>

std::vector<int> twoSum(std::vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;
    
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
    difficulty: 'Medium',
    category: 'Sliding Window',
    platform: 'LeetCode',
    summary: 'Given a string s, find the length of the longest substring without duplicate characters.',
    approach:
      'Maintain a dynamic sliding window [left, right] alongside a hash map or 256-element array storing the latest index of each encountered character. If character is already in window, jump left pointer to lastIndex + 1.',
    dryRun:
      'String: "abcabcbb". Window expands: "a" (len 1), "ab" (len 2), "abc" (len 3). At next "a", duplicate detected at index 0 -> left moves to 1 ("bca", maxLen=3). Final max window length is 3.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M)) where M is alphabet size',
    cppCode: `// C++ Optimal Sliding Window with Hash Array
#include <string>
#include <vector>
#include <algorithm>

int lengthOfLongestSubstring(std::string s) {
    std::vector<int> lastIndex(256, -1);
    int maxLength = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); ++right) {
        if (lastIndex[s[right]] >= left) {
            left = lastIndex[s[right]] + 1;
        }
        lastIndex[s[right]] = right;
        maxLength = std::max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    platform: 'LeetCode',
    summary: 'Compute how much water an elevation map can trap after raining.',
    approach:
      'Use two pointers (left and right) with maxLeft and maxRight trackers. At each iteration, advance the pointer corresponding to the smaller maximum height, accumulating water as maxBoundary - currentHeight.',
    dryRun:
      'Heights: [0,1,0,2,1,0,1,3,2,1,2,1]. Pointers converge from outside in. Since height[left] < height[right], water trapped at each cell depends solely on maxLeft, ensuring constant space accumulation.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    cppCode: `// C++ Two-Pointer Constant Space Solution
#include <vector>
#include <algorithm>

int trap(std::vector<int>& height) {
    if (height.empty()) return 0;
    int left = 0, right = height.size() - 1;
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
    difficulty: 'Medium',
    category: 'Recursion & Backtracking',
    platform: 'LeetCode',
    summary: 'Given an integer array of unique elements, return all possible subsets (the power set).',
    approach:
      'Recursively explore choices: at index i, push the current subset to result, then iterate through remaining elements, pushing an element, recurring deeper, and popping it off (backtracking step).',
    dryRun:
      'Nums: [1, 2]. Call backtracking(0, []): adds []. Choice 1: push 1 -> [1], call backtrack(1) -> adds [1]. Choice 2 inside: push 2 -> [1,2], adds [1,2]. Backtrack pop 2, pop 1. Next choice 2: push 2 -> adds [2]. Result: [[], [1], [1,2], [2]].',
    timeComplexity: 'O(2^N)',
    spaceComplexity: 'O(N) recursion stack',
    cppCode: `// C++ Backtracking Solution
#include <vector>

void backtrack(int start, std::vector<int>& nums, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    for (int i = start; i < nums.size(); ++i) {
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
];
