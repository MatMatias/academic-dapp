// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";
import "./ISubjectContract.sol";
import "./IStudentContract.sol";
import "./ACToken.sol";

contract SubjectContract is Modifiers, ISubjectContract {
    address _academicContractAddress;
    address _studentContractAddress;
    address _ACTokenAddress;
    uint256 lastSubjectId;

    mapping(uint256 => Subject) private subjectById;
    mapping(uint256 => uint256[]) private studentsIdsBySubjectId;

    constructor(
        address academicContractAddress,
        address studentContractAddress,
        address ACTokenAddress
    ) {
        _academicContractAddress = academicContractAddress;
        _studentContractAddress = studentContractAddress;
        _ACTokenAddress = ACTokenAddress;
        lastSubjectId = 0;
    }

    modifier onlyValidSubjectId(uint256 subjectId) {
        require(
            subjectId > 0,
            "InvalidSubjectId: subject id must be bigger than 0"
        );
        _;
    }

    modifier onlyExistentSubjectId(uint256 subjectId) {
        require(
            subjectId <= lastSubjectId,
            "InvalidSubjectId: there are no subjects created with that subject id"
        );
        _;
    }

    event SubjectInserted(Subject subject, string message);

    function insertSubject(
        string calldata subjectName,
        address professorAddress,
        uint256 subjectPrice
    ) public onlyOwner {
        lastSubjectId++;
        Subject memory subject = Subject(
            lastSubjectId,
            subjectName,
            professorAddress,
            subjectPrice
        );
        subjectById[lastSubjectId] = subject;

        emit SubjectInserted(subject, "success");
    }

    function getSubjectById(uint256 subjectId)
        public
        view
        override
        onlyValidSubjectId(subjectId)
        onlyExistentSubjectId(subjectId)
        returns (Subject memory)
    {
        require(subjectId <= lastSubjectId, "SubjectNotFound");
        return subjectById[subjectId];
    }

    event StudentIdBySubjectSet(
        uint256 studentId,
        uint256 subjectId,
        address studentAddress,
        uint256 amount,
        uint256 studentNewBalance,
        string message
    );

    function setStudentBySubject(uint256 subjectId, uint256 studentId)
        external
        override
        onlyValidSubjectId(subjectId)
        onlyValidStudentId(studentId)
        onlyOwner
    {
        studentsIdsBySubjectId[subjectId].push(studentId);
        address studentAddress = IStudentContract(_studentContractAddress)
            .getStudentById(studentId)
            .studentAddress;
        uint256 subjectPrice = getSubjectById(subjectId).price;
        ACToken(_ACTokenAddress).burnStudentCredits(
            studentAddress,
            subjectPrice
        );
        emit StudentIdBySubjectSet(
            studentId,
            subjectId,
            studentAddress,
            subjectPrice,
            ACToken(_ACTokenAddress).balanceOf(studentAddress),
            "StudentIdBySubjectIdSet"
        );
    }

    function getStudentsIdsBySubjectId(uint256 subjectId)
        external
        view
        override
        onlyValidSubjectId(subjectId)
        onlyExistentSubjectId(subjectId)
        returns (uint256[] memory)
    {
        return studentsIdsBySubjectId[subjectId];
    }
}
