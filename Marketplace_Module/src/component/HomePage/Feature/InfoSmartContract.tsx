import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import TokenWallet from "../../TokenWallet";
import ContractInfo from "../../ContractInfo";

const InfoSmartContract = () => {
  const isValid: boolean = useSelector((state: RootState) => state.identifyAddress.isAddressValid);
  return (
    <div className="p-6">
      {isValid == false ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <span className="text-yellow-800">You aren't identify</span> <br />
          <span className="text-yellow-600">Click on Sign message to verify</span>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <span className="text-green-800">Verified</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenWallet />
        <ContractInfo />
      </div>
    </div>
  );
};
export default InfoSmartContract;
