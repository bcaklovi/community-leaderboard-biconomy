import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Web3Context } from "../Web3Context";

import { Flex, Link, Heading, Table, TableContainer, Thead, Tr, Td, Th, Tbody, Tfoot } from "@chakra-ui/react";

const ProjectLeaderboardsNew = () => {

  const { projectId } = useParams();

  const { web3, accounts, contract } = useContext(Web3Context);

  const [projectName, setProjectName] = useState();
  const [leaderboardCount, setLeaderboardCount] = useState();
  const [leaderboards, setLeaderboards] = useState([]);

  useEffect(() => {
    const getInitialData = async () => {
      const projectNameResponse = await contract.methods.getProjectName(projectId).call();
      const leaderboardCountResponse = await contract.methods.getProjectepochCount(projectId).call();
      setProjectName(projectNameResponse);
      setLeaderboardCount(leaderboardCountResponse);
      getLeaderboards(leaderboardCountResponse);
    }
    getInitialData();
  }, []);

  const getLeaderboards = async (num) => {
    for(let i = 0; i < num; i++) {
      let leaderboard = {};
      leaderboard.name = await contract.methods.getLeaderboardName(projectId, i).call();
      leaderboard.id = i;
      setLeaderboards(prev => [...prev, leaderboard]);
    }
  }

  return ( 
    <Flex flexDir="column" mt="12em" ml="5em" mb={10} w={500}>
      <Heading mb={6} color="white" size="lg">{projectName} Leaderboards</Heading>

      <TableContainer borderRadius="10">
        <Table size='sm' variant="simple" colorScheme="gray" borderRadius={15}>
          <Thead bgColor="#BCBFF5">
            <Tr>
              <Th p={3} color="#0F1419" borderColor="#E1CFFF">Leaderboard Name</Th>
              <Th isNumeric p={3} color="#0F1419" borderColor="#E1CFFF">Leaderboard ID</Th>
            </Tr>
          </Thead>
          <Tbody bgColor="#363636">
            {leaderboards && leaderboards.map((leaderboard, index) => (
              <Tr key={index}>
                <Td color="white" p={5} borderColor="#E1CFFF"><Link href={`/leaderboard/${projectId}/${leaderboard.id}`}>{leaderboard.name}</Link></Td>
                <Td color="white" isNumeric p={5} borderColor="#E1CFFF">{leaderboard.id}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
   );
}

export default ProjectLeaderboardsNew;
 
