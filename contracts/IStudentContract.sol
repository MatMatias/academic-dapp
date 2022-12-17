// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Types.sol";

interface IStudentContract {
    function getStudentById(uint256 studentId)
        external
        view
        returns (Student memory);
}
