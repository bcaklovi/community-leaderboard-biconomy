import React, { useContext, useState, useEffect, useRef } from "react";
import { Web3Context } from "../Web3Context";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import CommunityLeaderboard from "../contracts/CommunityLeaderboard.json";


import { Input, Button, Flex, Heading, Text } from "@chakra-ui/react";

const CreateLeaderboardNew = () => {

  const { web3, accounts, contract } = useContext(Web3Context);

  const [leaderboardName, setLeaderboardName] = useState();
  const [projectId, setProjectId] = useState();
  const [epoch, setEpoch] = useState();

  const [testName, setTestName] = useState();
  const [isClicked, setIsClicked] = useState(false);

  const inputRef = useRef();

  const biconomy = new Biconomy(web3.currentProvider, {apiKey: "yyWjacp44.cb47adbb-4d70-496f-a9b2-b0caa7602f75"});
  let biconomyWeb3 = new Web3(biconomy);
  console.log(biconomyWeb3.currentProvider);

  const deployedNetwork = CommunityLeaderboard.networks[137];
  let biconomyContract = new web3.eth.Contract(
    CommunityLeaderboard.abi,
    deployedNetwork && deployedNetwork.address
  );
  biconomyContract.options.address = "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad";

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
    return web3.eth.abi.encodeParameters(
      ["uint256", "address", "uint256", "bytes"], 
      [nonce, contractAddress, chainId, Buffer.from(functionSignature)]
    );
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
    let functionSignature = contract.methods
      .createLeaderboard(projectId, leaderboardName, epoch)
      .encodeABI();

    let nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress);

    let messageToSign = constructMetaTransactionMessage(
      nonce,
      137,
      functionSignature,
      "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad"
    );

    console.log(messageToSign);

    const signature = await web3.eth.personal.sign(
      "0x" + messageToSign.toString("hex"), 
      window.ethereum.selectedAddress
    );

    let { r, s, v } = getSignatureParameters(signature);

    let executeMetaTransactionData = biconomyContract.methods
      .executeMetaTransaction(window.ethereum.selectedAddress, functionSignature, r, s, v)
      .encodeABI();

    let txParams = {
      from: window.ethereum.selectedAddress,
      to: "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad",
      value: "0x0",
      gas: "200000",
      data: executeMetaTransactionData,
    };
    const signedTx = await window.ethereum.request({
      method: 'eth_sign',
      params: [txParams],
    });

    let receipt = await web3.eth
      .sendSignedTransaction(signature.rawTransaction)
      .on("transactionHash", (hash) => {
        console.log('hash:',hash);
      })
      .once("confirmation", (confirmation, receipt) => {
      })
      .on("error", (error) => {
        console.log("err:", error);
    });

    // let tx = biconomyContract.methods.executeMetaTransaction(
    //   window.ethereum.selectedAddress, 
    //   functionSignature, r, s, v
    // )
    // .send({from: window.ethereum.selectedAddress});

    // tx.on("transactionHash", (hash)=>{
    //   // Handle transaction hash
    // }).once("confirmation", (confirmation, recipet) => {
    //   // Handle confirmation
    // }).on("error", error => {
    //   // Handle error
    // });

    let gasPrice = await web3.eth.getGasPrice();
    let gasPriceInteger = parseInt(gasPrice, 10);
    let gasPriceFastInteger = Math.ceil(gasPriceInteger * 0.2 + gasPriceInteger);
    
    // await contract.methods.createLeaderboard(projectId, leaderboardName, epoch).send({ from: accounts[0], gasPrice: gasPriceFastInteger });
    setIsClicked(true);
  }

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