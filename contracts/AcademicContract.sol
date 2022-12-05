// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";

contract AcademicContract is Modifiers {
    address owner;
    address _studentContractAddress;
    address _subjectContractAddress;
    Stage public stage;

    constructor() {
        stage = Stage.STUDENT_REGISTRATION;
        owner = msg.sender;
    }

    event SpecificStageSet(Stage stage, string message);

    function setGradeLaunchStage() public onlyOwner(owner) {
        stage = Stage.GRADE_LAUNCH;
        emit SpecificStageSet(
            Stage.GRADE_LAUNCH,
            "grade registration stage set"
        );
    }

    function setStudentRegistrationStage() public onlyOwner(owner) {
        stage = Stage.STUDENT_REGISTRATION;
        emit SpecificStageSet(
            Stage.STUDENT_REGISTRATION,
            "student registration stage set"
        );
    }

    event ContractAddressSet(address childContractAddress, string message);

    function setStudentContractAddress(address studentContractAdddress)
        public
        onlyOwner(owner)
    {
        _studentContractAddress = studentContractAdddress;
        emit ContractAddressSet(
            studentContractAdddress,
            "child contract address set"
        );
    }

    function setSubjectContractAddress(address subjectContractAdddress)
        public
        onlyOwner(owner)
    {
        _subjectContractAddress = subjectContractAdddress;
        emit ContractAddressSet(
            subjectContractAdddress,
            "child contract address set"
        );
    }
}
