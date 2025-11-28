import React, { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
const ContractInfo: React.FC = () => {
  const [contracts, setContracts] = useState([
    { name: "KYS Token", address: import.meta.env.VITE_KYS_CONTRACT_ADDRESS, description: "ERC20 Token for KYS", link: "https://sepolia.etherscan.io/address/0x29Db3E8c725261a6D40c2071770a72e7748Bc33B", isCopied: false },
    { name: "Marketplace", address: import.meta.env.VITE_Marketplace_CONTRACT_ADDRESS, description: "NFT Marketplace Contract", link: "https://sepolia.etherscan.io/address/0x01f7d1Ce9877C8D9664b99D51936E0FdcE5b21c8", isCopied: false },
    { name: "Token Sale", address: import.meta.env.VITE_TokenSale_CONTRACT_ADDRESS, description: "Token Sale Contract", link: "0xe3BD1E8573C5e2f77900785b764E98C3DF4C8145", isCopied: false },
    { name: "Reserve", address: import.meta.env.VITE_Reserve_CONTRACT_ADDRESS, description: "Reserve Contract", link: "https://sepolia.etherscan.io/address/0x2c7bDD34F520Ef27d0412eF6A8adE7521681274B", isCopied: false },
    { name: "Cookies Exclusive", address: import.meta.env.VITE_RItem_CONTRACT_ADDRESS, description: "NFT Contract", link: "https://sepolia.etherscan.io/address/0x2F0Aba6409A65F0D12A1CA2cF20665919277ea85", isCopied: false },
  ]);
  const formatAddress = (address: string) => {
    if (!address || address === "0x...") return "Not deployed";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setContracts((prevContracts) => prevContracts.map((contract) => (contract.address === text ? { ...contract, isCopied: true } : contract)));
    setTimeout(() => {
      setContracts((prevContracts) => prevContracts.map((contract) => (contract.address === text ? { ...contract, isCopied: false } : contract)));
    }, 2000);
  };

  return (
    <div className="p-6 rounded-lg shadow-sm w-full">
      <div className="flex items-center mb-4 justify-center">
        <FileText className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Smart Contracts In Use</h3>
      </div>

      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <div key={index} className="border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{contract.name}</h4>
              {contract.address && contract.address !== "0x..." && (
                <button onClick={() => copyToClipboard(contract.address)} className="text-white text-sm flex items-center">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {contract.isCopied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            <p className="text-sm mb-2">{contract.description}</p>
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-xs mr-2">Address:</span>
                <span className="text-xs bg-gray-500 px-2 py-1 rounded font-mono">{formatAddress(contract.address)}</span>
              </div>
              <a href={contract.link}><Button>View On Sepolia</Button></a>
            </div>

            {contract.address === "0x..." && <p className="text-xs text-orange-600 mt-2">⚠️ Contract not deployed. Please update the address in ContractService.ts</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractInfo;
