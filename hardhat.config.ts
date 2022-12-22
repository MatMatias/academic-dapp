import "@nomicfoundation/hardhat-toolbox";
import "tsconfig-paths/register";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    local: {
      url: "http://localhost:8545",
    },
  },
};

export default config;
