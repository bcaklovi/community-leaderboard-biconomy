/*
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Web3Context } from "../Web3Context";

import { Flex, Link, Heading } from "@chakra-ui/react";

const ProjectLeaderboards = () => {
  
  const { projectId } = useParams();

  const { web3, accounts, contract } = useContext(Web3Context);

  const [projectName, setProjectName] = useState();
  const [leaderboardCount, setLeaderboardCount] = useState();
  const [leaderboards, setLeaderboards] = useState([]);

  useEffect(() => {
    const getInitialData = async () => {
      const projectNameResponse = await contract.methods.getProjectName(projectId).call();
      const leaderboardCountResponse = await contract.methods.getProjectLeaderboardCount(projectId).call();
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
    <Flex 
      flexDir="column" 
      align="center" 
      bgColor="black" 
      minH="100vh"
      pt={50}
    >
      <Heading mb={3} color="white" size="lg">{projectName}</Heading>
      <Heading mb={6} color="white" size="md">Leaderboards</Heading>
      {leaderboards && leaderboards.map((leaderboard, index) => (
        <Link href={`/leaderboard/${projectId}/${leaderboard.id}`} key={index}><Flex color="white">{leaderboard.name}</Flex></Link>
      ))}
    </Flex>
   );
}
 
export default ProjectLeaderboards;
*/