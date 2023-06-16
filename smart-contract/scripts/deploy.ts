import { ethers } from "hardhat";

async function main() {

  const OrchidzBuildNft = await ethers.getContractFactory("OrchidzBuildCreatorERC1155");
  const orchidzBuildNft = await OrchidzBuildNft.deploy();

  await orchidzBuildNft.deployed();

  console.log("nft contract deployed on address: ",orchidzBuildNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// npx hardhat run scripts/deploy.ts --network ganache
