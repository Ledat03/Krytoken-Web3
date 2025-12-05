import MarketplaceSettings from "@/component/HomePage/Feature/MarketSetting";
import TokenWallet from "../../TokenWallet";
import { useEffect, useState } from "react";
import NFTSetting from "./NFTSetting";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchPermission, type Permission } from "@/redux/slice/slicePermission";
const Setting = () => {
  const [Control, setControl] = useState({
    General: false,
    NFT: false,
    Token: true,
  });
  const dispatch = useDispatch<AppDispatch>();
  const data: Permission | null = useSelector((state: RootState) => state.Permission.data);
  const [State, setState] = useState<number>(0);
  const account = useSelector((state: RootState) => state.identifyAddress.address);
  useEffect(() => {
    console.log(account);
    const fetchData = async () => {
      if (account) {
        await dispatch(fetchPermission(account));
      }
    };
    fetchData();
  }, [account, State]);
  console.log(data);

  return (
    <div className="sm:grid sm:grid-cols-1 md:flex  px-auto relative">
      <div className="items-center gap-5 h-screen min-w-[12vw] overflow-y-auto sticky top-0 border-r-2 border-gray-700">
        <div className="font-bold flex pl-5 items-center gap-3 w-full h-[5vh] border-b-1 border-gray-700 text-3xl">Settings</div>
        <div
          onClick={() => {
            setControl({ ...Control, General: true, NFT: false, Token: false });
          }}
          className={`font-bold flex  pl-5 items-center gap-3 w-full h-[5vh] ${Control.General ? "border-l-7 border-gray-700 " : ""}transition-all ease-in`}
        >
          Market
        </div>
        <div
          onClick={() => {
            setControl({ ...Control, General: false, NFT: false, Token: true });
          }}
          className={`font-bold flex  pl-5 items-center gap-3 w-full h-[5vh] ${Control.Token ? "border-l-7 border-gray-700 " : ""}transition-all ease-in`}
        >
          Wallet
        </div>
        <div
          onClick={() => {
            setControl({ ...Control, General: false, NFT: true, Token: false });
          }}
          className={`font-bold flex  pl-5 items-center gap-3 w-full h-[5vh] border-b-1 border-gray-700 ${Control.NFT ? "border-l-7 border-gray-700 " : ""}transition-all ease-in`}
        >
          NFT
        </div>
      </div>
      {Control.General && <MarketplaceSettings />}
      {Control.Token && <div className="w-full flex justify-center">{<TokenWallet data={data} state={setState} />}</div>}
      {Control.NFT && <div className="w-full flex justify-center">{<NFTSetting data={data} state={setState} />}</div>}
    </div>
  );
};
export default Setting;
