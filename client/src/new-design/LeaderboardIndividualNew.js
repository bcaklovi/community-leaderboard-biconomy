import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Web3Context } from "../Web3Context";

import { Flex, Input, Button, Table, TableContainer, Thead, Tr, Td, Th, Tbody, Tfoot, Heading, Image, Text } from "@chakra-ui/react";

import ProjectPic from "./project-pic.png";

const LeaderboardIndividualNew = () => {

  const { projectId, leaderboardId } = useParams();
  const { web3, accounts, contract } = useContext(Web3Context);

  const [projectName, setProjectName] = useState();

  const [leaderboardName, setLeaderboardName] = useState();
  const [leaderboardLength, setLeaderboardLength] = useState();
  const [memberRows, setMemberRows] = useState([]);

  const [member, setMember] = useState();
  const [tokenID, setTokenID] = useState();

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
    await contract.methods.castVote(projectId, leaderboardId, member, 10).send({ from: accounts[0] });
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
        <Flex flexDir="column" ml={5}>
          <Heading color="white">{projectName}</Heading>
          <Text color="white" w="75%">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing fermentum in porttitor mauris ultrices nulla dui sagittis amet. Fames a odio vestibulum in nulla consectetur.</Text>
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
        {/*
        <Heading mb={2} color="white" fontSize="18px" fontWeight={700}>Token ID number</Heading>
        <Input 
          placeholder="Enter your NFT's token ID number"
          onChange={e => setTokenID(e.target.value)}
          mb={5}
        />
        */}
        <Button 
          onClick={handleClick}
          bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
          _hover={{
            bgGradient: 'linear(to-r, #93D9FF, #9EA0FE, #DE86FF, #FE7BE0)'
          }}
        >Cast vote</Button>
      </Flex>
    </Flex>
   );
}
 
export default LeaderboardIndividualNew;