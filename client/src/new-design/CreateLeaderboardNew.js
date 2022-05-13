import React, { useContext, useState, useEffect, useRef } from "react";
import { Web3Context } from "../Web3Context";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import CommunityLeaderboard from "../contracts/CommunityLeaderboard.json";
import { toBuffer } from "ethereumjs-util";


import { Input, Button, Flex, Heading, Text } from "@chakra-ui/react";

const CreateLeaderboardNew = () => {

  const { web3, accounts, contract } = useContext(Web3Context);

  const [leaderboardName, setLeaderboardName] = useState();
  const [projectId, setProjectId] = useState();
  const [epoch, setEpoch] = useState();

  const [testName, setTestName] = useState();
  const [isClicked, setIsClicked] = useState(false);

  const [biconomyReady, setBiconomyReady] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const getInitialData = async () => {
      const response = await contract.methods.getProjectName(0).call();
      setTestName(response);
    }
    getInitialData();
  }, [isClicked]);

  const constructMetaTransactionMessage = (
    nonce,
    chainId,
    functionSignature,
    contractAddress
  ) => {
    let abi = require("ethereumjs-abi"); //dependencies

    return abi.soliditySHA3(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, contractAddress, chainId, toBuffer(functionSignature)]
    );

    // return web3.utils.soliditySha3(
    //   nonce, contractAddress, chainId, toBuffer(functionSignature)
    // );

    // console.log("FUNCTION SIGNATURE: " + functionSignature);
    // return web3.eth.abi.encodeParameters(
    //   ["uint256", "address", "uint256", "bytes"], 
    //   [nonce, contractAddress, chainId, toBuffer(functionSignature)]
    // );
    // let abi = require("ethereumjs-abi"); //dependencies
    // return abi.soliditySHA3(
    //   ["uint256", "address", "uint256", "bytes"],
    //   [nonce, contractAddress, chainId, Buffer.from(functionSignature, 'utf8')]
    // );
  }

  const getSignatureParameters = (signature) => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v,
    };
  };

  const handleClick = async () => {

    const provider = new Web3.providers.HttpProvider("https://polygon-mainnet.g.alchemy.com/v2/cD4nWvE0TdHTcHso_kppK2Hh9PnukLzZ");
    const newWeb3 = new Web3(provider);

    console.log(newWeb3);

    const biconomy = new Biconomy(newWeb3.currentProvider, {apiKey: "yyWjacp44.cb47adbb-4d70-496f-a9b2-b0caa7602f75"});
    let biconomyWeb3 = new Web3(biconomy);
    console.log(biconomyWeb3.currentProvider);

    biconomy.onEvent(biconomy.READY, async () => {
      // Initialize your dapp here like getting user accounts etc
      setBiconomyReady(true);

      const deployedNetwork = CommunityLeaderboard.networks[137];
      let biconomyContract = new biconomyWeb3.eth.Contract(
        CommunityLeaderboard.abi,
        deployedNetwork && deployedNetwork.address
      );
      biconomyContract.options.address = "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad";

      const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const newAccount = newAccounts[0];
      console.log(newAccount);
      console.log(web3.utils.isAddress(newAccount));

      console.log("BICONOMY READY:");
      console.log(biconomyReady);

      let myAccounts = require('web3-eth-accounts');
      let myAccount1 = await biconomyWeb3.eth.accounts.create(["random account"]);
      console.log(myAccount1);

      let gasPrice = await web3.eth.getGasPrice();
      let gasPriceInteger = parseInt(gasPrice, 10);
      let gasPriceFastInteger = Math.ceil(gasPriceInteger * 0.2 + gasPriceInteger);

      let functionSignature = contract.methods
        .createLeaderboard(projectId, leaderboardName, epoch)
        .encodeABI();

      let nonce = await web3.eth.getTransactionCount(newAccount);

      let messageToSign = constructMetaTransactionMessage(
        nonce,
        137,
        functionSignature,
        "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad"
      );

      console.log(messageToSign);

      const signature = await web3.eth.sign(
        "0x" + messageToSign.toString("hex"), 
        newAccount
      );

      console.log("0x" + messageToSign.toString("hex"));

      let { r, s, v } = getSignatureParameters(signature);

      let executeMetaTransactionData = contract.methods
        .executeMetaTransaction(newAccount, functionSignature, r, s, v)
        .encodeABI();

      let txParams = {
        from: newAccount,
        to: "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad",
        value: "0x0",
        gas: "200000",
        gasLimit: 3141592,
        data: executeMetaTransactionData,
      };

      // const signedTx = await window.ethereum.request({
      //   method: 'eth_signTypedData',
      //   params: [txParams],
      // });

      // const signedTx = await biconomyWeb3.eth.accounts.signTransaction(
      //   txParams,
      //   myAccount1.privateKey
      // );

      // console.log(signedTx);

      sendTransaction(newAccount, functionSignature, r, s, v);

      // let tx = biconomyContract.methods.executeMetaTransaction(
      //   myAccount1.address, 
      //   functionSignature, r, s, v
      // )
      // .send({from: myAccount1.address /* , gas: 200000, gasLimit: 3141592, gasPrice: gasPriceFastInteger*/ });
  
      // tx.on("transactionHash", (hash)=>{
      //   // Handle transaction hash
      // }).once("confirmation", (confirmation, recipet) => {
      //   // Handle confirmation
      // }).on("error", error => {
      //   // Handle error
      //   console.log(error);
      // });

      // let receipt = await biconomyWeb3.eth
      //   .sendSignedTransaction(signedTx.rawTransaction)
      //   .on("transactionHash", (hash) => {
      //     console.log('hash:',hash);
      //   })
      //   .once("confirmation", (confirmation, receipt) => {
      //   })
      //   .on("error", (error) => {
      //     console.log("err:", error);
      // });

    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
    });


    // let gasPrice = await web3.eth.getGasPrice();
    // let gasPriceInteger = parseInt(gasPrice, 10);
    // let gasPriceFastInteger = Math.ceil(gasPriceInteger * 0.2 + gasPriceInteger);
    
    // await contract.methods.createLeaderboard(projectId, leaderboardName, epoch).send({ from: accounts[0], gasPrice: gasPriceFastInteger });
    setIsClicked(true);
  }

  const sendTransaction = async (userAddress, functionData, r, s, v) => {
    if (web3 && contract) {
        try {
            fetch(`https://api.biconomy.io/api/v2/meta-tx/native`, {
                method: "POST",
                headers: {
                  "x-api-key" : "yyWjacp44.cb47adbb-4d70-496f-a9b2-b0caa7602f75",
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                  "to": "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad",
                  "apiId": "34d517e6-5bc0-4db7-b103-022034d0b383",
                  "params": [userAddress, functionData, r, s, v],
                  "from": userAddress,
                  "gasLimit": "0xF4240"
                })
              })
              .then(response=>response.json())
              .then(async function(result) {
                console.log(result);
                // showInfoMessage(`Transaction sent by relayer with hash ${result.txHash}`);
      
                // let receipt = await getTransactionReceiptMined(result.txHash, 2000);
                // setTransactionHash(result.txHash);
                // showSuccessMessage("Transaction confirmed on chain");
                // getQuoteFromNetwork();
              }).catch(function(error) {
                  console.log(error)
                });
        } catch (error) {
            console.log(error);
        }
    }
};


  return ( 
    <Flex flexDir="column" mt="20vh" ml="6vw" mb={10} w={500}>
      <Heading mb={12} color="white" fontSize="40px" fontWeight={900}>Create a Leaderboard</Heading>

      <Heading mb={4} color="white" fontSize="24px" fontWeight={700}>Project ID Number</Heading>
      <Input 
        borderColor="#848993"
        colorScheme="white"
        placeholder="5"
        mb={6}
        onChange={e => setProjectId(e.target.value)}
        textColor="gray"
      />
      <Heading color="white" fontSize="24px" fontWeight={700}>Leaderboard Name</Heading>
      <Text color="#A7A7A7" fontSize="15px" mb={2}>This will be displayed to the user. Choose something that makes the purpose clear.</Text>
      <Input 
        borderColor="#848993"
        placeholder="Best Meme Creator"
        onChange={e => setLeaderboardName(e.target.value)}
        textColor="gray"
        mb={6}
      />
      <Heading color="white" fontSize="24px" fontWeight={700}>Epoch</Heading>
      <Text color="#A7A7A7" fontSize="15px" mb={2}>How often the leaderboard resets (in days).</Text>
      <Input 
        borderColor="#848993"
        placeholder="14"
        onChange={e => setEpoch(e.target.value)}
        textColor="gray"
        mb={5}
      />
      <Button 
        onClick={handleClick}
        bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
        minH="60px"
        color="#121212"
        fontSize="20px"
        fontWeight={700}
        mb={5}
        _hover={{
          bgGradient: 'linear(to-r, #93D9FF, #9EA0FE, #DE86FF, #FE7BE0)'
        }}
      >
        Create leaderboard
      </Button>
    </Flex>
   );
}
 
export default CreateLeaderboardNew;