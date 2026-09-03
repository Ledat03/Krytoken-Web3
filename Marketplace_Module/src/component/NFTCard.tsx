import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import images from "@/utils/imageCustom";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useMarketContract } from "@/hooks/useMarketContract";
import { useEffect, useState } from "react";
import { formatBalance } from "@/utils/common";
import NFTDetailDialog from "./common/Dialog";
import type { IListOrder,IOrderAdded } from "@/redux/slice/sliceOrder";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useQueryMarketInfo, useQueryOrderAdded, useQueryOrderMatched } from "@/service/QueryService";
export default function NFTCard({ nft, signer,listed}: { nft: NFTProperty; signer: string , listed:IOrderAdded | undefined}) {
  const { getOwnerOf } = useNFTContract();
  const OrderData: IListOrder = useSelector((state: RootState) => state.orderAdded);
  const infoMarket = useSelector((state: RootState) => state.marketInfo.feeUpdateds);
  const {} = useQueryMarketInfo();
  const { OrderAddedStatus } = useQueryOrderAdded();
  const { StatusMatched } = useQueryOrderMatched();
  useEffect(() => {
    fetchOwner(nft.tokenId);
  }, [OrderAddedStatus, StatusMatched]);
  const [owner, setOwner] = useState<string>("");
  const [Open, setOpen] = useState({
    OpenDetail: false,
    OpenSale: false,
  });
  const token = import.meta.env.VITE_KYS_CONTRACT_ADDRESS;
  const [formSale, setForm] = useState({ tokenTransfer: token, tokenId: nft.tokenId, price: 0 });
  const closeDetail = () => setOpen((prev) => ({ ...prev, OpenDetail: false }));
  const { addOrder } = useMarketContract();
  const fetchOwner = async (tokenId: number) => {
    const res = await getOwnerOf(tokenId);
    if (res) setOwner(res);
  };
console.log(listed)
  if (owner === signer ||  listed?.owner.toLowerCase() === signer.toLowerCase()) {
    return (
      <>
        <Card
          onClick={(e) => {
            if (e.target instanceof HTMLElement && e.target.closest("button")) {
              return;
            }
            e.stopPropagation();
            setOpen((prev) => ({ ...prev, OpenDetail: true }));
          }}
          className="dark bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group cursor-pointer w-[250px] m-h-[500px] py-0"
        >
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img src={nft.image} alt="image" className="object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start justify-around gap-3 px-3 py-auto h-full">
            <div className="w-full flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-foreground text-[15px] mb-1 text-balance cookie-text">{nft.name}</h3>
                <p className="text-xs text-muted-foreground">Token ID: #{nft.tokenId.toString().padStart(4, "0")}</p>
                <p className="text-xs text-muted-foreground">
                  Owner: {owner.substring(0, 4)}...{owner.substring(owner.length, owner.length - 4)}
                </p>
              </div>
              <div>
                <img src={images[nft.trait.rarity]} alt="" className="w-[100px]" />
              </div>
            </div>
            {
             listed != undefined ? <div className="w-full flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="font-bold text-primary text-lg cookie-text">{formatBalance(listed.price.toString())} KYS</p>
              </div>
            </div> : <div className="text-2xl cookie-text">Not Listed</div>
            }
           

            <span className=" self-center text-muted-foreground text-[14px] opacity-0 group-hover:opacity-100">Click to see more detail </span>
          </CardFooter>
        </Card>
        {Open.OpenDetail && <NFTDetailDialog nft={nft} isOpen={Open.OpenDetail} onClose={() => closeDetail()} signer={signer} feeRate={infoMarket} ListOrder={OrderData} />}
      </>
    );
  }
}
