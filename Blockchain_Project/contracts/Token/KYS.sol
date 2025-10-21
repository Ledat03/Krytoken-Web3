    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KYS is ERC20, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event addedOnBlacklist(address BannedAddress);
    event removedBlacklist(address UnbannedAddress);

    mapping(address => bool) blackList;

    constructor() ERC20("Kysvk", "KYS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function transfer(address to, uint256 value) public override whenNotPaused returns (bool) {
        require(blackList[msg.sender] != true, "This address is on Blacklist");
        require(blackList[to] != true, "This address is on Blacklist");
        super.transfer(to, value);
        return true;
    }

    function addToBlackList(address prohibit) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(prohibit != msg.sender, "you can't add admin to the blacklist !");
        require(blackList[prohibit] != true, "This address is already on the blacklist !");
        blackList[prohibit] = true;
        emit addedOnBlacklist(prohibit);
    }

    function removeToBlackList(address prohibit) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(blackList[prohibit] != false, "This address isn't on the blacklist !");
        blackList[prohibit] = false;
        emit removedBlacklist(prohibit);
    }
}
