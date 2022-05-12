import React, { useState, useEffect, createContext } from "react";
import getWeb3 from "./getWeb3";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CommunityLeaderboard from "./contracts/CommunityLeaderboard.json";

export const Web3Context = createContext();

export const Web3ContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState();
  const [accounts, setAccounts] = useState();

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
    <Web3Context.Provider value={{web3, accounts, contract}}>
      {children}
    </Web3Context.Provider>
  );
}
 