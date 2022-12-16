// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Types.sol";

interface ISubjectContract {
    function getSubjectById(uint256 subjectId)
        external
        view
        returns (Subject memory);
}
