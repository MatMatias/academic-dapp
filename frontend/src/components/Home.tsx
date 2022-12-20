import { useState, useEffect } from "react";
import { ethers } from "ethers";
import * as contractAddresses from "../contractAddresses.json";
import provider from "../services/provider";
import contracts from "../services/contracts";

const Home = () => {
  useEffect(() => {
    async function connect() {
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      console.log(signer);
      const blockNumber = await provider.getBlockNumber();
      console.log(blockNumber);
    }

    connect();
  }, []);

  return <h1>Home</h1>;
};

export default Home;
