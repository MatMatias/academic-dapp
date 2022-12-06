// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";

contract SubjectContract is Modifiers {
    address _academicContractAddress;
    uint256 lastSubjectId;

    mapping(uint256 => Subject) private subjectById;

    constructor(address academicContractAddress) {
        _academicContractAddress = academicContractAddress;
        lastSubjectId = 0;
    }

    event SubjectInserted(Subject subject, string message);

    function insertSubject(
        string calldata subjectName,
        address professorAddress
    ) public onlyOwner {
        lastSubjectId++;
        Subject memory subject = Subject(
            lastSubjectId,
            subjectName,
            professorAddress
        );
        subjectById[lastSubjectId] = subject;

        emit SubjectInserted(subject, "success");
    }

    function getSubjectById(uint256 subjectId)
        external
        view
        returns (Subject memory)
    {
        require(
            subjectId > 0,
            "InvalidSubjectId: subject id must be bigger than 0"
        );
        require(subjectId <= lastSubjectId, "SubjectNotFound");
        return subjectById[subjectId];
    }
}
