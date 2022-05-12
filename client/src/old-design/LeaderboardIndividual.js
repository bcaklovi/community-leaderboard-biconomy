/*
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Web3Context } from "../Web3Context";

import { Flex, Input, Button, Table, TableContainer, Thead, Tr, Td, Th, Tbody, Tfoot } from "@chakra-ui/react";

const LeaderboardIndividual = () => {

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
    await contract.methods.castVote(projectId, leaderboardId, member, tokenID).send({ from: accounts[0] });
  }

  return ( 
    <Flex 
      flexDir="column" 
      align="center" 
      bgColor="black" 
      minH="100vh"
      pt={50}
    >
      <Flex mb={1} color="white" fontWeight={700} fontSize="lg">{projectName}</Flex>
      <Flex mb={10} color="white">Project ID: {projectId}</Flex>
      <Flex mb={5} color="white" fontWeight={700} fontSize="lg">{leaderboardName}</Flex>
      <Flex flexDir="column" mb={20}>
      <TableContainer>
        <Table size='sm' variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th isNumeric>Vote Count</Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberRows.map((row, index) => (
            <Tr key={index}>
              <Td color="white">{row.address}</Td>
              <Td color="white" isNumeric>{row.voteCount}</Td>
            </Tr>
          ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Address</Th>
              <Th isNumeric>Vote Count</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      </Flex>
      <Flex flexDir="column" w={500}>
        <Input 
          placeholder="Enter the address of the project member you are voting for"
          onChange={e => setMember(e.target.value)}
        />
        <Input 
          placeholder="Enter your NFT's token ID number"
          onChange={e => setTokenID(e.target.value)}
          mb={5}
        />
        <Button 
          onClick={handleClick}
          bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
        >Cast vote</Button>
      </Flex>
    </Flex>
   );
}
 
export default LeaderboardIndividual;
*/