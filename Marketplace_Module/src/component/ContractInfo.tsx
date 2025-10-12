import React from "react";

import { FileText, ExternalLink } from "lucide-react";

const ContractInfo: React.FC = () => {
  const contracts = [
    { name: "KYS Token", address: import.meta.env.VITE_KYS_CONTRACT_ADDRESS, description: "ERC20 Token for KYS" },
    { name: "Marketplace", address: import.meta.env.VITE_Marketplace_CONTRACT_ADDRESS, description: "NFT Marketplace Contract" },
    { name: "Token Sale", address: import.meta.env.VITE_TokenSale_CONTRACT_ADDRESS, description: "Token Sale Contract" },
    { name: "Reserve", address: import.meta.env.VITE_Reserve_CONTRACT_ADDRESS, description: "Reserve Contract" },
    { name: "RItem", address: import.meta.env.VITE_RItem_CONTRACT_ADDRESS, description: "RItem Contract" },
  ];
  const formatAddress = (address: string) => {
    if (!address || address === "0x...") return "Not deployed";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 mr-2 text-gray-900" />
        <h3 className="text-lg font-semibold text-gray-800">Smart Contracts In Use</h3>
      </div>

      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{contract.name}</h4>
              {contract.address && contract.address !== "0x..." && (
                <button onClick={() => copyToClipboard(contract.address)} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Copy
                </button>
              )}
            </div>
            <p className="text-sm text-gray-900 mb-2">{contract.description}</p>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Address:</span>
              <code className="text-xs bg-gray-500 px-2 py-1 rounded font-mono">{formatAddress(contract.address)}</code>
            </div>
            {contract.address === "0x..." && <p className="text-xs text-orange-600 mt-2">⚠️ Contract not deployed. Please update the address in ContractService.ts</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractInfo;
