import { Button } from "@/components/ui/button";
import { useQueryMarketInfo } from "@/service/QueryService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useMarketContract } from "@/hooks/useMarketContract";
import { toast } from "sonner";

export default function MarketplaceSettings() {
  const [tempInfo, setInfo] = useState({
    feeByDecimal: 0,
    feeRate: 0,
  });
  const [Loading, setLoading] = useState(false);
  const { MarketStatus, refetchMarketInfo } = useQueryMarketInfo();
  const connect = async () => {
    const res = await connectMarket();
  };
  useEffect(() => {
    connect();
  }, [MarketStatus]);
  const { connectMarket, updateFeeRate } = useMarketContract();
  const recipientFee = `${import.meta.env.VITE_Reserve_CONTRACT_ADDRESS}`;

  const CopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const FeeRate: number = useSelector((state: RootState) => state.marketInfo.feeUpdateds[0]?.feeRate);
  const FeeByDecimal: number = useSelector((state: RootState) => state.marketInfo.feeUpdateds[0]?.feeByDecimal);
  const signer = useSelector((state: RootState) => state.identifyAddress.address);
  const changeFeeRate = async (FeeByDecimal: number, FeeRate: number) => {
    setLoading(true);
    try {
      const tx = await updateFeeRate(FeeByDecimal, FeeRate);
      if (tx) {
        await refetchMarketInfo();
        toast.success("Market fee has already changed !");
      }
    } catch (error) {
      toast.error("something went wrong !");
    }
    setLoading(false);
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
                      setInfo({ ...tempInfo, feeRate: Number(e.target.value) });
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
                      setInfo({ ...tempInfo, feeByDecimal: Number(e.target.value) });
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
                await changeFeeRate(tempInfo.feeByDecimal, tempInfo.feeRate);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full"
            >
              {Loading === false ? "Update" : "Updating"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
