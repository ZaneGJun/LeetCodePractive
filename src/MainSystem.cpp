#include "MainSystem.h"

#include <iostream>
using namespace std;

#include "LeetCode349.h"

MainSystem::MainSystem()
{
}


MainSystem::~MainSystem()
{
}

void MainSystem::init()
{
	vector<int> a, b;
	a.push_back(1);
	a.push_back(4);
	a.push_back(7);
	a.push_back(8);
	b.push_back(2);
	b.push_back(7);

	auto res = LeetCode349::intersection(a,b);
	for (auto i : res) {
		cout << i << " ";
	}

}
