import { ethers } from "hardhat";
import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";

describe("test Token KYS", function () {
  let [accountA, accountB, accountC]: any = [];
  let address: string = "0x0000000000000000000000000000000000000000";
  let amount: bigint = ethers.parseUnits("100", "ether");
  let totalSupply: bigint = ethers.parseUnits("1000000000", "ether");
  let token: any;
  this.beforeEach(async () => {
    [accountA, accountB, accountC] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("KYS");
    token = await Token.deploy();
    await token.waitForDeployment();
  });
  describe("Pause Test", () => {
    it("should revert if address doesn't have permission !", async () => {
      await expect(token.connect(accountB).pause()).to.be.reverted;
    });
    it("should revert if contract paused !", async () => {
      await token.connect(accountA).pause();
      await expect(token.connect(accountA).pause()).to.be.reverted;
    });
    it("should work correctly !", async () => {
      await expect(token.connect(accountA).pause()).to.emit(token, "Paused").withArgs(accountA);
    });
  });
  describe("Unpause Test", () => {
    it("should revert if address doesn't have permission !", async () => {
      await expect(token.connect(accountB).unpause()).to.be.reverted;
    });
    it("should work correctly !", async () => {
      await token.connect(accountA).pause();
      await expect(token.connect(accountA).unpause()).to.emit(token, "Unpaused").withArgs(accountA);
    });
    it("should work correctly !", async () => {
      await token.connect(accountA).pause();
      await expect(token.connect(accountA).unpause()).to.emit(token, "Unpaused").withArgs(accountA);
      await expect(token.connect(accountA).transfer(accountB.address, amount));
    });
  });
  describe("Test add to blacklist", () => {
    it("should revert transaction if sender on the blacklist", async () => {
      await token.connect(accountA).transfer(accountB.address, amount);
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount);
      expect(await token.balanceOf(accountB.address)).to.be.equal(amount);
      await token.connect(accountA).addToBlackList(accountB.address);
      await expect(token.connect(accountB).transfer(accountC.address, amount)).to.be.reverted;
    });
    it("should revert if receiver on the blacklist", async () => {
      await token.connect(accountA).transfer(accountB, amount);
      await token.connect(accountA).addToBlackList(accountC.address);
      await expect(token.transfer(accountC, amount)).to.be.reverted;
    });
    it("should revert if address is admin", async () => {
      await expect(token.connect(accountA).addToBlackList(accountA.address)).to.be.reverted;
    });
    it("should revert if address is already on the blacklist", async () => {
      await token.connect(accountA).addToBlackList(accountB.address);
      await expect(token.connect(accountA).addToBlackList(accountB.address)).to.be.reverted;
    });
    it("should work correctly", async () => {
      await expect(token.connect(accountA).addToBlackList(accountB.address)).to.emit(token, "addedOnBlacklist").withArgs(accountB.address);
    });
  });
  describe("Test remove from blacklist", () => {
    it("should work correctly", async () => {
      await token.connect(accountA).transfer(accountB, amount);
      await token.connect(accountA).addToBlackList(accountB.address);
      await expect(token.connect(accountB).transfer(accountC.address, amount)).to.be.revertedWith("This address is on blacklist");
      await token.connect(accountA).removeFromBlackList(accountB.address);
      await expect(token.connect(accountB).transfer(accountC.address, amount));
    });
    it("should revert if address isn't admin", async () => {
      await expect(token.connect(accountA).addToBlackList(accountC.address));
      await expect(token.connect(accountB).removeFromBlackList(accountC.address)).to.be.reverted;
    });
  });
  describe("Test Burn Token", function () {
    it("should work correctly ", async function () {
      await token.connect(accountA).burn(1000);
      expect(await token.totalBurned()).to.be.equal(1000);
    });
     it("should revert if amount is 0 ", async function () {
     await expect( token.connect(accountA).burn(0)).to.be.revertedWith("Amount must greater than 0 !");
    });
    
  });
  describe("Test ViewFunc", function () {
    it("Return correct total supply", async function () {
      expect(await token.totalSupply()).to.be.equal(totalSupply);
    });
    it("Return correct balance of owner", async function () {
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply);
    });
    it("Return correct balance of another account", async function () {
      expect(await token.balanceOf(accountB.address)).to.be.equal(0);
    });
    it("Return correct amount allowance from Account A to Account B", async function () {
      expect(await token.allowance(accountA.address, accountB.address)).to.be.equal(0);
    });
  });
});
