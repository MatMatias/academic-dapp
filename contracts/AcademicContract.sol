// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";
import "./ISubjectContract.sol";
import "./IStudentContract.sol";

contract AcademicContract is Modifiers {
    address _studentContractAddress;
    address _subjectContractAddress;
    Stage public stage;

    mapping(uint256 => mapping(uint256 => uint16)) studentIdToSubjectIdToGrade;

    constructor() {
        stage = Stage.STUDENT_REGISTRATION;
    }

    event SpecificStageSet(Stage stage, string message);

    function setGradeLaunchStage() public onlyOwner {
        stage = Stage.GRADE_LAUNCH;
        emit SpecificStageSet(
            Stage.GRADE_LAUNCH,
            "grade registration stage set"
        );
    }

    function setStudentRegistrationStage() public onlyOwner {
        stage = Stage.STUDENT_REGISTRATION;
        emit SpecificStageSet(
            Stage.STUDENT_REGISTRATION,
            "student registration stage set"
        );
    }

    event ContractAddressSet(address childContractAddress, string message);

    function setStudentContractAddress(address studentContractAdddress)
        public
        onlyOwner
    {
        _studentContractAddress = studentContractAdddress;
        emit ContractAddressSet(
            studentContractAdddress,
            "child contract address set"
        );
    }

    function setSubjectContractAddress(address subjectContractAdddress)
        public
        onlyOwner
    {
        _subjectContractAddress = subjectContractAdddress;
        emit ContractAddressSet(
            subjectContractAdddress,
            "child contract address set"
        );
    }

    event GradeInserted(
        uint256 studentId,
        uint256 subjectId,
        uint16 grade,
        string message
    );

    function insertGrade(
        uint256 studentId,
        uint256 subjectId,
        uint16 grade
    ) public {
        // check if msg.sender is the professor of the subject with that subject id
        require(
            stage == Stage.GRADE_LAUNCH,
            "InvalidStage: not on grade launch stage"
        );
        require(
            ISubjectContract(_subjectContractAddress)
                .getSubjectById(subjectId)
                .professorAddress == msg.sender,
            "NotAuthorized: only professor from the specific subject can insert grades"
        );
        // require that grades has excatly 4 digits
        require(
            grade <= 1000,
            "InvalidGradeDigits: grade must be smaller than 1000. The last two digits are the decimal part"
        );

        uint256[] memory studentsIdsOnSubject = ISubjectContract(
            _subjectContractAddress
        ).getStudentsIdsBySubjectId(subjectId);
        bool isStudentOnSubject = false;
        for (uint256 i = 0; i < studentsIdsOnSubject.length; ++i) {
            if (studentsIdsOnSubject[i] == studentId) {
                isStudentOnSubject = true;
                break;
            }
        }
        require(
            isStudentOnSubject == true,
            "StudentNotOnSubject: student must be registered on that subject"
        );
        studentIdToSubjectIdToGrade[studentId][subjectId] = grade;

        emit GradeInserted(studentId, subjectId, grade, "GradeInserted");
    }

    function listGradesBySubjectId(uint256 subjectId)
        public
        view
        returns (Student[] memory, uint16[] memory)
    {
        uint256[] memory studentsIds = ISubjectContract(_subjectContractAddress)
            .getStudentsIdsBySubjectId(subjectId);

        Student[] memory students = new Student[](studentsIds.length);
        uint16[] memory grades = new uint16[](studentsIds.length);

        for (uint256 i = 0; i < studentsIds.length; ++i) {
            uint256 studentId = studentsIds[i];
            students[i] = IStudentContract(_studentContractAddress)
                .getStudentById(studentId);
            grades[i] = studentIdToSubjectIdToGrade[studentId][subjectId];
        }

        return (students, grades);
    }
}
