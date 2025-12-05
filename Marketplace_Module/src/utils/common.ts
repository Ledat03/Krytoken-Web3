import { formatDistanceToNow } from "date-fns";
import { ethers } from "ethers";
export const formatBalance = (balance: string) => {
  const num = BigInt(balance);
  if (num === 0n) return "0";
  if (num < 0.001) return "< 0.001";
  return ethers.formatUnits(num, 18);
};

export const FormatTime = (time: number) => {
  const date = new Date(time * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
};
