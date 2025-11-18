import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";
import { FaArrowDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useMarketContract } from "@/hooks/useMarketContract";
import DropdownComponent from "./Dropdown";
import images from "@/utils/imageCustom";
import { useNFTContract } from "@/hooks/useNFTContract";
import { HiOutlineSortDescending } from "react-icons/hi";
import { ethers } from "ethers";
import { MdOutlineCancel } from "react-icons/md";
import type { IListOrderAdded } from "@/redux/slice/sliceOrder";
interface NFTDetailDialogProps {
  nft: NFTProperty | null;
  isOpen: boolean;
  onClose: () => void;
  signer: string;
  feeRate: any;
  ListOrder: IListOrderAdded;
}

export default function NFTDetailDialog({ nft, isOpen, onClose, signer, feeRate, ListOrder }: NFTDetailDialogProps) {
  const { connectMarket, createOffer, getOffers, acceptOffer, executeOrder } = useMarketContract();
  const { getOwnerOf } = useNFTContract();
  const KYSToken = import.meta.env.VITE_KYS_CONTRACT_ADDRESS;
  const [OfferPrice, setPrice] = useState<number>(0);
  const [ListOffers, setList] = useState<[]>([]);
  const [Address, setAddress] = useState({
    contractAddress: "",
    ownerAddress: "",
  });
  const [BestOffer, setDisplayPrice] = useState<string>("");
  const formatBalance = (balance: string) => {
    const num = BigInt(balance);
    if (num === 0n) return "0";
    if (num < 0.001) return "< 0.001";
    return ethers.formatUnits(num, 18);
  };
  const [SelectedOffer, setOffer] = useState({ indexNFT: 0, tokenId: nft?.tokenId, price: 0 });
  const [SelectedOrder, setOrder] = useState<number>(0);
  const [show, setShow] = useState({
    showOffer: false,
    showAddOffer: false,
    showConfirmOffer: false,
    showCancelOffer: false,
    showHistory: false,
  });
  const CloseConfirm = () => setShow((prev) => ({ ...prev, showConfirmOffer: false }));
  const CloseCancel = () => setShow((prev) => ({ ...prev, showCancelOffer: false }));
  console.log(isOpen);
  useEffect(() => {
    getContract();
    const order = ListOrder.orderAddeds?.find((item) => item?.tokenId === nft?.tokenId);
    if (order) setOrder(order.orderId);
  }, [nft, isOpen]);
  const getContract = async () => {
    const res = await connectMarket();
    await getOwner();
    if (nft) {
      const fetchOffer = await getOffers(Number(nft?.tokenId));
      console.log(fetchOffer);
      if (fetchOffer && fetchOffer.length != 0) {
        const list = fetchOffer
          .filter((item: any) => item[4] === true)
          .map((item: any) => ({
            buyer: item[0],
            price: Number(item[1]),
            tokenTransfer: item[2],
            tokenId: Number(item[3]),
            active: item[4],
          }));
        setList(list);
      } else {
        setList([]);
      }
      setShow((prev) => ({ ...prev, showAddOffer: false, showOffer: false }));
    }

    if (res) {
      setAddress((prev) => ({
        ...prev,
        contractAddress: String(res.target),
      }));
    }
  };
  const getOwner = async () => {
    try {
      if (nft) {
        const res = await getOwnerOf(nft.tokenId);
        console.log("owner : ", res);
        if (res) {
          setAddress((prev) => ({
            ...prev,
            ownerAddress: String(res),
          }));
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const addOffer = async () => {
    const res = await createOffer(OfferPrice, KYSToken, Number(nft?.tokenId));
    return res;
  };
  const flowNotice = () => {
    if (show.showConfirmOffer) {
      return (
        <Dialog open={show.showConfirmOffer} onOpenChange={CloseConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Offer </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <span>You accept offer NFT with tokenId : #00{nft?.tokenId}</span>
              <span>Sale Price : {SelectedOffer.price}</span>
              <span>
                Market Fee ( {feeRate[0].feeRate / 10 ** (2 + Number(feeRate[0].feeByDecimal))}% ) : {SelectedOffer.price * (feeRate[0].feeRate / 10 ** (2 + Number(feeRate[0].feeByDecimal)))} KYS
              </span>
              <span>You will receive :{SelectedOffer.price - SelectedOffer.price * (feeRate[0].feeRate / 10 ** (2 + Number(feeRate[0].feeByDecimal)))} KYS</span>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  await acceptOffer(Number(SelectedOffer.tokenId), SelectedOffer.indexNFT);
                }}
              >
                Confirm
              </Button>
              <Button onClick={() => CloseConfirm()}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
    if (show.showCancelOffer) {
      return (
        <Dialog open={show.showCancelOffer} onOpenChange={CloseCancel}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Offer </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col">
              <span>You accept offer NFT with tokenId : #00{nft?.tokenId}</span>
              <span>Sale Price : {SelectedOffer.price}</span>
              <span>
                Market Fee ( {feeRate[0].feeRate / 10 ** (2 + Number(feeRate[0].feeByDecimal))}% ) : {SelectedOffer.price * (feeRate[0].feeRate / 10 ** (2 + Number(feeRate[0].feeByDecimal)))} KYS
              </span>
              <span>You will receive :{SelectedOffer.price - SelectedOffer.price * (feeRate[0].feeRate / 10 ** (2 + Number(feeRate[0].feeByDecimal)))} KYS</span>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  await acceptOffer(Number(SelectedOffer.tokenId), SelectedOffer.indexNFT);
                }}
              >
                Confirm
              </Button>
              <Button onClick={() => CloseCancel()}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {flowNotice()}
      <DialogContent
        className="dark m-w max-h-[90vh]
     text-white"
      >
        <DialogHeader className="flex-row justify-between h-[30px] cookie-text">
          <DialogTitle className="text-2xl text-white">{nft?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center relative ">
            <div className=" w-full overflow-hidden rounded-lg bg-background sticky">
              <img src={nft?.image || "/placeholder.svg"} alt={nft?.name} className="h-auto w-full object-cover scale-75 " />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row items-center gap-3 justify-center">
                <img src={nft?.trait.rarity ? images[nft?.trait.rarity] : ""} className="w-[200px] h-[50px] scale-100 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary" />
                <p className="rounded-full bg-primary/20 px-4 py-2 text-lg font-semibold text-foreground">{nft?.trait.class}</p>
                <div className="flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary">
                  <img src={nft?.trait.element ? images[nft?.trait.element] : ""} className="" />
                  <p className="text-lg font-semibold text-foreground">{nft?.trait.element}</p>
                </div>
              </div>
              <div className="flex justify-center my-15 rounded-full bg-primary/20 px-4 py-2 h-[150px]">
                <RiDoubleQuotesL size={30} className="mb-[10px]" />
                <span className="text-2xl font-semibold text-center my-auto cookie-text text-gray-400">{nft?.subscription}</span>
                <RiDoubleQuotesR size={30} className="mt-auto" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collection</p>
                <p className="text-lg font-semibold text-foreground">Cookie Exclusive Collection</p>
              </div>

              <div className="space-y-3 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <span className="text-xl font-bold text-primary">100 ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">USD Value</span>
                  <span className="text-lg font-semibold text-foreground">100</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-mono text-foreground">#000{nft?.tokenId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-mono text-xs text-primary">
                    {Address.contractAddress.substring(0, 4)}...{Address.contractAddress.substring(Address.contractAddress.length, Address.contractAddress.length - 4)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {ListOrder.orderAddeds?.some((item) => item.tokenId === nft?.tokenId) && (
                  <Button
                    className="flex-1 bg-black text-white hover:bg-white hover:text-black"
                    size="lg"
                    onClick={async () => {
                      await executeOrder(SelectedOrder);
                    }}
                  >
                    Buy Now
                  </Button>
                )}
                <Button
                  disabled={signer === Address.ownerAddress}
                  className="flex-1 hover:bg-black hover:text-white"
                  size="lg"
                  onClick={async () => {
                    setShow((prev) => {
                      return { ...prev, showAddOffer: !prev.showAddOffer };
                    });
                  }}
                >
                  {show.showAddOffer ? (
                    <div className="flex items-center gap-2 text-[15px]">
                      <MdOutlineCancel />
                      Cancel
                    </div>
                  ) : (
                    "Make Offer"
                  )}
                </Button>
              </div>
              <DropdownComponent isOpen={show.showAddOffer}>
                <div className="flex flex-col min-h-[250px] items-center border-y-gray-500 border-y-1 justify-center gap-5">
                  <span className="text-xl font-semibold">OFFER INFORMATION</span>
                  <div className="flex justify-between w-full text-muted-foreground text-[13px]">
                    <span>Token ID</span>
                    <span>#00{nft?.tokenId}</span>
                  </div>
                  <div className="flex justify-between w-full text-muted-foreground text-[13px]">
                    <span>Owner NFT</span>
                    <span>
                      {Address.ownerAddress.substring(0, 4)}...{Address.ownerAddress.substring(Address.ownerAddress.length, Address.ownerAddress.length - 4)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex justify-between items-center border-1 rounded-[10px] w-[250px] h-[40px] ">
                      <input
                        className="background-black border-0 outline-none mx-1 [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none"
                        type="number"
                        onChange={(e) => setPrice(Number(e.target.value))}
                      />
                      <span className="mx-auto">KYS</span>
                    </div>
                    <Button
                      onClick={async () => {
                        await addOffer();
                      }}
                    >
                      Make Offer
                    </Button>
                  </div>
                  <div className="text-muted-foreground text-[17px] font-bold flex justify-between w-full h-[30px] border-t-1 pt-1 border-t-gray-700">
                    <span>Market Fee</span>
                    <span>{OfferPrice * (feeRate[0]?.feeRate / 10 ** (2 + Number(feeRate[0]?.feeByDecimal)))} KYS</span>
                  </div>
                  <span className="text-yellow-300">Notice: This project is on testnet so you only use KYS token to trade NFTs on this marketplace</span>
                </div>
              </DropdownComponent>

              <div
                onClick={() =>
                  setShow((prev) => {
                    return { ...prev, showOffer: !prev.showOffer };
                  })
                }
                className="w-full h-[40px] rounded-2xl border-2 border-solid border-gray flex justify-between items-center mb-0"
              >
                <span className="text-white font-bold ml-5">List Offer</span>
                <FaArrowDown className={`text-white mr-5 ${show.showOffer ? "rotate-180 transition-all duration-300" : "transition-all duration-300"}`} />
              </div>
              <DropdownComponent isOpen={show.showOffer}>
                <div className="text-white">
                  {ListOffers.length > 0 ? (
                    <ul className="flex flex-col gap-4 w-full min-h-[300px]">
                      {ListOffers.map((item: any, index: any) => {
                        return (
                          <li className="flex h-[60px] justify-around items-center border-1 border-gray-500 rounded-xl text-muted-foreground" key={index}>
                            <div className="flex flex-col">
                              <span className="text-[12px]">Address</span>
                              <span className="text-[14px]">
                                {item?.buyer.substring(0, 4)}...{item?.buyer.substring(item?.buyer.length, item?.buyer.length - 4)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className=" text-[12px]">Offer Price</span>
                              <p className=" text-[14px]">{formatBalance(item?.price)} KYS</p>
                            </div>
                            {signer == item?.buyer ? (
                              <Button
                                onClick={() => {
                                  setShow((prev) => ({ ...prev, showCancelOffer: true }));
                                  setOffer(() => ({ tokenId: nft?.tokenId, indexNFT: Number(index), price: item?.price }));
                                }}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                disabled={signer !== Address.ownerAddress}
                                onClick={() => {
                                  setShow((prev) => ({ ...prev, showConfirmOffer: true }));
                                  setOffer(() => ({ tokenId: nft?.tokenId, indexNFT: Number(index), price: item?.price }));
                                }}
                              >
                                Accept Offer
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-[300px] text-muted-foreground text-[15px]">
                      <HiOutlineSortDescending size={60} />
                      <span>Make The First Offer For This NFT</span>
                    </div>
                  )}
                </div>
              </DropdownComponent>
              <div
                onClick={() =>
                  setShow((prev) => {
                    return { ...prev, showHistory: !prev.showHistory };
                  })
                }
                className="w-full h-[40px] rounded-2xl border-2 border-solid border-gray flex justify-between items-center mb-0"
              >
                <span className="text-white font-bold ml-5">History Transaction</span>
                <FaArrowDown className={`text-white mr-5 ${show.showHistory ? "rotate-180 transition-all duration-300" : "transition-all duration-300"}`} />
              </div>
              <DropdownComponent isOpen={show.showHistory}>
                <div className="text-white">
                  {ListOffers.length > 0 ? (
                    <ul className="flex flex-col gap-4 w-full min-h-[300px]">
                      {ListOffers.map((item: any, index: any) => {
                        return (
                          <li className="flex h-[60px] justify-around items-center border-1 border-gray-500 rounded-xl text-muted-foreground" key={index}>
                            <div className="flex flex-col">
                              <span className="text-[12px]">Address</span>
                              <span className="text-[14px]">
                                {item?.buyer.substring(0, 4)}...{item?.buyer.substring(item?.buyer.length, item?.buyer.length - 4)}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className=" text-[12px]">Offer Price</span>
                              <p className=" text-[14px]">{formatBalance(item?.price)} KYS</p>
                            </div>
                            {signer == item?.buyer ? (
                              <Button
                                onClick={() => {
                                  setShow((prev) => ({ ...prev, showCancelOffer: true }));
                                  setOffer(() => ({ tokenId: nft?.tokenId, indexNFT: Number(index), price: item?.price }));
                                }}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <Button
                                disabled={signer !== Address.ownerAddress}
                                onClick={() => {
                                  setShow((prev) => ({ ...prev, showConfirmOffer: true }));
                                  setOffer(() => ({ tokenId: nft?.tokenId, indexNFT: Number(index), price: item?.price }));
                                }}
                              >
                                Accept Offer
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-[300px] text-muted-foreground text-[15px]">
                      <HiOutlineSortDescending size={60} />
                      <span>Make The First Offer For This NFT</span>
                    </div>
                  )}
                </div>
              </DropdownComponent>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
