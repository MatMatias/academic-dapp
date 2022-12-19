// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Modifiers {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "NotAuthorized: not owner of the contract"
        );
        _;
    }

    modifier onlyValidStudentId(uint256 studentId) {
        require(
            studentId > 0,
            "InvalidStudentId: student id must be bigger than 0"
        );
        _;
    }

    modifier onlyExistentStudentId(uint256 studentId, uint256 lastStudentId) {
        require(
            studentId <= lastStudentId,
            "InvalidStudentId: there are no students created with that student id"
        );
        _;
    }
}
