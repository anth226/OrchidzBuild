import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks:{
    ganache:{
      url:"http://127.0.0.1:8545",
      accounts: ["0xfb8d2eb72edd146d6da65de2a5def0580b13f8f95c55104b9e036c9b67b68d9e"]
    }
  }
};

export default config;
