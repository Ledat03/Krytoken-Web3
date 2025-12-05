import { FetchListNFT, FetchMarketInfo, FetchOrderAdded, FetchOrderCancel, FetchOrderMatched, FetchSoldHistory, FetchLatestSold } from "@/GraphQL/SubgraphQuery";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { storedNFT, type NFTsData, type NFTProperty } from "@/redux/slice/sliceNFTs";
import { fetchMarketInfo, type IMarketFeeRate } from "@/redux/slice/sliceMarketInfo";
import { fillListOrder, type IListOrderAdded } from "@/redux/slice/sliceOrder";
import { fillListCancel, type IListOrderCancel } from "@/redux/slice/sliceCancelOffer";
import { fillListMatched, type IListOrderMatched } from "@/redux/slice/sliceMatchedOffer";
import { useEffect } from "react";
import { PinataSDK } from "pinata";
import { setLatestSoldData } from "@/redux/slice/sliceLastestSold";
export const useListNFTs = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery<NFTsData>({
    queryKey: ["ListNFTs"],
    queryFn: () => FetchListNFT(),
  });
  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.PINATA_JWT!,
    pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`,
  });
  useEffect(() => {
    const fillData = async () => {
      if (data && status === "success") {
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
    fillData();
  }, [data, status]);
  return { NFTdata: data, NFTstatus: status, LoadingData: isLoading, refetchListNFT: refetch };
};

export const queryMarketInfo = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery<IMarketFeeRate>({
    queryKey: ["MarketInfo"],
    queryFn: () => FetchMarketInfo(),
  });

  useEffect(() => {
    if (status === "success" && data) {
      dispatch(fetchMarketInfo(data));
    }
  }, [status, data]);
  return { MarketData: data, MarketStatus: status, LoadingInfo: isLoading, refetchMarketInfo: refetch };
};

export const queryOrderAdded = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery<IListOrderAdded>({
    queryKey: ["OrderAdded"],
    queryFn: () => FetchOrderAdded(),
  });
  useEffect(() => {
    dispatch(fillListOrder(data));
  }, [status, data]);

  return { OrderAddedData: data, OrderAddedStatus: status, OrderAddedLoading: isLoading, refetchOrderAdded: refetch };
};

export const queryOrderCancel = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading } = useQuery<IListOrderCancel>({
    queryKey: ["OrderCancel"],
    queryFn: () => FetchOrderCancel(),
  });
  useEffect(() => {
    dispatch(fillListCancel(data));
  }, [status, data, isLoading]);
};

export const queryOrderMatched = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery<IListOrderMatched>({
    queryKey: ["OrderAdded"],
    queryFn: () => FetchOrderMatched(),
  });
  useEffect(() => {
    dispatch(fillListMatched(data));
  }, [status, data]);
  return { OrderMatched: data, StatusMatched: status, LoadingMatched: isLoading, refetchOrderMatched: refetch };
};

export const queryHistoryByTokenId = (tokenId: string) => {
  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["HistoryTransaction"],
    queryFn: () => FetchSoldHistory(tokenId),
  });
  console.log(data);
  return { HistoryStatus: status, HistoryTransaction: data, LoadingHistory: isLoading, refetchHistory: refetch };
};

export const queryLatestSoldData = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["LatestSold"],
    queryFn: () => FetchLatestSold(),
  });
  console.log(data);
  useEffect(() => {
    if (status === "success") dispatch(setLatestSoldData(data));
  }, [status, data]);
  return { LatestSoldStatus: status, LatestSoldLoading: isLoading, refetchLatestSold: refetch };
};
