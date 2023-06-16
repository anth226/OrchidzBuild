import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks:{
    ganache:{
      url:"http://127.0.0.1:8545",
      accounts: ["0xa13013d1930d045ff090f9f448c1bf08591112533a62e0a2f91983ea685e583e"]
    }
  }
};

export default config;
