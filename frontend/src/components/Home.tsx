import { ethers } from "ethers";
import * as contractAddresses from "../contractAddresses.json";
import provider from "../services/provider";
import contracts from "../services/contracts";

const Home = () => {
  console.log(provider);
  console.log(contracts);

  return <h1>Home</h1>;
};

export default Home;
