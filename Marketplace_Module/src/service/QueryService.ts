import { FetchListNFT, FetchMarketInfo, FetchOrderAdded, FetchOrderCancel, FetchOrderMatched, FetchSoldHistory } from "@/GraphQL/SubgraphQuery";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { storedNFT, type NFTsData, type NFTProperty } from "@/redux/slice/sliceNFTs";
import { fetchMarketInfo, type IMarketFeeRate } from "@/redux/slice/sliceMarketInfo";
import { fillListOrder, type IListOrderAdded } from "@/redux/slice/sliceOrder";
import { fillListCancel, type IListOrderCancel } from "@/redux/slice/sliceCancelOffer";
import { fillListMatched, type IListOrderMatched } from "@/redux/slice/sliceMatchedOffer";
import { useEffect } from "react";
import { PinataSDK } from "pinata";
export const useListNFTs = () => {
  const dispatch = useDispatch();
  const { data, status } = useQuery<NFTsData>({
    queryKey: ["ListNFTs"],
    queryFn: () => FetchListNFT(),
  });
  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.PINATA_JWT!,
    pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`,
  });

  const fillData = async () => {
    if (data) {
      const listNFTs = data.nfts.map((item) => {
        return {
          tokenId: item.id,
          tokenURI: item.tokenURI.replace("ipfs://", ""),
        };
      });
      console.log(listNFTs);
      const res = listNFTs.map(async (item) => {
        const response = await pinata.gateways.public.get(`${item.tokenURI}`);

        const data = typeof response.data === "string" ? undefined : response.data && typeof response.data === "object" ? response.data : undefined;

        return {
          tokenId: item.tokenId,
          name: data && "name" in data ? (data as any).name : undefined,
          subscription: data && "description" in data ? (data as any).description : undefined,
          trait: data && "traits" in data ? (data as any).traits : undefined,
          image: data && "image" in data ? (data as any).image : undefined,
        } as NFTProperty;
      });
      const resolvedData = await Promise.all(res);
      if (status == "success") {
        dispatch(storedNFT(resolvedData));
      }
    }
  };
  return { data, status, fillData };
};
export const queryMarketInfo = () => {
  const dispatch = useDispatch();
  const { data, status } = useQuery<IMarketFeeRate>({
    queryKey: ["MarketInfo"],
    queryFn: () => FetchMarketInfo(),
  });

  useEffect(() => {
    if (status === "success" && data) {
      dispatch(fetchMarketInfo(data));
    }
  }, [status, data]);

  return { data, status };
};
export const queryOrderAdded = () => {
  const dispatch = useDispatch();
  const { data, status } = useQuery<IListOrderAdded>({
    queryKey: ["OrderAdded"],
    queryFn: () => FetchOrderAdded(),
  });
  const OrderAddedData = data;
  const OrderAddedStatus = status;
  useEffect(() => {
    dispatch(fillListOrder(data));
  }, [status, data]);
  return { OrderAddedData, OrderAddedStatus };
};
export const queryOrderCancel = () => {
  const dispatch = useDispatch();
  const { data, status } = useQuery<IListOrderCancel>({
    queryKey: ["OrderAdded"],
    queryFn: () => FetchOrderCancel(),
  });
  useEffect(() => {
    dispatch(fillListCancel(data));
  }, [status, data]);
};
export const queryOrderMatched = () => {
  const dispatch = useDispatch();
  const { data, status } = useQuery<IListOrderMatched>({
    queryKey: ["OrderAdded"],
    queryFn: () => FetchOrderMatched(),
  });
  useEffect(() => {
    dispatch(fillListMatched(data));
  }, [status, data]);
  const OrderMatched = data;
  const StatusMatched = status;
  return { OrderMatched, StatusMatched };
};
export const queryHistoryByTokenId = (tokenId: string) => {
  const { data, status } = useQuery({
    queryKey: ["HistoryTransaction"],
    queryFn: () => FetchSoldHistory(tokenId),
  });
  console.log(data)
  const HistoryTransaction = data;
  const HistoryStatus = status;
  return { HistoryStatus, HistoryTransaction };
};
