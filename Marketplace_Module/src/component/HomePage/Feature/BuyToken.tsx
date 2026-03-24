import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useTokenSale from "@/hooks/useTokenSale";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Web3 } from "@/service/Web3Service";
import { ethers } from "ethers";
import { useContract } from "@/hooks/useContract";
const RATE = 10000;
const MIN_ETH = 0.02;

const BuyToken = () => {
  const [ethAmount, setEthAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getTokenSaleContract, buyToken, sellToken } = useTokenSale();
  const { checkBalance } = useContract();
  const [AmountToken, setAmount] = useState({ nativeToken: "", KYSToken: "" });
  const [Alternative, setAlter] = useState<string>("buy");
  const userAddress = useSelector((state: RootState) => state.identifyAddress.address);
  const parsedEth = Number(ethAmount);
  const isValidNumber = ethAmount !== "" && !Number.isNaN(parsedEth);
  const estimatedKys = isValidNumber ? parsedEth * RATE : 0;
  const estimatedSepolia = isValidNumber ? parsedEth / RATE : 0;
  const getAmountToken = async () => {
    if (!userAddress) {
      console.log("User address not available yet");
      return;
    }
    if (!Web3.getProvider()) {
      await Web3.initCreate();
      let provider = Web3.getProvider();
      if (provider) {
        try {
          let nativeBalance = await provider.getBalance(userAddress);
          let kysToken = await checkBalance(userAddress);
          console.log(kysToken);
          if (nativeBalance && kysToken) setAmount({ nativeToken: String(ethers.formatEther(nativeBalance.toString())), KYSToken: String(ethers.parseEther(kysToken)) });
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    } else {
      let provider = Web3.getProvider();
      if (provider) {
        try {
          let nativeBalance = await provider.getBalance(userAddress);
          let kysToken = await checkBalance(userAddress);
          if (nativeBalance && kysToken) setAmount({ nativeToken: ethers.formatEther(nativeBalance.toString()), KYSToken: String(ethers.parseEther(kysToken)) });
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    }
  };
  useEffect(() => {
    getAmountToken();
  }, [userAddress]);
  const validationMessage = useMemo(() => {
    if (ethAmount === "") return "Fill amount of token";
    if (!isValidNumber || parsedEth <= 0) return "Invalid amount";
    if (parsedEth < MIN_ETH) return `You need to buy as least ${MIN_ETH} sepolia`;
    return "";
  }, [ethAmount, isValidNumber, parsedEth]);
  const canBuy = validationMessage === "" && isValidNumber;
  console.log(ethAmount);
  const handleBuy = async () => {
    if (!canBuy) return;

    try {
      setIsLoading(true);
      await buyToken(ethAmount);
      alert("Transaction has done !");
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSell = async () => {
    if (!canBuy) return;

    try {
      setIsLoading(true);
      await sellToken(ethAmount);
      alert("Transaction has done !");
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark mx-auto w-full max-w-xl p-4 md:p-6">
      <div className="py-10 px-auto flex justify-center">
        <button
          className="w-[130px] h-[50px] bg-gray-900 border border-zinc-700 rounded-bl-2xl rounded-tl-2xl text-[18px] font-bold text-zinc-300"
          onClick={() => {
            setAlter("buy");
            setEthAmount("");
          }}
        >
          Buy
        </button>
        <button
          className="w-[130px] h-[50px] bg-gray-900 border border-zinc-700 rounded-br-2xl rounded-tr-2xl text-[18px] font-bold text-zinc-300"
          onClick={() => {
            setAlter("sell");
            setEthAmount("");
          }}
        >
          Sell
        </button>
      </div>
      {Alternative === "buy" && (
        <Card className="dark border-zinc-200">
          <CardHeader>
            <p className="text-sm text-zinc-500 text-center">Buy KYS with SepoliaETH to use in marketplace</p>
          </CardHeader>

          <CardContent className="dark space-y-5 text-zinc-400">
            <div className="dark rounded-lg p-2 text-sm">
              <p className="mb-1">
                <span className="font-medium">Exchange Rate:</span> 1 ETH = {RATE} KYS
              </p>
              <p className="mb-1">
                <span className="font-medium">Min:</span> {MIN_ETH} ETH
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eth-amount">Sepolia Amount</Label>
              <Input id="eth-amount" type="number" min={MIN_ETH} step="0.001" placeholder="Eg: 0.1" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
              {validationMessage ? <p className="text-sm text-red-500">{validationMessage}</p> : <p className="text-sm text-emerald-600"></p>}
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-zinc-500">You will receive (estimate)</p>
              <p className="text-2xl font-semibold">{estimatedKys} KYS</p>
            </div>
            <div>{AmountToken.nativeToken && <p>Your SepoliaETH balance : {Number(AmountToken.nativeToken).toFixed(4)} </p>}</div>
            <Button className="w-full" disabled={!canBuy || isLoading} onClick={handleBuy}>
              {isLoading ? "Proceeding Transaction..." : "Buy"}
            </Button>

            <p className="text-xs text-zinc-500">Notice : Marketplace is on Sepolia Testnet so check your wallet and use SepoliaETH </p>
          </CardContent>
        </Card>
      )}
      {Alternative === "sell" && (
        <Card className="dark border-zinc-200">
          <CardContent className="dark space-y-5 text-zinc-400">
            <div className="dark rounded-lg p-2 text-sm">
              <p className="mb-1">
                <span className="font-medium">Exchange Rate:</span> 1 SepoliaETH = {RATE} KYS
              </p>
              <p className="mb-1">
                <span className="font-medium">Min:</span> {MIN_ETH * RATE} KYS
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eth-amount">KYS Amount</Label>
              <Input id="eth-amount" type="number" min={MIN_ETH} step="0.001" placeholder="Eg: 0.1" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
              {validationMessage ? <p className="text-sm text-red-500">{validationMessage}</p> : <p className="text-sm text-emerald-600"></p>}
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-zinc-500">You will receive (estimate)</p>
              <p className="text-2xl font-semibold">{estimatedSepolia} SEPOLIA</p>
            </div>
            <div>{AmountToken.KYSToken && <p>Your KYS balance : {Number(ethers.formatEther(AmountToken.KYSToken)).toFixed(0)} </p>}</div>
            <Button className="w-full" disabled={!canBuy || isLoading} onClick={handleSell}>
              {isLoading ? "Proceeding Transaction..." : "Sell"}
            </Button>

            <p className="text-xs text-zinc-500">Notice : Marketplace is on Sepolia Testnet so check your wallet and use SepoliaETH </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyToken;
