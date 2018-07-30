
#include "LeetCode349.h"

#include <set>

LeetCode349::LeetCode349()
{
}


LeetCode349::~LeetCode349()
{
}

vector<int> LeetCode349::intersection(vector<int>& nums1, vector<int>& nums2)
{
	set<int> s;
	for (auto i : nums1) {
		s.insert(i);
	}

	set<int> res;
	for (int i = 0; i < nums2.size();i++) {
		if (s.count(nums2[i])) {
			res.insert(nums2[i]);
		}
	}

	return vector<int>(res.begin(),res.end());
}
