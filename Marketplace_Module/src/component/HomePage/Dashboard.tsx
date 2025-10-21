import { useQuery } from "@tanstack/react-query";
import { FetchListNFT } from "../../GraphQL/SubgraphQuery";
import type { NFTsData } from "@/redux/slice/sliceNFTs";
const Dashboard = () => {
  const { data: transferData, status } = useQuery<NFTsData>({
    queryKey: ["List NFTs"],
    queryFn: () => FetchListNFT(),
  });
  return (
    <>
      {status == "pending" ? <div>Loading...</div> : null}
      {status == "error" ? <div>Error while fetch info on-chain</div> : null}
      {status == "success" ? (
        <div>
          {transferData?.transfers?.map((item, index) => {
            return (
              <ul key={index}>
                <li>{item.tokenId}</li>
                <li>{item.tokenURI}</li>
              </ul>
            );
          })}
        </div>
      ) : null}
    </>
  );
};
export default Dashboard;
