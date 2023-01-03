import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import {
  Token_CONTRACT_ADDRESS,
  NFT_Contractadd,
  abi_NFT,
  abi_Token,
} from "../../constant/constant";
import { Contract, utils, providers, BigNumber } from "ethers";
// Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // Create a BigNumber `0`
  const zero = BigNumber.from(0);
  const web3ModalRef = useRef();
  const [walletconnect, setWalletConnected] = useState(false);
  const [Owner, setIsOwner] = useState(false);
  const [_tokensMinted, setTokensMinted] = useState(zero);
  const [Amounttoken, setAmounttoken] = useState(zero);
  const [balanceOfDev, setBalanceOfDev] = useState(zero);
  const [totalCoinsClaimed, settotalCoinsClaimed] = useState(zero);
  const [loading, setLoading] = useState(false);
  const getProviderORSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const Web3provider = new providers.Web3Provider(provider);
    if (needSigner) {
      const signer = Web3provider.getSigner();
      return signer;
    }
    return Web3provider;
  };

  /*
        connectWallet: Connects the MetaMask wallet
      */
  const WallectConnect = async () => {
    try {
      await getProviderORSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * getOwner: gets the contract owner by connected address
   */
  const getOwner = async () => {
    try {
      const provider = await getProviderORSigner();
      const tokenContract = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        provider
      );

      const _owner = await tokenContract.owner();
      const signer = await getProviderORSigner(true);
      const getsigner_add = await signer.getAddress();
      if (_owner.toLowerCase() === getsigner_add.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * getTotalTokensMinted: Retrieves how many tokens have been minted till now
   * out of the total supply
   */
  const TokensMinted = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const tokenContract = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        signer
      );
      const Tokensminted = await tokenContract.totalSupply();
      setTokensMinted(Tokensminted);
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * getBalanceOfCryptoDevTokens: checks the balance of Crypto Dev Tokens's held by an address
   */
  const getBalanceOfCryptoDevTokens = async () => {
    try {
      const provider = await getProviderORSigner();
      const Contracttoken = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        provider
      );
      const signer = await getProviderORSigner(true);
      const tokenContract = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        signer
      );
      const sign_add = await signer.getAddress();
      const balance = await tokenContract.balanceOf(sign_add);
      setBalanceOfDev(balance);
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
   */
  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getProviderORSigner();
      const NFTcontract = new Contract(NFT_Contractadd, abi_NFT, provider);
      const signer = await getProviderORSigner(true);
      const tokenContract = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        signer
      );
      const address = await signer.getAddress();
      const balance = await NFTcontract.balanceOf(address);
      if (balance == 0) {
        settotalCoinsClaimed(zero);
      } else {
        // amount keeps track of the number of unclaimed tokens
        var amount = 0;
        for (i = 0; i < balance; i++) {
          const tokenId = await NFTcontract.tokenIdsClaimed();
          const claim = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claim) {
            amount++;
          }
        }
        settotalCoinsClaimed(BigNumber.from(amount));
      }
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * mintCryptoDevToken: mints `amount` number of tokens to a given address
   */
  const mintCryptoDevToken = async (amount) => {
    try {
      console.log("click");
      const signer = await getProviderORSigner(true);
      const tokenContract = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        signer
      );
      const ammount = 0.001 * amount;
      const _mintCryptoDevToken = await tokenContract.mint({
        value: utils.parseEther(ammount.toString()),
      });
      setLoading(true);
      await _mintCryptoDevToken.wait();
      setLoading(false);
      window.alert("Sucessfully minted Crypto Dev Tokens");
      await getBalanceOfCryptoDevTokens();
      await TokensMinted();
      await getTokensToBeClaimed();
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * withdrawCoins: withdraws ether by calling
   * the withdraw function in the contract
   */
  const withdrawCoins = async () => {
    try {
      const signer = await getProviderORSigner(true);
      const tokencontract = new Contract(
        Token_CONTRACT_ADDRESS,
        abi_Token,
        signer
      );
      const Withdraw = await tokencontract.withdraw();
      setLoading(true);
      await Withdraw.wait();
      setLoading(false);
      await getOwner();
    } catch (error) {
      console.error(error);
    }
  };
  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be call
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletconnect) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      WallectConnect();
      TokensMinted();
      getBalanceOfCryptoDevTokens();
      getTokensToBeClaimed();
      getOwner();
    }
  }, [walletconnect]);
  /*
        renderButton: Returns a button based on the state of the dapp
      */
  const renderButton = () => {
    if (loading) {
      return (
        <div>
          <button className={styles.button}>Loading....</button>
        </div>
      );
    }
    // If tokens to be claimed are greater than 0, Return a claim button
    if (totalCoinsClaimed > 0) {
      return (
        <div>
          <div className={styles.description}>
            {totalCoinsClaimed * 10} Tokens can be claimed!
          </div>
          <button className={styles.button} onClick={getTokensToBeClaimed}>
            Claim Tokens
          </button>
        </div>
      );
    }
    return (
      <div style={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            className={styles.input}
            // BigNumber.from converts the `e.target.value` to a BigNumber
            onChange={(e) => setAmounttoken(BigNumber.from(e.target.value))}
          />
        </div>
        <button
          className={styles.button}
          disabled={!(Amounttoken > 0)}
          onClick={() => mintCryptoDevToken(Amounttoken)}
        >
          Mint Tokens
        </button>
      </div>
    );
  };
  // If user doesn't have any tokens to claim, show the mint button
  return (
    <div>
      <Head>
        <title>Falcon Devs</title>
        <meta name="description" content="ICO-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Falcon Devs ICO!</h1>
          <div className={styles.description}>
            You can claim or mint Crypto Dev tokens here
          </div>
          {walletconnect ? (
            <div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                You have minted {utils.formatEther(balanceOfDev)} Crypto Dev
                Tokens
              </div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                Overall {utils.formatEther(_tokensMinted)}/10000 have been
                minted!!!
              </div>
              {renderButton()}
              {/* Display additional withdraw button if connected wallet is owner */}
              {Owner ? (
                <div>
                  {loading ? (
                    <button className={styles.button}>Loading...</button>
                  ) : (
                    <button className={styles.button} onClick={withdrawCoins}>
                      Withdraw Coins
                    </button>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <button onClick={WallectConnect} className={styles.button}>
              Connect your wallet
            </button>
          )}
        </div>
        <div>
          <img className={styles.image} src="./0.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Falcon Devs
      </footer>
    </div>
  );
}
