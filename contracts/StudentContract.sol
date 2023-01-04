// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";
import "./IStudentContract.sol";
import "./ACToken.sol";

contract StudentContract is Modifiers, IStudentContract {
    address _academicContractAddress;
    address _ACTokenAddress;
    uint256 public lastStudentId;

    mapping(uint256 => Student) private studentById;

    constructor(address academicContractAddress, address ACTokenAddress) {
        _academicContractAddress = academicContractAddress;
        _ACTokenAddress = ACTokenAddress;
        lastStudentId = 0;
    }

    event StudentInserted(
        Student student,
        address studentAddress,
        uint256 studentBalance,
        string message
    );

    function insertStudent(string calldata name, address studentAddress)
        public
        onlyOwner
    {
        lastStudentId++;
        Student memory student = Student(lastStudentId, name, studentAddress);
        studentById[lastStudentId] = student;
        ACToken(_ACTokenAddress).mintStudentCredits(studentAddress);
        emit StudentInserted(
            student,
            studentAddress,
            ACToken(_ACTokenAddress).balanceOf(studentAddress),
            "success"
        );
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
