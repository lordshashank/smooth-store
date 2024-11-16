// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("ETHBKK", "ETHBKK") {
        _mint(
            msg.sender,
            10000000000000000000000000000000000000000000000000000000
        );
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
