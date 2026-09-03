/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchListNFT, FetchMarketInfo, FetchOrderAdded, FetchOrderCancel, FetchOrderMatched, FetchSoldHistory, FetchLatestSold } from "@/GraphQL/SubgraphQuery";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { type NFTProperty } from "@/redux/slice/sliceNFTs";
import { fetchMarketInfo, type IMarketFeeRate } from "@/redux/slice/sliceMarketInfo";
import { fillListOrder, type IListOrder } from "@/redux/slice/sliceOrder";
import { fillListCancel, type IListOrderCancel } from "@/redux/slice/sliceCancelOffer";
import { fillListMatched, type IListOrderMatched } from "@/redux/slice/sliceMatchedOffer";
import { useEffect } from "react";
import { PinataSDK } from "pinata";
import { setLatestSoldData } from "@/redux/slice/sliceLastestSold";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT_KEY!,
  pinataGateway: `${import.meta.env.VITE_GATEWAY_URL}`,
});

export const useListNFTs = (limit: number, page: number) => {
  const { data, status, refetch, isFetching } = useQuery<NFTProperty[]>({
    queryKey: ["ListNFTs", limit, page],
    queryFn: async () => {
      const raw = await FetchListNFT(limit, page);
      const listNFTs = raw.nfts.map((item) => ({
        tokenId: item.id,
        tokenURI: item.tokenURI.replace("ipfs://", ""),
      }));
      const resolvedData = await Promise.all(
        listNFTs.map(async (item) => {
          const response = await pinata.gateways.public.get(item.tokenURI);
          const meta = typeof response.data === "object" && response.data !== null ? response.data : undefined;
          return {
            tokenId: item.tokenId,
            name: meta && "name" in meta ? (meta as any).name : "",
            subscription: meta && "description" in meta ? (meta as any).description : "",
            trait: meta && "traits" in meta ? (meta as any).traits : {},
            image: meta && "image" in meta ? (meta as any).image : "",
          } as NFTProperty;
        }),
      );
      return resolvedData;
    },
  });
  const typeBlank: NFTProperty[] = [];
  return {
    NFTs: data ?? typeBlank,
    NFTstatus: status,
    isFetching,
    refetchListNFT: refetch,
  };
};

export const useQueryMarketInfo = () => {
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

export const useQueryOrderAdded = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery<IListOrder>({
    queryKey: ["OrderAdded"],
    queryFn: () => FetchOrderAdded(),
  });
  useEffect(() => {
    dispatch(fillListOrder(data));
  }, [status, data]);
  return { OrderAddedData: data, OrderAddedStatus: status, OrderAddedLoading: isLoading, refetchOrderAdded: refetch };
};

export const useQueryOrderCancel = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading } = useQuery<IListOrderCancel>({
    queryKey: ["OrderCancel"],
    queryFn: () => FetchOrderCancel(),
  });
  useEffect(() => {
    dispatch(fillListCancel(data));
  }, [status, data, isLoading]);
};

export const useQueryOrderMatched = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery<IListOrderMatched>({
    queryKey: ["OrderMatched"],
    queryFn: () => FetchOrderMatched(),
  });
  useEffect(() => {
    dispatch(fillListMatched(data));
  }, [status, data]);
  return { OrderMatched: data, StatusMatched: status, LoadingMatched: isLoading, refetchOrderMatched: refetch };
};

export const useQueryHistoryByTokenId = (tokenId: string) => {
  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["HistoryTransaction", tokenId],
    queryFn: () => FetchSoldHistory(tokenId),
  });
  return { HistoryStatus: status, HistoryTransaction: data, LoadingHistory: isLoading, refetchHistory: refetch };
};

export const useQueryLatestSoldData = () => {
  const dispatch = useDispatch();
  const { data, status, isLoading, refetch } = useQuery({
    queryKey: ["LatestSold"],
    queryFn: () => FetchLatestSold(),
  });
  useEffect(() => {
    if (status === "success") dispatch(setLatestSoldData(data));
  }, [status, data]);
  return { LatestSoldStatus: status, LatestSoldLoading: isLoading, refetchLatestSold: refetch };
};
