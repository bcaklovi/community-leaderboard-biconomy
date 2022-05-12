/*
import React, { useContext, useState, useEffect, useRef } from "react";
import { Web3Context } from "../Web3Context";

import { Input, Button, Flex, Heading, Text } from "@chakra-ui/react";

const RegisterProject = () => {

  const { web3, accounts, contract } = useContext(Web3Context);

  const [projectName, setProjectName] = useState();
  const [projectAddress, setProjectAddress] = useState();

  const [testName, setTestName] = useState();
  const [isClicked, setIsClicked] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const getInitialData = async () => {
      const response = await contract.methods.getProjectName(0).call();
      setTestName(response);
    }
    getInitialData();
  }, [isClicked]);

  const handleClick = async () => {
    await contract.methods.registerProject(projectAddress, projectName).send({ from: accounts[0] });
    setIsClicked(true);
  }

  return ( 
    <Flex flexDir="column" mt={3} mb={10} w={500}>
      <Heading mb={6} color="white" size="lg">Register your project</Heading>
      <Input 
        colorScheme="white"
        placeholder="Enter the project name"
        mb={2}
        onChange={e => setProjectName(e.target.value)}
      />
      <Input 
        placeholder="Enter the NFT contract address"
        onChange={e => setProjectAddress(e.target.value)}
        mb={5}
      />
      <Button 
        onClick={handleClick}
        bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
        mb={5}
      >
        Register project
      </Button>
      <Text color="black" fontSize="sm" bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)' borderRadius={15} p={5} opacity={0.8}>
        In order to be able to create leaderboards, you must first register your project. 
        Please provide us with the address of your ERC-721 contract, the name of your project, a picture or logo and a short, one-sentence description.
      </Text>
    </Flex>
   );
}
 
export default RegisterProject;
*/