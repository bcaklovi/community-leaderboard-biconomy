import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../Web3Context";

import { Flex, Link, Heading, Table, TableContainer, Thead, Tr, Td, Th, Tbody, Tfoot } from "@chakra-ui/react";

const AllProjects = () => {

  const { web3, accounts, contract } = useContext(Web3Context);

  const [projectCount, setProjectCount] = useState();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getInitialData = async () => {
      const response = await contract.methods.projectCount().call();
      setProjectCount(response);
      getProjects(response);
    }
    getInitialData();
  }, []);

  const getProjects = async (num) => {
    for(let i = 0; i < num; i++) {
      let project = {};
      project.name = await contract.methods.getProjectName(i).call();
      project.leaderboardCount = await contract.methods.getProjectepochCount(i).call();
      project.id = i;
      setProjects(prev => [...prev, project]);
    }
    console.log(projects);
  }

  return ( 
    <Flex flexDir="column" mt="12em" ml="5em" mb={10} w={500}>
      <Heading mb={6} color="white" size="lg">All Projects</Heading>

      <TableContainer borderRadius="10">
        <Table size='sm' variant="simple" colorScheme="gray" borderRadius={15}>
          <Thead bgColor="#BCBFF5">
            <Tr>
              <Th p={3} color="#0F1419" borderColor="#E1CFFF">Project Name</Th>
              <Th isNumeric p={3} color="#0F1419" borderColor="#E1CFFF">Leaderboard Count</Th>
              <Th isNumeric p={3} color="#0F1419" borderColor="#E1CFFF">Project ID</Th>
            </Tr>
          </Thead>
          <Tbody bgColor="#363636">
            {projects && projects.map((project, index) => (
              <Tr key={index}>
                <Td color="white" p={5} borderColor="#E1CFFF"><Link href={"/project/" + project.id}>{project.name}</Link></Td>
                <Td color="white" isNumeric p={5} borderColor="#E1CFFF">{project.leaderboardCount}</Td>
                <Td color="white" isNumeric p={5} borderColor="#E1CFFF">{project.id}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
   );
}
 
export default AllProjects;