# Smart Contract Integration Guide

## Tổng quan

Hệ thống đã được tích hợp để tương tác với các smart contracts ERC20 và các contract khác trong dự án Marketplace.

## Các thành phần đã tạo

### 1. ContractService (`src/service/ContractService.ts`)

- Service chính để tương tác với Web3 và smart contracts
- Hỗ trợ kết nối wallet, gọi contract functions
- Có các method: `connectWallet`, `getTokenBalance`, `transferToken`, `approveToken`

### 2. useContract Hook (`src/hooks/useContract.ts`)

- React hook để quản lý state và tương tác với contracts
- Tự động load token balances, theo dõi account changes
- Cung cấp: `isConnected`, `account`, `tokens`, `transferTokens`, `approveTokens`

### 3. TokenWallet Component (`src/component/TokenWallet.tsx`)

- Giao diện để hiển thị và tương tác với tokens
- Tính năng: xem balance, transfer tokens, approve tokens
- Tự động refresh khi có thay đổi

### 4. ContractInfo Component (`src/component/ContractInfo.tsx`)

- Hiển thị thông tin về các smart contracts
- Hướng dẫn setup và copy contract addresses

## Cách sử dụng

### Bước 1: Deploy Smart Contracts

1. Deploy các contracts lên testnet (Sepolia, Goerli, etc.)
2. Lấy contract addresses sau khi deploy

### Bước 2: Cập nhật Contract Addresses

Mở file `src/service/ContractService.ts` và cập nhật:

```typescript
export const CONTRACT_ADDRESSES = {
  KRTToken: "0x1234...",
  KYS: "0x5678...",
  Marketplace: "0x9abc...",
  TokenSale: "0xdef0...",
  Reserve: "0x1111...",
  RItem: "0x2222...",
};
```

### Bước 3: Kết nối Wallet

1. Mở ứng dụng và đi đến Dashboard
2. Click "Connect Wallet" để kết nối MetaMask
3. Chọn network phù hợp (testnet đã deploy contracts)

### Bước 4: Tương tác với Contracts

- **Xem Token Balances**: Tự động hiển thị sau khi connect wallet
- **Transfer Tokens**: Nhập địa chỉ token, địa chỉ nhận, số lượng
- **Approve Tokens**: Approve cho contract khác sử dụng tokens

## Các tính năng chính

### ✅ Đã hoàn thành:

- [x] Kết nối MetaMask wallet
- [x] Hiển thị token balances
- [x] Transfer ERC20 tokens
- [x] Approve tokens cho contracts khác
- [x] Tự động refresh khi account thay đổi
- [x] Error handling và loading states
- [x] Responsive UI với Tailwind CSS

### 🔄 Có thể mở rộng:

- [ ] Tương tác với Marketplace contract
- [ ] Mint/Burn tokens
- [ ] Stake/Unstake functionality
- [ ] Transaction history
- [ ] Multi-signature wallet support

## Troubleshooting

### Lỗi "MetaMask not found"

- Đảm bảo MetaMask extension đã được cài đặt
- Refresh trang và thử lại

### Lỗi "Contract not found"

- Kiểm tra contract address có đúng không
- Đảm bảo wallet đang connect đúng network

### Lỗi "Insufficient funds"

- Đảm bảo có đủ ETH để trả gas fees
- Kiểm tra token balance có đủ không

### Lỗi "User rejected transaction"

- User đã từ chối transaction trên MetaMask
- Thử lại và approve transaction

## Network Support

- Ethereum Mainnet
- Sepolia Testnet
- Goerli Testnet
- Polygon Mumbai
- BSC Testnet
- (Có thể thêm network khác trong MetaMask)

## Security Notes

- Luôn test trên testnet trước khi dùng mainnet
- Không share private keys
- Verify contract addresses trước khi sử dụng
- Sử dụng hardware wallet cho số tiền lớn
