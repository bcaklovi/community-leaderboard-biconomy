import React, { useState, useEffect, createContext } from "react";
import getWeb3 from "./getWeb3";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CommunityLeaderboard from "./contracts/CommunityLeaderboard.json";

import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";

export const Web3Context = createContext();

export const Web3ContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [accounts, setAccounts] = useState();
  const [biconomyWeb3, setBiconomyWeb3] = useState();
  const [biconomyContract, setBiconomyContract] = useState();

  useEffect(() => {
    const getWeb3Data = async () => {
      try {
        // Get network provider and web3 instance
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance
        const networkId = await web3.eth.net.getId();
        console.log(networkId);

        const deployedNetwork = CommunityLeaderboard.networks[networkId];
        const instance = new web3.eth.Contract(
          CommunityLeaderboard.abi,
          deployedNetwork && deployedNetwork.address,
        );

        console.log(accounts[0]);

        // Set address of Polygon mainnet contract
        instance.options.address = "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad";

        const biconomy = new Biconomy(web3.currentProvider, { apiKey: "yyWjacp44.cb47adbb-4d70-496f-a9b2-b0caa7602f75", debug: true });
        let biconomyWeb3Object = new Web3(biconomy);

        biconomy.onEvent(biconomy.READY, async () => {
          // Initialize your dapp here like getting user accounts etc
          const deployedNetwork = CommunityLeaderboard.networks[137];
          let biconomyContractObject = new biconomyWeb3Object.eth.Contract(
            CommunityLeaderboard.abi,
            deployedNetwork && deployedNetwork.address
          );
          biconomyContractObject.options.address = "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad";

          setBiconomyWeb3(biconomyWeb3Object);
          setBiconomyContract(biconomyContractObject);
        }).onEvent(biconomy.ERROR, (error, message) => {
          // Handle error while initializing mexa
          console.log(error);
          console.log(message);
        });

        /* Used when frontend broke to manually inser contract address
        instance.options.address = "0xb656973BAcD8Bd164A4DA5617ad55349DEb4927C";

        console.log("ADDRESS:");
        console.log(instance);
        deployedNetwork && console.log(deployedNetwork);
        */ 

        let gasPrice = await web3.eth.getGasPrice();
        let gasPriceInteger = parseInt(gasPrice, 10);

        let gasPriceFastInteger = gasPriceInteger * 0.2 + gasPriceInteger;
        let gasPriceFastString = gasPriceFastInteger.toString();

        console.log("Gas price: " + gasPriceFastString);


        // Set web3, accounts, and contract to the state
        setContract(instance);
        setAccounts(accounts);
        setWeb3(web3);

      } catch (error) {
        // Catch any errors for any of the above operations
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    getWeb3Data();
  }, []);

  if (!web3) {
    return <div>Loading web3 connection...</div>
  }

  return (
    <Web3Context.Provider value={{ web3, accounts, contract, biconomyWeb3, biconomyContract }}>
      {children}
    </Web3Context.Provider>
  );
}
 