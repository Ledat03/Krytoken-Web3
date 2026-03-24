import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

describe("Test Sale Token", function () {
  let [accountA, accountB, accountC]: any = [];
  let token: any;
  let tokenSale: any;
  let address: string = "0x0000000000000000000000000000000000000000";
  let amount: bigint = ethers.parseUnits("10000", "ether");
  let totalSupply: bigint = ethers.parseUnits("1000000000", "ether");
  let testAmount: bigint = ethers.parseUnits("1", "ether");
  this.beforeEach(async () => {
    [accountA, accountB, accountC] = await ethers.getSigners();
    const initToken = await ethers.getContractFactory("KYS");
    token = await initToken.deploy();
    await token.waitForDeployment();
    const initTokenSale = await ethers.getContractFactory("TokenSale");
    tokenSale = await initTokenSale.deploy(token.target);
    await tokenSale.waitForDeployment();
    await token.connect(accountA).transfer(tokenSale, amount);
  });
  describe("test buy function", () => {
    it("return balance of TokenSale", async () => {
      expect(await token.balanceOf(tokenSale.target)).equal(amount);
    });
    it("must revert if address was banned", async () => {
      await token.connect(accountA).addToBlackList(accountB);
      await expect(
        tokenSale.connect(accountB).buy({
          value: ethers.parseEther("0.5"),
        }),
      ).to.be.revertedWith("This address has been banned !");
    });
    it("must revert if amount not reach min cap", async () => {
      await expect(
        tokenSale.connect(accountB).buy({
          value: ethers.parseEther("0.001"),
        }),
      ).to.be.revertedWith("TokenSale: not reached min cap");
    });
    it("must revert if insufficient balance", async () => {
      const remainingTokens = await token.balanceOf(tokenSale.target);
      expect(remainingTokens).to.be.lessThan(ethers.parseEther("100000000"));
      await expect(
        tokenSale.connect(accountB).buy({
          value: ethers.parseEther("1.1"),
        }),
      ).to.be.revertedWith("Insufficient Token");
      expect(await token.balanceOf(accountB)).equal(0);
    });
    it("should work correctly", async () => {
      await expect(
        tokenSale.connect(accountB).buy({
          value: ethers.parseEther("1"),
        }),
      )
        .to.emit(tokenSale, "buyHistory")
        .withArgs(amount, accountB.address, testAmount);
    });
  });
  describe("test sell function", () => {
    it("must revert if amount is 0", async () => {
      await expect(tokenSale.connect(accountB).sell(0)).to.be.revertedWith("Invalid token amount");
    });
    it("must revert if amount not reach min cap", async () => {
      await token.connect(accountA).addToBlackList(accountB);
      await expect(tokenSale.connect(accountB).sell(amount)).to.be.revertedWith("This address has been banned !");
    });
    it("must revert if insufficient ETH", async () => {
      await token.connect(accountA).transfer(accountB, amount);
      await expect(tokenSale.connect(accountB).sell(amount)).to.be.revertedWith("Insufficient ETH for transaction");
    });
    it("must revert if it doesn't had allowance", async () => {
      await tokenSale.connect(accountB).buy({
        value: ethers.parseEther("1"),
      });
      await token.allowance(accountB, tokenSale.target);
      await expect(tokenSale.connect(accountB).sell(amount)).to.be.revertedWith("You need increase allowance amount");
    });
    it("should work correctly", async () => {
      await tokenSale.connect(accountB).buy({
        value: ethers.parseEther("1"),
      }),
        await token.connect(accountB).approve(tokenSale.target, amount);
      await token.allowance(accountB, tokenSale.target);
      await expect(tokenSale.connect(accountB).sell(amount)).to.emit(tokenSale, "sellHistory").withArgs(amount, accountB.address, testAmount);
    });
  });
});
