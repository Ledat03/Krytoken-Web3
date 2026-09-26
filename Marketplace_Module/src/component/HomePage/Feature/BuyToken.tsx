import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useTokenSale from "@/hooks/useTokenSale";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Web3 } from "@/service/Web3Service";
import { ethers } from "ethers";
import { useContract } from "@/hooks/useContract";
import { toast } from "sonner";
import { useAddressPermission } from "@/service/QueryService";
import { cn } from "@/lib/utils";
const RATE = 10000;
const MIN_ETH = 0.02;
const MIN_KYS = 100;
const BuyToken = () => {
  const [ethAmount, setEthAmount] = useState<string>("");
  const [kysAmount, setkysAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { buyToken, sellToken } = useTokenSale();
  const { checkBalance } = useContract();
  const [AmountToken, setAmount] = useState({ nativeToken: "", KYSToken: "" });
  const [Alternative, setAlter] = useState<string>("buy");
  const userAddress = useSelector((state: RootState) => state.Info.userAddress);
  const { pmsData } = useAddressPermission(userAddress);
  const parsedEth = Number(ethAmount);
  const parsedKys = Number(kysAmount);
  const isValidNumber = ethAmount !== "" && !Number.isNaN(parsedEth);
  const isValidKysNumber = kysAmount !== "" && !Number.isNaN(parsedKys);
  const estimatedKys = isValidNumber ? parsedEth * RATE : 0;
  const estimatedSepolia = isValidKysNumber ? parsedKys / RATE : 0;
  const getAmountToken = async () => {
    if (!userAddress) {
      console.log("User address not available yet");
      return;
    }
    if (!Web3.getProvider()) {
      await Web3.initCreate();
      const provider = Web3.getProvider();
      if (provider) {
        console.log(provider.getSigner);
        try {
          const nativeBalance = await provider.getBalance(userAddress);
          const kysToken = await checkBalance(userAddress);

          if (nativeBalance && kysToken) {
            console.log(kysToken);
            setAmount({
              nativeToken: Number(
                ethers.formatEther(nativeBalance.toString()),
              ).toFixed(4),
              KYSToken: Number(kysToken).toFixed(0),
            });
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    } else {
      const provider = Web3.getProvider();
      if (provider) {
        try {
          const nativeBalance = await provider.getBalance(userAddress);
          const kysToken = await checkBalance(userAddress);
          if (nativeBalance && kysToken) {
            setAmount({
              nativeToken: Number(
                ethers.formatEther(nativeBalance.toString()),
              ).toFixed(4),
              KYSToken: Number(kysToken).toFixed(0),
            });
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    }
  };
  useEffect(() => {
    getAmountToken();
  }, [userAddress]);
  const validationBuyMessage = useMemo(() => {
    if (!isValidNumber || parsedEth <= 0) return "Enter your amount of SepoliaETH";
    if (parsedEth < MIN_ETH)
      return `You need to buy as least ${MIN_ETH} sepolia`;
    if (Number(ethAmount) >= Number(AmountToken.nativeToken))
      return `Insufficient amount`;
    if (estimatedSepolia >= 1000000000)
      return "Amount exceed max token supply !";
    return "";
  }, [isValidNumber, parsedEth, estimatedSepolia, AmountToken, ethAmount]);
  const validationSellMessage = useMemo(() => {
    if (!isValidKysNumber || parsedKys <= 0) return "Enter your amount of KYS";
    if (parsedKys < MIN_KYS) return `You need to buy as least ${MIN_KYS} KYS`;
    if (Number(kysAmount) >= Number(AmountToken.KYSToken))
      return `Insufficient amount`;
    if (estimatedKys >= 1000000000) return "Amount exceed max token supply !";
    return "";
  }, [estimatedKys, isValidKysNumber, parsedKys, kysAmount, AmountToken]);
  const canBuy = validationBuyMessage === "" && isValidNumber;
  const canSell = validationSellMessage === "" && isValidKysNumber;
  const handleBuy = async () => {
    if (!canBuy) return;
    setIsLoading(true);
    toast.promise(
      buyToken(ethAmount).then(() => getAmountToken()),
      {
        loading: "Proceeding Transaction...",
        success: "Done ! reload and check your balance",
        error: "Failed to purchase tokens",
      },
    );
    setIsLoading(false);
  };
  const handleSell = async () => {
    if (!canSell) return;
    setIsLoading(true);
    toast.promise(
      sellToken(kysAmount).then(() => getAmountToken()),
      {
        loading: "Proceeding Transaction...",
        success: "Done ! reload and check your balance",
        error: "Failed to sell tokens",
      },
    );
    setIsLoading(false);
  };

  const tabClass = (mode: "buy" | "sell", side: "left" | "right") =>
    cn(
      "comic-tab",
      Alternative === mode ? "comic-tab-active" : "comic-tab-inactive",
      side === "left"
        ? "rounded-bl-2xl rounded-tl-2xl -mr-[3px]"
        : "rounded-br-2xl rounded-tr-2xl",
    );

  return (
    <div className="bg-app mx-auto w-full max-w-xl p-4 md:p-6 min-h-full">
      <h1 className="cookie-text text-center text-2xl md:text-3xl text-[#2d2640] pt-6 pb-2">
        Token Exchange
      </h1>
      <p className="text-center text-sm text-[#5c6558] mb-6 px-2">
        Swap SepoliaETH ↔ KYS for the marketplace
      </p>

      <div className="flex justify-center relative z-10 mb-3">
        <button
          type="button"
          className={tabClass("buy", "left")}
          onClick={() => {
            setAlter("buy");
            setEthAmount("");
          }}
        >
          Buy
        </button>
        <button
          type="button"
          className={tabClass("sell", "right")}
          onClick={() => {
            setAlter("sell");
            setkysAmount("");
          }}
        >
          Sell
        </button>
      </div>

      {Alternative === "buy" && (
        <Card className="comic-panel gap-4 py-5 mt-0 rounded-t-lg rounded-b-2xl !bg-[#fffef8] shadow-none">
          <CardHeader className="px-5 pb-0">
            <p className="cookie-text text-center text-xl text-[#2d2640]">
              Buy KYS with SepoliaETH
            </p>
            <p className="text-sm text-[#6b6580] text-center">
              Use KYS in the NFT marketplace
            </p>
            {pmsData && pmsData.kryptosApprovals.length === 0 && (
              <p className="text-sm text-[#ff6b6b] text-center font-medium">
                You need to allow permission to buy token.
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-5 text-[#2d2640] px-5">
            <div className="comic-info-box rounded-lg p-3 text-sm">
              <p className="mb-1">
                <span className="font-semibold">Exchange Rate:</span> 1 ETH ={" "}
                {RATE} KYS
              </p>
              <p>
                <span className="font-semibold">Min:</span> {MIN_ETH} ETH
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="eth-amount"
                className="cookie-text text-[#2d2640] text-[17px]"
              >
                Sepolia Amount
              </Label>
              <Input
                id="eth-amount"
                className="comic-input h-11"
                type="number"
                min={MIN_ETH}
                step="0.001"
                placeholder="Eg: 0.1"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
              />
              {validationBuyMessage && (
                <p className="text-sm text-[#ff6b6b] font-medium">
                  {validationBuyMessage}
                </p>
              )}
            </div>

            <div className="comic-coin-box p-4">
              <p className="text-sm text-[#6b6580]">
                You will receive (estimate)
              </p>
              <p className="text-2xl cookie-text text-[#2d2640]">
                {estimatedKys} KYS
              </p>
            </div>
            {AmountToken.nativeToken && (
              <p className="text-sm text-[#5c6558]">
                Your SepoliaETH balance:{" "}
                <span className="font-semibold text-[#e8a317]">
                  {AmountToken.nativeToken}
                </span>
              </p>
            )}
            <button
              type="button"
              className="comic-cta"
              disabled={
                !canBuy ||
                isLoading ||
                (pmsData && pmsData.kryptosApprovals.length === 0)
              }
              onClick={handleBuy}
            >
              {isLoading ? "Proceeding Transaction..." : "Buy KYS"}
            </button>

            <p className="text-xs text-[#6b6580] leading-relaxed">
              Marketplace is on Sepolia Testnet — check your wallet and use
              SepoliaETH.
            </p>
          </CardContent>
        </Card>
      )}

      {Alternative === "sell" && (
        <Card className="comic-panel gap-4 py-5 mt-0 rounded-t-lg rounded-b-2xl bg-[#fffef8]! shadow-none">
          <CardHeader className="px-5 pb-0">
            <p className="cookie-text text-center text-xl text-[#2d2640]">
              Sell KYS for SepoliaETH
            </p>
            <p className="text-sm text-[#6b6580] text-center">
              Convert KYS back to testnet ETH
            </p>
          </CardHeader>

          <CardContent className="space-y-5 text-[#2d2640] px-5">
            <div className="comic-info-box rounded-lg p-3 text-sm">
              <p className="mb-1">
                <span className="font-semibold">Exchange Rate:</span> 1
                SepoliaETH = {RATE} KYS
              </p>
              <p>
                <span className="font-semibold">Min:</span> {MIN_ETH * RATE} KYS
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="kys-amount"
                className="cookie-text text-[#2d2640] text-[17px]"
              >
                KYS Amount
              </Label>
              <Input
                id="kys-amount"
                className="comic-input h-11"
                type="text"
                pattern="[0-9]*"
                min={1}
                max={1000000000}
                maxLength={10}
                placeholder="Eg: 10000"
                value={kysAmount}
                onChange={(e) => setkysAmount(e.target.value)}
              />
              {validationSellMessage && (
                <p className="text-sm text-[#ff6b6b] font-medium">
                  {validationSellMessage}
                </p>
              )}
            </div>

            <div className="comic-coin-box p-4">
              <p className="text-sm text-[#6b6580]">
                You will receive (estimate)
              </p>
              <p className="text-2xl cookie-text text-[#2d2640]">
                {estimatedSepolia} SEPOLIA
              </p>
            </div>
            {AmountToken.KYSToken && (
              <p className="text-sm text-[#5c6558]">
                Your KYS balance:{" "}
                <span className="font-semibold text-[#e8a317]">
                  {AmountToken.KYSToken}
                </span>
              </p>
            )}
            <button
              type="button"
              className="comic-cta"
              disabled={
                !canSell ||
                isLoading ||
                (pmsData && pmsData.kryptosApprovals.length === 0)
              }
              onClick={handleSell}
            >
              {isLoading ? "Proceeding Transaction..." : "Sell KYS"}
            </button>

            <p className="text-xs text-[#6b6580] leading-relaxed">
              Marketplace is on Sepolia Testnet — check your wallet and use
              SepoliaETH.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyToken;
