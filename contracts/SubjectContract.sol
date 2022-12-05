// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Modifiers.sol";
import "./Types.sol";

contract SubjectContract is Modifiers {
    address _academicContractAddress;

    constructor(address academicContractAddress) {
        _academicContractAddress = academicContractAddress;
    }
}
