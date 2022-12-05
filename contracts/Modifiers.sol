// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Modifiers {
    modifier onlyOwner(address ownerAddress) {
        require(msg.sender == ownerAddress, "Not authorized");
        _;
    }
}
