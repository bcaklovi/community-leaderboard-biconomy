import React, { useContext, useState, useEffect, useRef } from "react";
import { Web3Context } from "../Web3Context";
import { Biconomy } from "@biconomy/mexa";
import CommunityLeaderboard from "../contracts/CommunityLeaderboard.json";
import { constructMetaTransactionMessage, getSignatureParameters } from "../util";

import { Input, 
  Button, 
  Flex, 
  Heading, 
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, 
  useDisclosure } from "@chakra-ui/react";

const CreateLeaderboardNew = () => {

  const { web3, accounts, contract, biconomyWeb3, biconomyContract } = useContext(Web3Context);

  const [leaderboardName, setLeaderboardName] = useState();
  const [projectId, setProjectId] = useState();
  const [epoch, setEpoch] = useState();

  const [testName, setTestName] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [modalText, setModalText] = useState("");

  const inputRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getInitialData = async () => {
      const response = await contract.methods.getProjectName(0).call();
      setTestName(response);
    }
    getInitialData();
  }, [isClicked]);


  const handleClick = async () => {

    let functionSignature = biconomyContract.methods
      .createLeaderboard(projectId, leaderboardName, epoch)
      .encodeABI();

    let nonce = await contract.methods.getNonce(window.ethereum.selectedAddress).call();

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

    console.log("0x" + messageToSign.toString("hex"));

    let { r, s, v } = getSignatureParameters(web3, signature);

    let executeMetaTransactionData = biconomyContract.methods
      .executeMetaTransaction(window.ethereum.selectedAddress, functionSignature, r, s, v)
      .encodeABI();

    let txParams = {
      from: window.ethereum.selectedAddress,
      to: "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad",
      value: "0x0",
      data: executeMetaTransactionData,
    };

    let tx = biconomyContract.methods.executeMetaTransaction(
      window.ethereum.selectedAddress, 
      functionSignature, r, s, v
    )
    .send({ from: window.ethereum.selectedAddress });

    tx.on("transactionHash", (hash)=>{
      // Handle transaction hash
      console.log(hash);
    }).once("confirmation", (confirmation, receipt) => {
      // Handle confirmation  
      setModalText("successful");
      onOpen();

      console.log(confirmation);
      console.log(receipt);
    }).on("error", error => {
      // Handle error
      setModalText("failed");
      onOpen();

      console.log(error.message);
    });

    // let gasPrice = await web3.eth.getGasPrice();
    // let gasPriceInteger = parseInt(gasPrice, 10);
    // let gasPriceFastInteger = Math.ceil(gasPriceInteger * 0.2 + gasPriceInteger);
    
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction {modalText}!</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Button 
              bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
              _hover={{
                bgGradient: 'linear(to-r, #93D9FF, #9EA0FE, #DE86FF, #FE7BE0)'
              }}
              mr={3} 
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
   );
}
 
export default CreateLeaderboardNew;