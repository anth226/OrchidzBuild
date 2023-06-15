import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks:{
    ganache:{
      url:"http://127.0.0.1:8545",
      accounts: ["0x9f85ee63da8cfd9fc659817675308d524e9d2ad5d992587ae7dc698bdba6f3fd"]
    }
  }
};

export default config;
