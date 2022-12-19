// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ACToken is ERC20 {
    constructor() ERC20("Academic Credit Token", "ACT") {}

    function mintStudentCredits(address studentAddress)
        external
        returns (bool)
    {
        _mint(studentAddress, 1000);
        return true;
    }

    function burnStudentCredits(address studentAddress, uint256 amount)
        external
        returns (bool)
    {
        _burn(studentAddress, amount);
        return true;
    }
}
