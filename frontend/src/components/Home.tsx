import { useState, useEffect } from "react";
import { ethers } from "ethers";
import * as contractAddresses from "../contractAddresses.json";
import provider from "../services/provider";
import contracts from "../services/contracts";

const Home = () => {
  useEffect(() => {
    async function connect() {
      await provider.send("eth_requestAccounts", []);
      console.log(await provider.getNetwork());

      const signer = provider.getSigner();
      console.log(await signer.getAddress());

      console.log(contracts.academic);
    }

    connect();
  }, []);

  return <h1>Home</h1>;
};

export default Home;
