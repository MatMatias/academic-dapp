# Sample Academic System Dapp

This project is being made for learning and for college purposes and aims to be a simple toy academic system dapp that will run on the Ethereum network, with the smart contracts written in solidity.

## Hardhat

This project uses [hardhat](https://hardhat.org/).

## Install dependencies

```bash
$ npm install
$ cd ./frontend
$ npm install
```

## Tests

Run tests:

```bash
$ npx hardhat test
```

## Setup local network on metamask

Follow this [tutorial](https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node).

## Deploying and running locally

Run local ethereum network:

```bash
$ npx hardhat node
```

Deploy contracts to local network:

```bash
$ npx hardhat run --network localhost ./scripts/deployContracts.ts
```

Run web app:

```bash
$ cd ./frontend && npm start
```

Work in Progress.
