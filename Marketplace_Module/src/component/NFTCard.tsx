import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import images from "@/utils/imageCustom";
import { useNFTContract } from "@/hooks/useNFTContract";
import { useMarketContract } from "@/hooks/useMarketContract";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NFTCard({ nft, signer }: { nft: NFTProperty; signer: string }) {
  const { getOwnerOf } = useNFTContract();
  useEffect(() => {
    fetchOwner(nft.tokenId);
  }, []);
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
  console.log(formSale);
  if (owner === signer) {
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
                <h3 className="font-semibold text-foreground text-[15px] mb-1 text-balance">{nft.name}</h3>
                <p className="text-xs text-muted-foreground">Token ID: #{nft.tokenId.toString().padStart(4, "0")}</p>
                <p className="text-xs text-muted-foreground">
                  Owner: {owner.substring(0, 4)}...{owner.substring(owner.length, owner.length - 4)}
                </p>
              </div>
              <div>
                <img src={images[nft.trait.rarity]} alt="" className="w-[100px]" />
              </div>
            </div>

            <div className="w-full flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Giá hiện tại</p>
                <p className="font-bold text-primary text-lg">10000</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">USD</p>
                <p className="font-semibold text-foreground">2000</p>
              </div>
            </div>

            <span className=" self-center text-muted-foreground text-[14px] opacity-0 group-hover:opacity-100">Click to see more detail </span>
          </CardFooter>
        </Card>
        <Dialog open={Open.OpenDetail} onOpenChange={closeDetail}>
          <DialogContent className="dark m-w text-white">
            <DialogHeader>
              <DialogTitle>
                {nft.name} - #000{nft.tokenId}
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-9">
              <img src={nft.image} alt={nft.name} className="w-[400px] h-[400px]" />
              <div className="flex flex-col items-center gap-3">
                <div className="flex mb-2.5 text-center">
                  <DialogTitle className="cookie-text text-2xl">{nft.name}</DialogTitle>
                </div>
                <div className="my-3">
                  <div className="flex">
                    <div className="traits-custom">
                      <DialogTitle className="text-[20px]">Element</DialogTitle>
                      <div className="component-config">
                        <img src={images[nft.trait.element]} alt="" />
                        <span>{nft.trait.element}</span>
                      </div>
                    </div>
                    <div className="traits-custom">
                      <DialogTitle className="text-[20px]">Rarity</DialogTitle>
                      <img src={images[nft.trait.rarity]} alt="" className="w-[140px] my-3" />
                    </div>
                    <div className="traits-custom">
                      <DialogTitle className="text-[20px]">Class</DialogTitle>
                      <h2 className="text-xl font-bold my-3">{nft.trait.class}</h2>
                    </div>
                  </div>
                </div>
                <div className=" rounded-4xl flex my-auto relative justify-center items-center border-1 h-[150px] w-[600px] text-center">
                  <Quote className="mb-10px absolute left-5 top-5" />
                  <p className="text-xl cookie-text">{nft.subscription}</p>
                  <Quote className="mb-10px absolute bottom-[20px] right-5" />
                </div>
                <button onClick={() => setOpen((prev) => ({ ...prev, OpenSale: !Open.OpenSale }))} className="w-full border-1 border-gray-700 rounded-[15px] h-[40px]">
                  {Open.OpenSale == false ? "List For Sale" : "Cancel"}
                </button>
                <div className={`flex gap-2 ${Open.OpenSale ? "opacity-100 w-fit h-fit transition-all duration-200" : "opacity-0 h-0 transition-all duration-300"}`}>
                  <div className="flex justify-center items-center gap-3  rounded-2xl w-[400px]">
                    <Input
                      placeholder="Price"
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, price: Number(e.target.value) }));
                      }}
                    />
                    <span>KYS</span>
                  </div>
                  <Button
                    onClick={async () => {
                      if (formSale.tokenId && formSale.price != 0 && formSale.tokenTransfer) await addOrder(formSale.tokenId, formSale.price, formSale.tokenTransfer);
                    }}
                  >
                    List NFT
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
