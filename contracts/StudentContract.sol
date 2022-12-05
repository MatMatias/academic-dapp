// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";

contract StudentContract is Modifiers {
    address _academicContractAddress;
    uint256 lastStudentId;

    mapping(uint256 => Student) private studentById;

    constructor(address academicContractAddress) {
        _academicContractAddress = academicContractAddress;
        lastStudentId = 0;
    }

    event StudentInserted(Student student, string message);

    function insertStudent(string calldata name) public onlyOwner {
        lastStudentId++;
        Student memory student = Student(lastStudentId, name);
        studentById[lastStudentId] = student;

        emit StudentInserted(student, "success");
    }

    function getStudentById(uint256 studentId)
        external
        view
        returns (Student memory)
    {
        require(
            studentId > 0,
            "InvalidStudentId: student id must be bigger than 0"
        );
        require(studentId <= lastStudentId, "StudentNotFound");
        return studentById[studentId];
    }
}
