import WalletOnBoard from "../WalletConnect";

const Header = () => {
  return (
    <>
      <div className="w-full h-18 flex justify-end px-20 border-b-2 border-solid items-center">
        <WalletOnBoard />
      </div>
    </>
  );
};
export default Header;
