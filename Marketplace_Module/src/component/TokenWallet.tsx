import React, { useEffect, useState } from "react";
import { useContract } from "../hooks/useContract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Send, RefreshCw, AlertCircle } from "lucide-react";
import { nftService } from "@/service/RItemService";
import { useNFTContract } from "@/hooks/useNFTContract";
const TokenWallet: React.FC = () => {
  const { isConnected, account, networkInfo, tokens, loading, error, connectWallet, transferTokens, approveTokens, clearError } = useContract();
  const { name, symbol, owner, balance, fetchInfoContract } = useNFTContract();
  const [transferData, setTransferData] = useState({
    tokenAddress: "",
    to: "",
    amount: "",
  });
  const [approveData, setApproveData] = useState({
    tokenAddress: "",
    spender: "",
    amount: "",
  });
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    const res = await fetchInfoContract();
    if (res) {
      console.log("Name : ", name, "Symbol : ", symbol, "Owner :", owner, "Balance : ", balance);
    }
  };
  const handleTransfer = async () => {
    if (!transferData.tokenAddress || !transferData.to || !transferData.amount) {
      return;
    }

    const success = await transferTokens(transferData.to, transferData.amount);

    if (success) {
      setTransferData({ tokenAddress: "", to: "", amount: "" });
    }
  };

  const handleApprove = async () => {
    if (!approveData.tokenAddress || !approveData.spender || !approveData.amount) {
      return;
    }

    const success = await approveTokens(approveData.spender, approveData.amount);

    if (success) {
      setApproveData({ tokenAddress: "", spender: "", amount: "" });
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  console.log(tokens);
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.001) return "< 0.001";
    return num.toFixed(4);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Wallet className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-500 text-center mb-4">Connect your wallet to interact with smart contracts and manage your tokens.</p>
        <Button onClick={connectWallet} disabled={loading} className="w-full">
          {loading ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Wallet Information</h2>
          <Button onClick={connectWallet} disabled={loading} variant="outline" size="sm" className="text-black">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}text-black`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Account</label>
            <p className="text-sm text-gray-800 font-mono">{formatAddress(account || "")}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Network</label>
            <p className="text-sm text-gray-800">{networkInfo ? `${networkInfo.name} (${networkInfo.chainId})` : "Unknown"}</p>
          </div>
        </div>
        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
            <Button onClick={clearError} variant="ghost" size="sm" className="ml-auto text-red-500 hover:text-red-700">
              ×
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Token Balances</h3>
        <div className="space-y-3">
          {tokens?.map((token, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium text-gray-800">{token.symbol}</span>
                <p className="text-xs text-gray-500 font-mono">{formatAddress(token.address)}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800">{formatBalance(token.balance)}</span>
                <p className="text-xs text-gray-500">{token.symbol}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Transfer Tokens
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Token Address</label>
            <Input value={transferData.tokenAddress} onChange={(e) => setTransferData({ ...transferData, tokenAddress: e.target.value })} placeholder="0x..." className="font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">To Address</label>
            <Input value={transferData.to} onChange={(e) => setTransferData({ ...transferData, to: e.target.value })} placeholder="0x..." className="font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
            <Input type="number" value={transferData.amount} onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} placeholder="0.0" step="0.001" />
          </div>
          <Button onClick={handleTransfer} disabled={loading || !transferData.tokenAddress || !transferData.to || !transferData.amount} className="w-full">
            {loading ? "Processing..." : "Transfer"}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Approve Tokens</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Token Address</label>
            <Input value={approveData.tokenAddress} onChange={(e) => setApproveData({ ...approveData, tokenAddress: e.target.value })} placeholder="0x..." className="font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Spender Address</label>
            <Input value={approveData.spender} onChange={(e) => setApproveData({ ...approveData, spender: e.target.value })} placeholder="0x..." className="font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
            <Input type="number" value={approveData.amount} onChange={(e) => setApproveData({ ...approveData, amount: e.target.value })} placeholder="0.0" step="0.001" />
          </div>
          <Button onClick={handleApprove} disabled={loading || !approveData.tokenAddress || !approveData.spender || !approveData.amount} variant="outline" className="w-full">
            {loading ? "Processing..." : "Approve"}
          </Button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">RItem Contract</h3>
        <h3 className="text-gray-800">Contract Name : </h3>
        <h3 className="text-gray-800">Contract Symbol : </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Token Address</label>
            <Input value={approveData.tokenAddress} onChange={(e) => setApproveData({ ...approveData, tokenAddress: e.target.value })} placeholder="0x..." className="font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Spender Address</label>
            <Input value={approveData.spender} onChange={(e) => setApproveData({ ...approveData, spender: e.target.value })} placeholder="0x..." className="font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
            <Input type="number" value={approveData.amount} onChange={(e) => setApproveData({ ...approveData, amount: e.target.value })} placeholder="0.0" step="0.001" />
          </div>
          <Button onClick={handleApprove} disabled={loading || !approveData.tokenAddress || !approveData.spender || !approveData.amount} variant="outline" className="w-full">
            {loading ? "Processing..." : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenWallet;
