import { gql, request } from "graphql-request";
import type { NFTsData } from "@/redux/slice/sliceNFTs";
const endPoint: string = "https://api.studio.thegraph.com/query/122785/my-nft-storage/version/latest";
const headers = { Authorization: `Bearer ${import.meta.env.VITE_SUBGRAPH_API_KEY}` };

export const FetchListNFT = async (): Promise<NFTsData> => {
  try {
    const ListNFT = gql`
      query GetListNFT {
        transfers {
          tokenId
          tokenURI
        }
      }
    `;
    return (await request(endPoint, ListNFT, {}, headers)) as NFTsData;
  } catch (error) {
    throw error;
  }
};
