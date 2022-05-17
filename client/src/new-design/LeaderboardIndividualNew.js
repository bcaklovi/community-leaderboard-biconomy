import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Web3Context } from "../Web3Context";
import { constructMetaTransactionMessage, getSignatureParameters } from "../util";

import { 
  Flex, 
  Input, 
  Button, 
  Table, 
  TableContainer, 
  Thead, 
  Tr, 
  Td, 
  Th, 
  Tbody, 
  Tfoot, 
  Heading, 
  Image, 
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, 
  useDisclosure 
} from "@chakra-ui/react";

import ProjectPic from "./project-pic.png";

const LeaderboardIndividualNew = () => {

  const { projectId, leaderboardId } = useParams();
  const { web3, accounts, contract, biconomyWeb3, biconomyContract } = useContext(Web3Context);

  const [projectName, setProjectName] = useState();

  const [leaderboardName, setLeaderboardName] = useState();
  const [leaderboardLength, setLeaderboardLength] = useState();
  const [memberRows, setMemberRows] = useState([]);

  const [member, setMember] = useState();
  const [tokenID, setTokenID] = useState();

  const [modalText, setModalText] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getInitialData = async () => {
      const projectResult = await contract.methods.getProjectName(projectId).call();
      const leaderboardResult = await contract.methods.getLeaderboardName(projectId, leaderboardId).call();
      const leaderboardLengthResult = await contract.methods.getLeaderboardMemberLength(projectId, leaderboardId).call();
      setProjectName(projectResult);
      setLeaderboardName(leaderboardResult);
      setLeaderboardLength(leaderboardLengthResult);

      getLeaderboardMembers(leaderboardLengthResult);
    }
    getInitialData();
  }, []);

  const getLeaderboardMembers = async (num) => {
    let rows = [];
    for (let i = 0; i < num; i++) {
      let memberObject = {};
      memberObject.address = await contract.methods.getLeaderboardMemberAddress(projectId, leaderboardId, i).call();
      memberObject.voteCount = await contract.methods.getLeaderboardMemberVoteCount(projectId, leaderboardId, i).call();
      memberObject.id = i;
      rows.push(memberObject);
    }
    rows.sort((a, b) => {
      if(a.voteCount < b.voteCount) return 1;
      if(a.voteCount > b.voteCount) return -1;
      return 0;
    });
    setMemberRows(rows);
  }

  const handleClick = async () => {
    let functionSignature = biconomyContract.methods
      .castVote(projectId, leaderboardId, member, tokenID)
      .encodeABI();

    let nonce = await contract.methods.getNonce(window.ethereum.selectedAddress).call();

    let messageToSign = constructMetaTransactionMessage(
      nonce,
      137,
      functionSignature,
      "0xe21e026ff9b4ad82e10ea25d248ecc5a647925ad"
    );

    const signature = await web3.eth.personal.sign(
      "0x" + messageToSign.toString("hex"), 
      window.ethereum.selectedAddress
    );

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

    // await contract.methods.castVote(projectId, leaderboardId, member, 10).send({ from: accounts[0] });
  }

  return ( 
    <Flex 
      flexDir="column" 
      align="center" 
      bgColor="black" 
      minH="100vh"
      pt={50}
    >
      <Flex alignSelf="flex-start" ml="10em" mb="5em">
        <Image src={ProjectPic} fit="none" />
        <Flex flexDir="column" ml={5} mt="2.7em">
          <Heading color="white">{projectName}</Heading>
          {/*
            <Text color="white" w="75%">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing fermentum in porttitor mauris ultrices nulla dui sagittis amet. Fames a odio vestibulum in nulla consectetur.
            </Text>
          */}
        </Flex>
      </Flex>
      <Heading mb={6} color="white" fontSize="24px" fontWeight={700}>{leaderboardName}</Heading>

      <Flex flexDir="column" mb={20}>

        <TableContainer borderRadius="10">
          <Table size='sm' variant="simple" colorScheme="gray" borderRadius={15}>
            <Thead bgColor="#BCBFF5">
              <Tr>
                <Th p={2.5} color="#0F1419" borderColor="#E1CFFF">Address</Th>
                <Th isNumeric p={2.5} color="#0F1419" borderColor="#E1CFFF">Vote Count</Th>
              </Tr>
            </Thead>
            <Tbody bgColor="#363636">
              {memberRows.map((row, index) => (
                <Tr key={index}>
                  <Td color="white" p={2.5} borderColor="#E1CFFF">{row.address}</Td>
                  <Td color="white" isNumeric p={2.5} borderColor="#E1CFFF">{row.voteCount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

      </Flex>

      <Flex flexDir="column" w={500}>
        <Heading mb={5} color="white" fontSize="24px" fontWeight={700}>Vote now</Heading>
        <Heading mb={2} color="white" fontSize="18px" fontWeight={700}>Address</Heading>
        <Input 
          placeholder="Enter the address of the project member you are voting for"
          mb={3}
          onChange={e => setMember(e.target.value)}
          textColor="gray"
        />
        <Heading mb={2} color="white" fontSize="18px" fontWeight={700}>Token ID number</Heading>
        <Input 
          placeholder="Enter your NFT's token ID number"
          mb={5}
          onChange={e => setTokenID(e.target.value)}
          textColor="gray"
        />
        <Button 
          onClick={handleClick}
          bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
          _hover={{
            bgGradient: 'linear(to-r, #93D9FF, #9EA0FE, #DE86FF, #FE7BE0)'
          }}
        >Cast vote</Button>
      </Flex>

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
 
export default LeaderboardIndividualNew;