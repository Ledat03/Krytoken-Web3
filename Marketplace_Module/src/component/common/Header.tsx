import WalletOnBoard from "../WalletConnect";

const Header = () => {
  return (
    <>
      <div className="w-full h-18 flex justify-end gap-[550px] px-20 border-[#2a3028]/25 bg-background items-center">
        <WalletOnBoard />
      </div>
    </>
  );
};
export default Header;
