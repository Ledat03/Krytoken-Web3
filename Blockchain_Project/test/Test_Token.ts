import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Token KRT", function () {
  let [accountA, accountB, accountC]: any = [];
  let token: any;
  let amount: number = 100;
  let totalSupply: number = 1000000;
  beforeEach(async () => {
    [accountA, accountB, accountC] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("KRTToken");
    token = await Token.deploy();
    await token.waitForDeployment();
  });
  describe("Test Transfer Function", function () {
    it("Exceeds Balances", async function () {
      await expect(token.connect(accountA).transfer(accountB.address, totalSupply + 1)).to.be.reverted;
    });
    it("Sufficient Amount", async function () {
      let transferTx = await token.connect(accountA).transfer(accountB.address, amount);
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount);
      expect(await token.balanceOf(accountB.address)).to.be.equal(amount);
      await expect(transferTx).to.emit(token, "Transfer").withArgs(accountA.address, accountB.address, amount);
    });
  });
  describe("Test Approve Function", function () {
    it("should work correct", async function () {
      let setApproval = await token.approve(accountB.address, amount);
      expect(await token.allowance(accountA.address, accountB.address)).to.be.equal(amount);
      await expect(setApproval).to.emit(token, "Approval").withArgs(accountA.address, accountB.address, amount);
    });
  });
  describe("Test TransferFrom Function", function () {
    it("should revert if insufficient amount from sender", async function () {
      await expect(token.connect(accountB).transferFrom(accountA.address, accountC.address, totalSupply + 1)).to.be.reverted;
    });
    it("should revert if larger amount allowance from sender", async function () {
      await expect(token.connect(accountB).transferFrom(accountA.address, accountB.address, totalSupply + 1)).to.be.reverted;
    });
    it("should work correct if sufficient amount from sender", async function () {
      await token.connect(accountA).approve(accountB.address, amount);
      let TransferTx = await token.connect(accountB).transferFrom(accountA.address, accountC.address, amount);
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply - amount);
      expect(await token.balanceOf(accountC.address)).to.be.equal(amount);
      await expect(TransferTx).to.emit(token, "Transfer").withArgs(accountA.address, accountC.address, amount);
    });
  });
  describe("Test ViewFunc", function () {
    it("Return correct total supply", async function () {
      expect(await token.totalSupply()).to.be.equal(totalSupply);
    });
    it("Return correct balance of owner", async function () {
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply);
    });
    it("Return correct amount allowance from Account A to Account B", async function () {
      expect(await token.allowance(accountA.address, accountB.address)).to.be.equal(0);
    });
  });
});
