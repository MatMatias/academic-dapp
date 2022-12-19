// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";
import "./IStudentContract.sol";

contract StudentContract is Modifiers, IStudentContract {
    address _academicContractAddress;
    uint256 lastStudentId;

    mapping(uint256 => Student) private studentById;

    constructor(address academicContractAddress) {
        _academicContractAddress = academicContractAddress;
        lastStudentId = 0;
    }

    event StudentInserted(Student student, string message);

    function insertStudent(string calldata name, address studentAddress)
        public
        onlyOwner
    {
        lastStudentId++;
        Student memory student = Student(lastStudentId, name, studentAddress);
        studentById[lastStudentId] = student;

        emit StudentInserted(student, "success");
    }

    function getLastStudentId() public view returns (uint256) {
        return lastStudentId;
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
