// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RItem is ERC721, Ownable, ERC721URIStorage {
    uint256 private _tokenId = 0;
    string private baseURI;

    constructor() ERC721("Cookies Exclusive", "CE") Ownable(msg.sender) {}

    function mintWithURI(address to, string memory _uri) public onlyOwner returns (uint256 id) {
        _tokenId++;
        uint256 tempId = _tokenId;
        _mint(to, tempId);
        _setTokenURI(tempId, _uri);
        return tempId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _updateBaseURI(string memory token) public onlyOwner {
        baseURI = token;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
      return super.supportsInterface(interfaceId);
  }
}
