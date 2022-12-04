// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

struct Student {
    uint256 id;
    string name;
}

struct Subject {
    uint256 id;
    string name;
    address professor;
}

enum Stage {
    STUDENT_REGISTRATION,
    GRADES_LAUNCH
}
