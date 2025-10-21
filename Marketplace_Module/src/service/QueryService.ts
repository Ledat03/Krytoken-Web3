import { FetchListNFT } from "@/GraphQL/SubgraphQuery";
import type { NFTsData, NFTProperty } from "@/redux/slice/sliceNFTs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { storedNFT } from "@/redux/slice/sliceNFTs";

export const useListNFTs = () => {
  const { data, status } = useQuery<NFTsData>({
    queryKey: ["ListNFTs"],
    queryFn: () => FetchListNFT(),
  });
  const dispatch = useDispatch();
  const fillData = async () => {
    if (data) {
      const listNFTs = data.transfers.map((item) => {
        return {
          tokenId: item.tokenId,
          tokenURI: item.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/"),
        };
      });
      const res = listNFTs.map(async (item) => {
        const response = await axios.get(item.tokenURI);
        return {
          tokenId: item.tokenId,
          name: response.data.name,
          subscription: response.data.description,
          trait: response.data.traits,
          image: response.data.image,
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
