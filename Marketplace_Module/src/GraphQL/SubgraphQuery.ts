import { gql, request } from "graphql-request";
import type { NFTsData } from "@/redux/slice/sliceNFTs";
import type { IMarketFeeRate } from "@/redux/slice/sliceMarketInfo";
import type { IListOrderAdded } from "@/redux/slice/sliceOrder";
import type { IListOrderCancel } from "@/redux/slice/sliceCancelOffer";
import type { IListOrderMatched } from "@/redux/slice/sliceMatchedOffer";
const endPoint: string = "https://api.studio.thegraph.com/query/122785/subgraph-nft/version/latest";
const headers = { Authorization: `Bearer ${import.meta.env.VITE_SUBGRAPH_API_KEY}` };

interface Sales {
  type: string;
  tokenId: number;
  price: BigInt;
  timestamp: number;
  seller: string;
  buyer: string;
}
export interface ListSale {
  sales: Sales[];
}
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
        listings(where: { status: "active" }) {
          tokenId
          status
          soldAt
          seller
          price
          orderId
          buyer
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
export const FetchSoldHistory = async (tokenId: string) => {
  try {
    const fetchSoldHistory = gql`
      query GetSales($tokenId: BigInt!) {
        sales(where: { tokenId: $tokenId }, orderBy: timestamp, orderDirection: desc) {
          type
          tokenId
          price
          timestamp
          seller
          buyer
        }
      }
    `;
    const variables = {
      tokenId: tokenId.toString(), // ← vẫn để string vì GraphQL sẽ tự convert
    };
    return (await request(endPoint, fetchSoldHistory, variables, headers)) as ListSale;
  } catch (error) {
    throw error;
  }
};
