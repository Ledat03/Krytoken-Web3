/* eslint-disable no-useless-catch */
import { gql, request } from "graphql-request";
import type { NFTsData } from "@/redux/slice/sliceNFTs";
import type { IMarketFeeRate } from "@/redux/slice/sliceMarketInfo";
import type { IListOrder } from "@/redux/slice/sliceOrder";
import type { IListOrderCancel } from "@/redux/slice/sliceCancelOffer";
import type { IListOrderMatched } from "@/redux/slice/sliceMatchedOffer";
import type { IListSold } from "@/redux/slice/sliceLastestSold";
const endPoint: string = import.meta.env.VITE_API_SUBGRAPH;
const headers = { Authorization: `Bearer ${import.meta.env.VITE_SUBGRAPH_API_KEY}` };

interface Sales {
  type: string;
  tokenId: number;
  price: bigint;
  blockTimestamp: number;
  seller: string;
  buyer: string;
}
export interface ListSale {
  historyMatcheds: Sales[];
}
export const FetchListNFT = async (limit: number, page: number): Promise<NFTsData> => {
  try {
    const ListNFT = gql`
      query limit_nft($limit: Int!, $skip: Int!) {
        nfts(skip: $skip, first: $limit) {
          tokenURI
          id
        }
      }
    `;
    return (await request(endPoint, ListNFT, { limit: limit, skip: page * limit }, headers)) as NFTsData;
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
        listings {
          tokenId
          price
          orderId
          isListing
          owner
        }
      }
    `;
    return (await request(endPoint, fetchOrderAdded, {}, headers)) as IListOrder;
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
      query historyMatcheds($tokenId: BigInt!) {
        historyMatcheds(where: { tokenId: $tokenId }) {
          id
          type
          tokenId
          price
          blockTimestamp
          seller
          buyer
          transactionHash
          blockNumber
        }
      }
    `;
    const variables = {
      tokenId: tokenId.toString(),
    };
    return (await request(endPoint, fetchSoldHistory, variables, headers)) as ListSale;
  } catch (error) {
    throw error;
  }
};
export const FetchLatestSold = async () => {
  const fetchData = gql`
    query GetAllNFTsLastSale {
      nftstats_collection {
        tokenId
        lastSalePrice
        lastSaleBuyer
        lastSaleSeller
        lastSaleTimestamp
        lastSaleType
        totalSales
      }
    }
  `;
  return (await request(endPoint, fetchData, {}, headers)) as IListSold;
};
