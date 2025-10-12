// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Marketplace is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private TokenList;
    IERC721 public immutable NFTContract;
    uint256 private numberIncrease = 0;
    uint256 public feeByDecimal;
    uint256 public feeRate;
    address public feeRecipient;

    event OrderAdded(
        uint256 indexed orderId, address indexed buyer, uint256 price, address tokenTransfer, uint256 indexed tokenId
    );

    event OrderCancel(uint256 indexed orderId);

    event OrderMatched(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 price,
        address tokenTransfer,
        uint256 tokenId,
        address indexed seller
    );

    event FeeUpdated(uint256 feeByDecimal, uint256 feeRate);

    struct Order {
        address sender;
        address buyer;
        uint256 price;
        address tokenTransfer;
        uint256 tokenId;
    }

    mapping(uint256 => Order) orders;

    constructor(uint256 _feeByDecimal, uint256 _feeRate, address _feeRecipient, address nftContract)
        Ownable(msg.sender)
    {
        require(nftContract != address(0), "Can't deploy contract address 0 !!!!!");
        require(_feeRecipient != address(0), "feeRecipient is address 0 !");
        NFTContract = IERC721(nftContract);
        _updateFeeRate(_feeByDecimal, _feeRate);
        updateFeeRecipient(_feeRecipient);
    }

    function updateFeeRecipient(address fee) internal {
        require(fee != address(0), "feeRecipient is address 0 !");
        feeRecipient = fee;
    }

    function _updateFeeRecipient(address fee) external onlyOwner {
        updateFeeRecipient(fee);
    }

    function _updateFeeRate(uint256 _feeByDecimal, uint256 _feeRate) internal {
        require(_feeRate < 10 ** (_feeByDecimal + 2), "Bad fee");
        feeByDecimal = _feeByDecimal;
        feeRate = _feeRate;
        emit FeeUpdated(_feeByDecimal, _feeRate);
    }

    function updateFeeRate(uint256 _feeByDecimal, uint256 _feeRate) external onlyOwner {
        _updateFeeRate(_feeByDecimal, _feeRate);
    }

    function calculatorFee(uint256 orderId) private view returns (uint256 fee) {
        Order storage tempOrder = orders[orderId];
        if (feeRate == 0) {
            return 0;
        }
        return (feeRate * tempOrder.price) / 10 ** (feeByDecimal + 2);
    }

    function isSeller(uint256 orderId, address seller) public view returns (bool) {
        if (orders[orderId].sender == seller) {
            return true;
        }
        return false;
    }

    function addNewToken(address newToken) external onlyOwner {
        require(newToken != address(0), "This token is Address 0");
        require(TokenList.add(newToken), "This token has been supported already");
    }

    modifier OnlyUseThisToken(address token) {
        require(isTokenSupported(token), "this token isn't supported !");
        _;
    }

    function isTokenSupported(address token) public view returns (bool) {
        return TokenList.contains(token);
    }

    function addOrder(uint256 tokenId, uint256 price, address token) public OnlyUseThisToken(token) {
        require(NFTContract.ownerOf(tokenId) == msg.sender, "You don't have any permission to sell this NFT !");
        require(
            NFTContract.getApproved(tokenId) == address(this)
                || NFTContract.isApprovedForAll(msg.sender, address(this)) == true,
            "Market doesn't has any permission from you to manage this NFT"
        );
        require(price > 0, "Price must be greater than 0");
        numberIncrease++;
        orders[numberIncrease] = Order(msg.sender, address(0), price, token, tokenId);
        NFTContract.transferFrom(orders[numberIncrease].sender, address(this), tokenId);
        emit OrderAdded(
            numberIncrease,
            orders[numberIncrease].buyer,
            orders[numberIncrease].price,
            orders[numberIncrease].tokenTransfer,
            tokenId
        );
    }

    function cancelOrder(uint256 orderId) external {
        Order storage tempOrder = orders[orderId];
        require(tempOrder.buyer == address(0), "This NFT has been sold !");
        require(tempOrder.sender == msg.sender, "You don't have any permission to cancel");
        NFTContract.transferFrom(address(this), msg.sender, tempOrder.tokenId);
        delete orders[orderId];
        emit OrderCancel(orderId);
    }

    function executeOrder(uint256 orderId) external {
        require(isSeller(orderId, msg.sender) != true, "You can't buy your NFT");
        require(orders[orderId].price > 0, "This NFT isn't available now");
        require(orders[orderId].buyer == address(0), "This NFT has been sold !");
        orders[orderId].buyer = msg.sender;
        uint256 fee = calculatorFee(orderId);
        IERC20(orders[orderId].tokenTransfer).transferFrom(msg.sender, feeRecipient, fee);
        IERC20(orders[orderId].tokenTransfer).transferFrom(
            msg.sender, orders[orderId].sender, orders[orderId].price - fee
        );
        NFTContract.transferFrom(address(this), msg.sender, orders[orderId].tokenId);
        emit OrderMatched(
            orderId,
            msg.sender,
            orders[orderId].price,
            orders[orderId].tokenTransfer,
            orders[orderId].tokenId,
            orders[orderId].sender
        );
    }
}
