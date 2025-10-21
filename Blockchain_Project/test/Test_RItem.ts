import { expect } from "chai";
import { ethers } from "hardhat";

describe("test RItem721", () => {
  let [accountA, accountB, accountC]: any = [];
  let address0: any = "0x0000000000000000000000000000000000000000";
  let RItem: any;
  let uri = "marketplace.kys.com/item/";
  let CidNFT: string = "bafkreigucpesuiq4igddixt6gepsdiuj73qnwgfhcqc7jhqh7othohbx7q";
  beforeEach(async () => {
    [accountA, accountB, accountC] = await ethers.getSigners();
    const deploy = await ethers.getContractFactory("RItem");
    RItem = await deploy.deploy();
    await RItem.waitForDeployment();
  });
  describe("test mint func", () => {
    it("should revert if NFT mint to 0 address", async () => {
      await expect(RItem.mintWithURI(address0, CidNFT)).to.be.reverted;
    });
    it("should work correctly", async () => {
      const tx = await RItem.connect(accountA).mintWithURI(accountA.address, CidNFT);
      await tx.wait();
      expect(await RItem.balanceOf(accountA.address)).to.equal(1);
      expect(await RItem.ownerOf(1)).to.equal(accountA.address);
    });
    it("should increase with next NFT minted", async () => {
      await RItem.mintWithURI(accountA.address, CidNFT);
      expect(await RItem.ownerOf(1)).to.equal(accountA.address);
      await RItem.mintWithURI(accountA.address, CidNFT);
      expect(await RItem.ownerOf(2)).to.equal(accountA.address);
      expect(await RItem.balanceOf(accountA.address)).to.be.equal(2);
    });
  });
  describe("test updateBaseURI", () => {
    it("should work correctly", async () => {
      await RItem._updateBaseURI(uri);
      await RItem.mintWithURI(accountA.address, CidNFT);
      expect(await RItem.tokenURI(1)).to.be.equal(uri + CidNFT);
    });
  });
  describe("test burn ", () => {
    it("should revert if sender isn't owner", async () => {
      await RItem.connect(accountA).mintWithURI(accountA.address, CidNFT);
      await expect(RItem.connect(accountB).burn(1)).to.be.reverted;
    });
    it("should work correctly", async () => {
      await RItem.connect(accountA).mintWithURI(accountA.address, CidNFT);
      await expect(RItem.connect(accountA).burn(1)).to.emit(RItem, "Transfer").withArgs(accountA, address0, 1);
    });
  });
});
