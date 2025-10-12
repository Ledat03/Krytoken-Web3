import Web3 from "web3";
import KYS from "./contracts/Token/KYS.sol/KYS.json";
const Index = async () => {
  const web3 = new Web3("http://127.0.0.1:8545/");
  const KYS_token = await new web3.eth.Contract(KYS.abi, "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  console.log(KYS_token);
  console.log(await KYS_token.methods.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").call());
  await KYS_token.methods.transfer("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", web3.utils.toWei("1000000000", "ether")).send({ from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" });
  console.log(await KYS_token.methods.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").call());
};
export default Index;
