import { expect } from "chai";
import { ethers } from "hardhat";
describe("Marketplace Test-Case", () => {
  let [admin, seller, buyer, feeRecipient, sampleToken, tempFeeRecipient]: any = [];
  let address0: any = "0x0000000000000000000000000000000000000000";
  let marketplace: any;
  let KYS: any;
  let RItem: any;
  let feeDecimal: any = 0;
  let feeRate: any = 10;
  let defaultPrice: any = ethers.parseEther("100");
  let defaultBalance: any = ethers.parseEther("1000000");
  let CidNFT: string = "bafkreigucpesuiq4igddixt6gepsdiuj73qnwgfhcqc7jhqh7othohbx7q";
  beforeEach(async () => {
    [admin, seller, buyer, feeRecipient, sampleToken, tempFeeRecipient] = await ethers.getSigners();
    const token = await ethers.getContractFactory("KYS");
    KYS = await token.deploy();
    await KYS.waitForDeployment();
    const nftContract = await ethers.getContractFactory("RItem");
    RItem = await nftContract.deploy();
    await RItem.waitForDeployment();
    const market = await ethers.getContractFactory("Marketplace");
    marketplace = await market.deploy(feeDecimal, feeRate, feeRecipient.address, RItem.target);
    await marketplace.waitForDeployment();
    await marketplace.addNewToken(KYS.target);
    await KYS.transfer(seller.address, defaultBalance);
    await KYS.transfer(buyer.address, defaultBalance);
  });

  describe("Variable Test", () => {
    it("correct feeByDecimal", async () => {
      expect(await marketplace.feeByDecimal()).to.be.equal(feeDecimal);
    });
    it("correct feeRate", async () => {
      expect(await marketplace.feeRate()).to.be.equal(feeRate);
    });
    it("correct feeRecipient", async () => {
      expect(await marketplace.feeRecipient()).to.be.equal(feeRecipient);
    });
  });
  describe("IsSeller Test", () => {
    beforeEach(async () => {
      await RItem.connect(admin).mintWithURI(seller.address, CidNFT);
      await RItem.connect(seller).setApprovalForAll(marketplace.target, true);
      await marketplace.connect(seller).addOrder(1, defaultPrice, KYS.target);
    });
    it("should work correctly", async () => {
      let checkSeller: boolean = true;
      expect(await marketplace.isSeller(1, seller.address)).to.be.equal(checkSeller);
    });
  });
  describe("isTokenSupported Test", () => {
    it("revert if token isn't supported", async () => {
      expect(await marketplace.isTokenSupported(sampleToken)).to.be.equal(false);
    });
    it("should work correctly", async () => {
      let checkSeller: boolean = true;
      expect(await marketplace.isTokenSupported(KYS.target)).to.be.equal(checkSeller);
    });
  });
  describe("_updateFeeRecipient Test", () => {
    it("should work correctly", async () => {
      await expect(marketplace.connect(admin)._updateFeeRecipient(tempFeeRecipient.address));
    });
    it("revert if address is address(0)", async () => {
      await expect(marketplace.connect(admin)._updateFeeRecipient(address0)).to.be.revertedWith("feeRecipient is address 0 !");
      expect(await marketplace.connect(admin).feeRecipient()).to.be.equal(feeRecipient);
    });
    it("revert if address isn't owner", async () => {
      await expect(marketplace.connect(seller)._updateFeeRecipient(tempFeeRecipient.address)).to.be.reverted;
      expect(await marketplace.connect(admin).feeRecipient()).to.be.equal(feeRecipient);
    });
  });
  describe("updateFeeRate Test", () => {
    it("revert if address isn't owner", async () => {
      await expect(marketplace.connect(seller).updateFeeRate(2, 25)).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
      expect(await marketplace.connect(admin).feeRate()).to.be.equal(10);
      expect(await marketplace.connect(admin).feeByDecimal()).to.be.equal(0);
    });
    it("revert if address fee rate is larger than totalFeeRate", async () => {
      await expect(marketplace.connect(admin).updateFeeRate(2, 20001)).to.be.revertedWith("Bad fee");
      expect(await marketplace.connect(admin).feeRate()).to.be.equal(10);
      expect(await marketplace.connect(admin).feeByDecimal()).to.be.equal(0);
    });
    it("should work correctly", async () => {
      await expect(marketplace.connect(admin).updateFeeRate(2, 25)).to.emit(marketplace, "FeeUpdated").withArgs(2, 25);
      expect(await marketplace.connect(admin).feeRate()).to.be.equal(25);
      expect(await marketplace.connect(admin).feeByDecimal()).to.be.equal(2);
    });
  });
  describe("addNewToken Test", () => {
    it("should work correctly", async () => {
      await expect(marketplace.connect(admin).addNewToken(sampleToken.address));
    });
    it("revert if address is address(0)", async () => {
      await expect(marketplace.connect(admin).addNewToken(address0)).to.be.revertedWith("This token is Address 0");
    });
    it("revert if address isn't owner", async () => {
      await expect(marketplace.connect(seller).addNewToken(sampleToken.address)).to.be.reverted;
    });
    it("revert if address is available", async () => {
      await expect(marketplace.connect(admin).addNewToken(KYS.target)).to.be.revertedWith("This token has been supported already");
    });
  });
  describe("addOrder Test", () => {
    beforeEach(async () => {
      await RItem.connect(admin).mintWithURI(seller.address, CidNFT);
      await RItem.connect(admin).mintWithURI(admin.address, CidNFT);
      await RItem.connect(seller).setApprovalForAll(marketplace.target, true);
    });
    it("check tokenId", async () => {
      expect(await RItem.ownerOf(1)).to.be.equal(seller);
      expect(await RItem.ownerOf(2)).to.be.equal(admin);
    });
    it("should revert if sender isn't owner", async () => {
      await expect(marketplace.connect(admin).addOrder(1, defaultPrice, KYS.target)).to.be.revertedWith("You don't have any permission to sell this NFT !");
    });
    it("should revert if marketplace doesn't have permision to manage NFT", async () => {
      await expect(marketplace.connect(admin).addOrder(2, defaultPrice, KYS.target)).to.be.revertedWith("Market doesn't has any permission from you to manage this NFT");
    });
    it("should revert if price > 0", async () => {
      await expect(marketplace.connect(seller).addOrder(1, 0, KYS.target)).to.be.revertedWith("Price must be greater than 0");
    });
    it("should work correctly", async () => {
      await expect(marketplace.connect(seller).addOrder(1, defaultPrice, KYS.target)).to.emit(marketplace, "OrderAdded").withArgs(1, address0, defaultPrice, KYS.target, 1);
    });
  });
  describe("executeOrder Test", () => {
    beforeEach(async () => {
      await RItem.connect(admin).mintWithURI(seller.address, CidNFT);
      await RItem.connect(admin).mintWithURI(admin.address, CidNFT);
      await RItem.connect(seller).setApprovalForAll(marketplace.target, true);
      await marketplace.connect(seller).addOrder(1, defaultPrice, KYS.target);
    });
    it("should revert if buyer is owner", async () => {
      await expect(marketplace.connect(seller).executeOrder(1)).to.be.revertedWith("You can't buy your NFT");
    });
    it("should revert if buyer != address(0)", async () => {
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await marketplace.connect(buyer).executeOrder(1);
      await expect(marketplace.connect(admin).executeOrder(1)).to.be.revertedWith("This NFT has been sold !");
    });
    it("should work correctly", async () => {
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await expect(marketplace.connect(buyer).executeOrder(1)).to.emit(marketplace, "OrderMatched").withArgs(1, buyer, defaultPrice, KYS, 1, seller);
      expect(await KYS.balanceOf(seller)).to.be.equal(defaultBalance + (defaultPrice * 90n) / 100n);
      expect(await KYS.balanceOf(feeRecipient)).to.be.equal((defaultPrice * 10n) / 100n);
      expect(await KYS.balanceOf(buyer)).to.be.equal(defaultBalance - defaultPrice);
    });
    it("should work correctly with fee = 1% => 100", async () => {
      await marketplace.updateFeeRate(0, 1);
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await expect(marketplace.connect(buyer).executeOrder(1)).to.emit(marketplace, "OrderMatched").withArgs(1, buyer, defaultPrice, KYS, 1, seller);
      expect(await KYS.balanceOf(seller)).to.be.equal(defaultBalance + (defaultPrice * 99n) / 100n);
      expect(await KYS.balanceOf(feeRecipient)).to.be.equal((defaultPrice * 1n) / 100n);
      expect(await KYS.balanceOf(buyer)).to.be.equal(defaultBalance - defaultPrice);
    });
    it("should work correctly with fee = 0", async () => {
      await marketplace.updateFeeRate(0, 0);
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await expect(marketplace.connect(buyer).executeOrder(1)).to.emit(marketplace, "OrderMatched").withArgs(1, buyer, defaultPrice, KYS, 1, seller);
      expect(await KYS.balanceOf(seller)).to.be.equal(defaultBalance + defaultPrice);
      expect(await KYS.balanceOf(feeRecipient)).to.be.equal(0);
      expect(await KYS.balanceOf(buyer)).to.be.equal(defaultBalance - defaultPrice);
    });
    it("should work correctly with fee = 10,11111%  ", async () => {
      await marketplace.updateFeeRate(5, 1011111);
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await expect(marketplace.connect(buyer).executeOrder(1)).to.emit(marketplace, "OrderMatched").withArgs(1, buyer, defaultPrice, KYS, 1, seller);
      expect(await KYS.balanceOf(seller)).to.be.equal(defaultBalance + (defaultPrice * 8988889n) / 10000000n);
      expect(await KYS.balanceOf(feeRecipient)).to.be.equal((defaultPrice * 1011111n) / 10000000n);
      expect(await KYS.balanceOf(buyer)).to.be.equal(defaultBalance - defaultPrice);
    });
  });
  describe("cancelOrder Test", () => {
    beforeEach(async () => {
      await RItem.connect(admin).mintWithURI(seller.address, CidNFT);
      await RItem.connect(admin).mintWithURI(admin.address, CidNFT);
      await RItem.connect(seller).setApprovalForAll(marketplace.target, true);
      await marketplace.connect(seller).addOrder(1, defaultPrice, KYS.target);
    });
    it("should revert if sender isn't owner", async () => {
      await expect(marketplace.connect(admin).cancelOrder(1)).to.be.revertedWith("You don't have any permission to cancel");
    });
    it("should revert if buyer != address(0)", async () => {
      await KYS.connect(buyer).allowance(buyer, marketplace.target);
      await KYS.connect(buyer).approve(marketplace.target, defaultPrice);
      await marketplace.connect(buyer).executeOrder(1);
      await expect(marketplace.connect(seller).cancelOrder(1)).to.be.revertedWith("This NFT has been sold !");
    });
  });
});
