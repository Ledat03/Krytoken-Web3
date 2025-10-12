import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("Unit Test Reserve", () => {
  let [admin, buyer, seller, receiver]: any = [];
  let KYS: any;
  let Reserve: any;
  let address0: any = "0x0000000000000000000000000000000000000000";
  let week = 86400 * 7;
  let balance = ethers.parseEther("1000");
  beforeEach(async () => {
    [admin, buyer, seller, receiver] = await ethers.getSigners();
    const token = await ethers.getContractFactory("KYS");
    KYS = await token.deploy();
    await KYS.waitForDeployment();
    const _reserve: any = await ethers.getContractFactory("Reserve");
    Reserve = await _reserve.deploy(KYS.target);
    await Reserve.waitForDeployment();
  });
  describe("Test Withdraw", () => {
    beforeEach(async () => {
      await KYS.connect(admin).transfer(Reserve.target, balance);
    });
    it("Revert if receiver is address(0)", async () => {
      network.provider.send("evm_increaseTime", [week * 24]);
      await expect(Reserve.withdrawTo(address0, balance)).to.be.revertedWith("Can't withdraw to address(0)");
    });
    it("Revert if receiver isn't owner", async () => {
      await expect(Reserve.withdrawTo(receiver, balance)).to.be.reverted;
    });
    it("Revert if insufficient balance", async () => {
      network.provider.send("evm_increaseTime", [week * 24]);
      let plus: bigint = ethers.parseEther("100");
      await expect(Reserve.withdrawTo(receiver, balance + plus)).to.be.revertedWith("Exceed amount to withdraw");
    });
    it("Revert if not exceed unlock time", async () => {
      await expect(Reserve.withdrawTo(receiver, balance)).to.be.revertedWith("Can not trade");
    });
    it("Should work correctly", async () => {
      network.provider.send("evm_increaseTime", [week * 24]);
      await Reserve.connect(admin).withdrawTo(receiver, balance);
      expect(await KYS.balanceOf(receiver.address)).to.be.equal(balance);
      expect(await KYS.balanceOf(Reserve.target)).to.be.equal(0);
    });
  });
  describe("Merge Marketplace And Reverse", () => {
    let [admin, seller, buyer, feeRecipient, sampleToken, tempFeeRecipient]: any = [];
    let address0: any = "0x0000000000000000000000000000000000000000";
    let marketplace: any;
    let RItem: any;
    let feeDecimal: any = 0;
    let feeRate: any = 10;
    let defaultPrice: any = ethers.parseEther("100");
    let defaultBalance: any = ethers.parseEther("10000");
    let CidNFT: string = "bafkreigucpesuiq4igddixt6gepsdiuj73qnwgfhcqc7jhqh7othohbx7q";
    beforeEach(async () => {
      [admin, seller, buyer, feeRecipient, sampleToken, tempFeeRecipient] = await ethers.getSigners();
      const nftContract = await ethers.getContractFactory("RItem");
      RItem = await nftContract.deploy();
      await RItem.waitForDeployment();
      const market = await ethers.getContractFactory("Marketplace");
      marketplace = await market.deploy(feeDecimal, feeRate, Reserve.target, RItem.target);
      await marketplace.waitForDeployment();
      await marketplace.addNewToken(KYS.target);
      await KYS.transfer(seller.address, defaultBalance);
      await KYS.transfer(buyer.address, defaultBalance);
    });
    it("Should work correctly", async () => {
      await RItem.connect(admin).mintWithURI(seller.address, CidNFT);
      await RItem.connect(admin).mintWithURI(admin.address, CidNFT);
      await RItem.connect(seller).setApprovalForAll(marketplace.target, true);
      await marketplace.connect(seller).addOrder(1, defaultPrice, KYS.target);
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await marketplace.connect(buyer).executeOrder(1);
      expect(await KYS.balanceOf(seller)).to.be.equal(defaultBalance + (defaultPrice * 90n) / 100n);
      expect(await KYS.balanceOf(Reserve.target)).to.be.equal((defaultPrice * 10n) / 100n);
      expect(await KYS.balanceOf(buyer)).to.be.equal(defaultBalance - defaultPrice);
      network.provider.send("evm_increaseTime", [week * 24]);
      let tokenAmount = (defaultPrice * 10n) / 100n;
      await Reserve.withdrawTo(receiver, tokenAmount);
      expect(await KYS.balanceOf(receiver.address)).to.be.equal(tokenAmount);
      expect(await KYS.balanceOf(Reserve.target)).to.be.equal(0);
    });
  });
});
