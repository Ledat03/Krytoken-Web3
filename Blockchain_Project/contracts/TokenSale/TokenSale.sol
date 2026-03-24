// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../Token/KYS.sol";

interface IKYS is IERC20 {
    function isBanned(address adr) external view returns (bool);
}

contract TokenSale is ReentrancyGuard {
    event sellHistory(uint256 amount, address adr, uint256 nativeAmount);
    event buyHistory(uint256 amount, address adr, uint256 nativeAmount);

    uint256 public investorMinCap = 0.002 ether;
    uint256 public exRate = 10000;
    IKYS public token;

    constructor(address _tokenAddress) {
        token = IKYS(_tokenAddress);
    }

    function buy() public payable nonReentrant {
        require(!token.isBanned(msg.sender), "This address has been banned !");
        require(msg.value > investorMinCap, "TokenSale: not reached min cap");
        uint256 amountToken = msg.value * exRate;
        require(token.balanceOf(address(this)) >= amountToken, "Insufficient Token");
        token.transfer(msg.sender, amountToken);
        emit buyHistory(amountToken, msg.sender, msg.value);
    }

    function sell(uint256 amount) public nonReentrant {
        require(amount > 0, "Invalid token amount");
        require(!token.isBanned(msg.sender), "This address has been banned !");

        uint256 ethAmount = amount / exRate;
        require(address(this).balance >= ethAmount, "Insufficient ETH for transaction");

        uint256 allowAmount = token.allowance(msg.sender, address(this));
        require(allowAmount >= amount, "You need increase allowance amount");

        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transferFrom failed");

        (bool sent,) = payable(msg.sender).call{value: ethAmount}("");
        require(sent, "The transaction is failed ! ");

        emit sellHistory(amount, msg.sender, ethAmount);
    }

    function checkNativeBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function checkTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    receive() external payable {}
}
