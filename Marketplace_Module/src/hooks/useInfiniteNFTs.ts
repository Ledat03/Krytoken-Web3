import { useState, useEffect, useCallback } from "react";
import { useListNFTs } from "@/service/QueryService";
import type { NFTProperty } from "@/redux/slice/sliceNFTs";

const PAGE_SIZE = 8;

export const useInfiniteNFTs = () => {
  const [listNFTs, setListNFTs] = useState<NFTProperty[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { NFTs = [], NFTstatus, isFetching } = useListNFTs(PAGE_SIZE, page);

  useEffect(() => {
    if (NFTstatus !== "success") return;

    setListNFTs((prev) => {
      if (page === 0) {
        const sameLength = prev.length === NFTs.length;
        const sameItems = sameLength && prev.every((item, index) => item.tokenId === NFTs[index]?.tokenId);

        return sameItems ? prev : NFTs;
      }

      if (NFTs.length === 0) return prev;

      const existingIds = new Set(prev.map((item) => item.tokenId));
      const newItems = NFTs.filter((item) => !existingIds.has(item.tokenId));

      if (newItems.length === 0) return prev;

      return [...prev, ...newItems];
    });

    setHasMore(NFTs.length === PAGE_SIZE);
  }, [NFTstatus, NFTs, page]);

  const loadMore = useCallback(() => {
    if (!hasMore || isFetching) return;
    setPage((prev) => prev + 1);
  }, [hasMore, isFetching]);

  const reset = useCallback(() => {
    setListNFTs([]);
    setPage(0);
    setHasMore(true);
  }, []);

  return {
    ListNFTs: listNFTs,
    NFTstatus,
    hasMore,
    isFetching,
    loadMore,
    reset,
  };
};
