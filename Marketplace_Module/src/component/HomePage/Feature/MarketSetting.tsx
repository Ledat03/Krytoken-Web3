import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryMarketInfo } from "@/service/QueryService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useMarketContract } from "@/hooks/useMarketContract";
import { Web3 } from "@/service/Web3Service";
const fakeApprovedTokens = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    approved: true,
  },
  {
    id: 2,
    name: "USDC",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    approved: true,
  },
  {
    id: 3,
    name: "USDT",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    approved: true,
  },
  {
    id: 4,
    name: "DAI",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    approved: false,
  },
];
export default function MarketplaceSettings() {
  const [tempInfo, setInfo] = useState({
    feeByDecimal: 0,
    feeRate: 0,
  });
  const { status } = queryMarketInfo();
  const connect = async () => {
    const res = await connectMarket();
    console.log(res);
  };
  useEffect(() => {
    connect();
    console.log(status);
  }, [status]);

  console.log(tempInfo.feeByDecimal, "  ", tempInfo.feeRate);
  const { connectMarket, updateFeeRate } = useMarketContract();
  const recipientFee = `${import.meta.env.VITE_Reserve_CONTRACT_ADDRESS}`;

  const CopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const FeeRate: number = useSelector((state: RootState) => state.marketInfo.feeUpdateds[0]?.feeRate);
  const FeeByDecimal: number = useSelector((state: RootState) => state.marketInfo.feeUpdateds[0]?.feeByDecimal);
  const signer = useSelector((state: RootState) => state.identifyAddress.address);
  console.log(signer);
  const changeFeeRate = async (FeeByDecimal: number, FeeRate: number) => {
    await updateFeeRate(FeeByDecimal, FeeRate);
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Market Setting </h1>
            <p className="text-muted-foreground text-lg">Manage Infomation of Marketplace</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="dark bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-fo  reground mb-4">Recipient Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Recipient Address</label>
              <div className="flex gap-3">
                <input type="text" value={recipientFee} readOnly className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm font-mono" />
                <Button
                  variant="outline"
                  className="border-border hover:bg-accent/10 bg-transparent"
                  onClick={() => {
                    CopyText(recipientFee);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <input type="text" placeholder="Nhập địa chỉ mới" className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm" />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Update</Button>
            </div>
          </div>
        </div>

        <div className="dark bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Fee Rate</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Fee Rate (%)</label>
                <div className="px-4 py-2 bg-background border border-border rounded-lg text-foreground font-semibold">{FeeRate / 10 ** FeeByDecimal}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total (Decimals)</label>
                <div className="px-4 py-2 bg-background border border-border rounded-lg text-foreground font-mono">{10 ** (Number(FeeByDecimal) + 2)}</div>
              </div>
              <label></label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Fee Rate (Decimal)</label>
                <div className="flex gap-3">
                  <input
                    onChange={(e) => {
                      setInfo({ ...tempInfo, feeByDecimal: Number(e.target.value) });
                    }}
                    type="number"
                    placeholder="Fee By Decimal"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Multiplier (Number)</label>
                <div className="flex gap-3">
                  <input
                    onChange={(e) => {
                      setInfo({ ...tempInfo, feeRate: Number(e.target.value) });
                    }}
                    type="number"
                    placeholder="Multiplier"
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={async () => {
                await changeFeeRate(tempInfo.feeRate, tempInfo.feeByDecimal);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full"
            >
              Update
            </Button>
          </div>
        </div>

        <div className="dark bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Token Allowed</h2>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Add Token
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Symbol</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">State</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {fakeApprovedTokens.map((token) => (
                  <tr key={token.id} className="border-b border-border hover:bg-accent/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{token.name}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-mono">{token.symbol}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground font-mono truncate max-w-xs">{token.address}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${token.approved ? "bg-green-500" : "bg-yellow-500"}`}></div>
                        <span className="text-foreground">{token.approved ? "Được phép" : "Chưa phê duyệt"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!token.approved && (
                          <Button size="sm" variant="outline" className="border-border hover:bg-accent/10 bg-transparent text-xs">
                            Phê duyệt
                          </Button>
                        )}
                        <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" className="border-border hover:bg-accent/10 bg-transparent">
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Save Change</Button>
        </div>
      </div>
    </div>
  );
}
