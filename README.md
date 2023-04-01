# Initial Coin Offering (ICO) Dapp

![1](https://user-images.githubusercontent.com/121388704/210338760-7f01bed5-268d-4846-a505-a0b35c7c0cd5.jpg)
Now it's time for you to launch a token for Falcon Devs. Let's call the token Falcon Dev Token. We'll give this token out for free to all our NFT holders, and let other people buy them for ETH.

Initial coin offerings (ICOs) are a popular way to raise funds for products and services usually related to cryptocurrency. ICOs are similar to initial public offerings (IPOs), but coins issued in an ICO also can have utility for a software service or product. A few ICOs have yielded returns for investors.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

Requirements
```
There should be a max of 10,000 CD tokens.
Every Crypto Dev NFT holder should get 10 tokens for free but they would have to pay the gas fees.
The price of one CD at the time of ICO should be 0.001 ether.
```
Let's start building 🚀

Prerequisites
```
You must have checked the NFT Collection dapp or Whitelist dapp from earlier.
```

Smart Contract we used in this dapp:
```
1) We  importing Openzeppelin's ERC20 Contract and Openzeppelin's Ownable Contract in our FalconDevToken contract.
2) Before, check our Whitelist or NFT collection dapp :)
We call the FalconDevs Contract that deployed for the previous level to check for owners of FalconDev NFT's. As we only need to call
tokenOfOwnerByIndex and balanceOf methods, we can create an interface for FalconDevs contract with only these two functions. 
This way we save gas as we do not need to inherit and deploy the entire CryptoDevs Contract, but only a part of it.
```
