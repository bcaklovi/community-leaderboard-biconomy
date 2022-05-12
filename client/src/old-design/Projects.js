/*
import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../Web3Context";

import { Flex, Link, Heading } from "@chakra-ui/react";

const Projects = () => {

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
      project.leaderboardCount = await contract.methods.getProjectLeaderboardCount(i).call();
      project.id = i;
      setProjects(prev => [...prev, project]);
    }
    console.log(projects);
  }

  // or just call function after value is loaded and avoid using useEffect
  // useEffect(async () => {
  //   for(let i = 0; i < projectCount; i++) {
  //     let project = await contract.methods.getProjectName(i).call();
  //     setProjects(prev => [...prev, project]);
  //   }
  //   console.log(projects);
  // }, [projectCount]);

  return ( 
    <Flex flexDir="column" mt={3} mb={10} w={500}>
      <Heading mb={6} color="white" size="lg">All projects</Heading>
      {projects && projects.map((project, index) => (
        <Link href={"/project/" + project.id} key={index}>
          <Flex color="white" fontWeight="bold">{project.name} | {project.leaderboardCount}</Flex>
        </Link>
      ))}
    </Flex>
   );
}
 
export default Projects;
*/