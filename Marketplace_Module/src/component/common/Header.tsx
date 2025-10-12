import WalletOnBoard from "../WalletConnect";
import { IoSearch } from "react-icons/io5";
const Header = () => {
  return (
    <>
      <div className="w-full h-18 flex justify-between px-20 border-b-2 border-solid items-center">
        <div className="border border-[1px] rounded-2xl w-[350px] h-[35px] flex gap-1 items-center pl-2">
          <IoSearch className="icon-config" />
          <input type="text" placeholder="Search NFTs" className="font-black border border-0" />
        </div>
        <WalletOnBoard />
      </div>
    </>
  );
};
export default Header;
