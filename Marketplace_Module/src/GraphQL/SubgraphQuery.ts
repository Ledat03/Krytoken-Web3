import { gql, request } from "graphql-request";
import type { NFTsData } from "@/redux/slice/sliceNFTs";
import type { IMarketFeeRate } from "@/redux/slice/sliceMarketInfo";
import type { IListOrderAdded } from "@/redux/slice/sliceOrder";
import type { IListOrderCancel } from "@/redux/slice/sliceCancelOffer";
import type { IListOrderMatched } from "@/redux/slice/sliceMatchedOffer";
const endPoint: string = "https://api.studio.thegraph.com/query/122785/my-storage/version/latest";
const headers = { Authorization: `Bearer ${import.meta.env.VITE_SUBGRAPH_API_KEY}` };

export const FetchListNFT = async (): Promise<NFTsData> => {
  try {
    const ListNFT = gql`
      {
        nfts {
          tokenURI
          id
        }
      }
    `;
    return (await request(endPoint, ListNFT, {}, headers)) as NFTsData;
  } catch (error) {
    throw error;
  }
};
export const FetchMarketInfo = async () => {
  try {
    const fetchMarketInfo = gql`
      query MyQuery {
        feeUpdateds(orderBy: blockTimestamp, orderDirection: desc, first: 1) {
          feeRate
          feeByDecimal
        }
      }
    `;
    return (await request(endPoint, fetchMarketInfo, {}, headers)) as IMarketFeeRate;
  } catch (error) {
    throw error;
  }
};
export const FetchOrderAdded = async () => {
  try {
    const fetchOrderAdded = gql`
      {
        orderAddeds(where: { isMatched: false }) {
          tokenTransfer
          tokenId
          price
          orderId
          isMatched
          id
          blockTimestamp
        }
      }
    `;
    return (await request(endPoint, fetchOrderAdded, {}, headers)) as IListOrderAdded;
  } catch (error) {
    throw error;
  }
};
export const FetchOrderCancel = async () => {
  try {
    const fetchOrderAdded = gql`
      {
        orderCancels {
          orderId
          blockTimestamp
        }
      }
    `;
    return (await request(endPoint, fetchOrderAdded, {}, headers)) as IListOrderCancel;
  } catch (error) {
    throw error;
  }
};
export const FetchOrderMatched = async () => {
  try {
    const fetchOrderAdded = gql`
      {
        orderMatcheds {
          tokenTransfer
          tokenId
          seller
          price
          orderId
          buyer
          blockTimestamp
        }
      }
    `;
    return (await request(endPoint, fetchOrderAdded, {}, headers)) as IListOrderMatched;
  } catch (error) {
    throw error;
  }
};
