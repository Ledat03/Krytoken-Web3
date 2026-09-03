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
    uint256 public totalMinted;
    uint256 public totalBurned;
    mapping(address => bool) blackList;

    constructor() ERC20("Kryptos", "KYS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, 1000000000 * 10 ** decimals());
        totalMinted += 1000000000 * 10 ** decimals();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        if (from != address(0)) {
            require(blackList[from] != true, "This address is on blacklist");
        }

        if (to != address(0)) {
            require(blackList[to] != true, "This address is on blacklist");
        }
        super._update(from, to, value);
    }

    function addToBlackList(address prohibit) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!hasRole(DEFAULT_ADMIN_ROLE, prohibit), "You can't add admin to the blacklist !");
        require(blackList[prohibit] != true, "This address is already on the blacklist !");
        blackList[prohibit] = true;
        emit addedOnBlacklist(prohibit);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function removeFromBlackList(address prohibit) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(blackList[prohibit] != false, "This address isn't on the blacklist !");
        blackList[prohibit] = false;
        emit removedBlacklist(prohibit);
    }

    function isBanned(address adr) public view returns (bool) {
        return blackList[adr];
    }
    function burn(uint256 amount) public {
        require(amount > 0,"Amount must greater than 0 !");
        _burn(msg.sender, amount);
        totalBurned += amount;
    }
}
