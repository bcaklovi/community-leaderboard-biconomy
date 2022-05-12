/*
import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../Web3Context";

import { Input, Button, Flex, Heading, Text } from "@chakra-ui/react";

const CreateLeaderboard = () => {

  const { web3, accounts, contract } = useContext(Web3Context);

  const [leaderboardName, setLeaderboardName] = useState();
  const [projectId, setProjectId] = useState();
  const [epoch, setEpoch] = useState();

  const [testNumber, setTestNumber] = useState();
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      const response = await contract.methods.getProjectLeaderboardCount(0).call();
      setTestNumber(response);
    }
  }, [isClicked]);

  const handleClick = async () => {
    await contract.methods.createLeaderboardNftRequired(projectId, leaderboardName, epoch, 1).send({ from: accounts[0] });
    setIsClicked(true);
  }

  return ( 
    <Flex flexDir="column" mt={3} mb={10} w={500}>
      <Heading mb={6} color="white" size="lg">Create a leaderboard</Heading>
      <Input 
        placeholder="Enter the project ID that you're creating a leaderboard for"
        onChange={e => setProjectId(e.target.value)}
        mb={2}
      />
      <Input 
        placeholder="Enter a name for this leaderboard"
        onChange={e => setLeaderboardName(e.target.value)}
        mb={2}
      />
      <Input 
        placeholder="Enter the epoch in days (how long this leaderboard lasts)"
        onChange={e => setEpoch(e.target.value)}
        mb={5}
      />
      <Button 
        onClick={handleClick}
        bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)'
        mb={3}
      >Create leaderboard</Button>
      <Text color="black" fontSize="sm" bgGradient='linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)' borderRadius={15} p={5} opacity={0.8}>
        Create a leaderboard for your project. Provide us with the project ID number, the leaderboard name and the epoch.
        The leaderboard name should describe the purpose of the leaderboard, such as: "Best Meme Creator".
        The epoch is how many days the leaderboard lasts before resetting and archiving the results.
      </Text>
    </Flex>
   );
}
 
export default CreateLeaderboard;
*/