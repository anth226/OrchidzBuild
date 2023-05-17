import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("OrchidzBuildNft", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const _orchidzBuildNft = await ethers.getContractFactory("OrchidzBuildNft");
    const orchidzBuildNft = await _orchidzBuildNft.deploy();

    return {orchidzBuildNft, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should set the right admin", async function () {
      const { orchidzBuildNft, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await orchidzBuildNft.admin()).to.equal(owner.address);
    });

    it("Should not set the wrong admin", async function () {
      const { orchidzBuildNft, otherAccount } = await loadFixture(deployOneYearLockFixture);

      expect(await orchidzBuildNft.admin()).to.not.equal(otherAccount.address);
    });
  });
});
