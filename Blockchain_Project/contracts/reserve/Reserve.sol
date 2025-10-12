// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Reserve is Ownable {
    IERC20 private immutable token;
    uint256 private unlockTime;

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        unlockTime = block.timestamp + 24 weeks;
    }

    modifier checkTimestamp() {
        require(block.timestamp >= unlockTime, "Can not trade");
        _;
    }

    function withdrawTo(address withdrawAddress, uint256 value) public onlyOwner checkTimestamp {
        require(withdrawAddress != address(0), "Can't withdraw to address(0)");
        require(token.balanceOf(address(this)) >= value, "Exceed amount to withdraw");
        token.transfer(withdrawAddress, value);
    }
}
