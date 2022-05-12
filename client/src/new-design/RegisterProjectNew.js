import React, { useContext, useState, useEffect, useRef } from "react";
import { Web3Context } from "../Web3Context";

import { Input, Button, Flex, Heading, Text } from "@chakra-ui/react";

const RegisterProjectNew = () => {

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
    <Flex flexDir="column" mt="20vh" ml="6vw" mb={10} w={500}>
      <Heading mb={12} color="white" fontSize="40px" fontWeight={900}>Register Your Project</Heading>

      <Heading mb={4} color="white" fontSize="24px" fontWeight={700}>Project Name</Heading>
      <Input 
        borderColor="#848993"
        colorScheme="white"
        placeholder="BAYC"
        textColor="gray"
        mb={6}
        onChange={e => setProjectName(e.target.value)}
      />
      <Heading color="white" fontSize="24px" fontWeight={700}>NFT Contract Address</Heading>
      <Text color="#A7A7A7" fontSize="15px" mb={2}>Add your ERC-721 contract</Text>
      <Input 
        borderColor="#848993"
        placeholder="0x495f94...7b5e"
        onChange={e => setProjectAddress(e.target.value)}
        textColor="gray"
        mb={6}
      />
      <Heading color="white" fontSize="24px" fontWeight={700}>Description</Heading>
      <Text color="#A7A7A7" fontSize="15px" mb={2}>Add one or two sentences describing your project</Text>
      <Input 
        borderColor="#848993"
        placeholder="My project is..."
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
        Register project
      </Button>
    </Flex>
   );
}
 
export default RegisterProjectNew;