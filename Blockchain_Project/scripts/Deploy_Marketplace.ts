import { ethers, network } from "hardhat";

async function main() {
  let RItem: any = "0x2f0aba6409a65f0d12a1ca2cf20665919277ea85";
  let KYS: any = "0x29db3e8c725261a6d40c2071770a72e7748bc33b";
  let tokenSale;
  let reverse: any = "0x2c7bdd34f520ef27d0412ef6a8ade7521681274b";
  let marketplace;
  let feeRate: number = 0;
  let feeByDecimal: number = 0;
  // const token = await ethers.getContractFactory("KYS");
  // KYS = await token.deploy();
  // await KYS.waitForDeployment();
  // console.log("KYS address = ", KYS.target);
  // const _reserve: any = await ethers.getContractFactory("Reserve");
  // reverse = await _reserve.deploy(KYS.target);
  // await reverse.waitForDeployment();
  // console.log("Reverse address = ", reverse.target);
  // const nftContract = await ethers.getContractFactory("RItem");
  // RItem = await nftContract.deploy();
  // await RItem.waitForDeployment();
  // console.log("RItem address = ", RItem.target);
  const market = await ethers.getContractFactory("Marketplace");
  marketplace = await market.deploy(feeByDecimal, feeRate, reverse, RItem);
  await marketplace.waitForDeployment();
  console.log("Marketplace address = ", marketplace.target);
  await marketplace.addNewToken(KYS);
  // const TokenSale = await ethers.getContractFactory("TokenSale");
  // tokenSale = await TokenSale.deploy(KYS.target);
  // await tokenSale.waitForDeployment();
  // const transferTx = await KYS.transfer(tokenSale.target, ethers.parseUnits("1000000", "ether"));
  // await transferTx.wait();
  // console.log("tokenSale deployed to:", tokenSale.target);
  console.log("KYS has been added to market(True or False)", await marketplace.isTokenSupported(KYS));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
