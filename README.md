# Overview

The repo contains a sample smart contract for signed message testing.

## Setup
1. Clone the repo

2. Run
```
yarn install --frozen-lockfile
```

3. Run a local ganache instance on port 8545

4. Then see the script [eth-sign.ts](scripts/eth-sign.ts) and run it via
```
yarn run hardhat run --network localhost scripts/eth-sign.ts
```