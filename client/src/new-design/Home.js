import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Icon, Image, Button, Flex, Heading, Text } from "@chakra-ui/react";

import Welcome from "./welcome.png";
import LinkIcon from "./link-dynamic-gradient.png";
import { FaChevronRight, FaLink } from "react-icons/fa";
import { IoRocket, IoPodium } from "react-icons/io5";


const Home = () => {
  
  let navigate = useNavigate();

  return ( 
    <Flex flexDir="column" mt="8.5em" ml="6vw" mb={10} w={500}>
      <Image src={Welcome} maxW="25vw" mb="9vh" />
      <Flex flexDir="column" >
        {/* First button */}
        <Flex 
          minW="18vw" 
          minH="9vh"
          mb="2.5em"
          bg="#363636" 
          borderRadius={15}
          boxShadow="0px 4px 8px 4px #FEFEED40"
          onClick={() => { navigate("/all-projects/") }}
          _hover={{
            boxShadow: "0px 0px 8px 4px rgba(217, 179, 250, 0.6)"
          }}
        >
          <Flex ml={8} align="center">
            <Flex 
              borderRadius="50%" 
              borderWidth="1px"
              borderColor="gray"
              p="0.7em" 
              bgGradient="linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)"
              boxShadow="0px 2px 3px 1px #FEFEED40"
            >
              <Icon as={IoPodium} color="white" boxSize="1.5em" />
            </Flex>
          </Flex>
          <Flex 
            flexDir="column" 
            ml="5vw" 
            w="9.5em"
            fontWeight={700} 
            fontSize="20px"
            color="white" 
            justify="center"
          >
            View all projects
          </Flex>
          <Flex
            w="5.5em"
            fontWeight={900} 
            fontSize="20px"
            color="white" 
            justifyContent="flex-end"
            align="center"
          >
            <Icon as={FaChevronRight} color="white" />
          </Flex>
        </Flex>

        {/* Second button */}
        <Flex 
          minW="18vw" 
          minH="9vh"
          mb="2.5em"
          bg="#363636" 
          borderRadius={15}
          boxShadow="0px 4px 8px 4px #FEFEED40"
          onClick={() => { navigate("/register-project/") }}
          _hover={{
            boxShadow: "0px 0px 8px 4px rgba(217, 179, 250, 0.6)"
          }}
        >
          <Flex ml={8} align="center">
            <Flex 
              borderRadius="50%" 
              borderWidth="1px"
              borderColor="gray"
              p="0.7em" 
              bgGradient="linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)"
              boxShadow="0px 2px 3px 1px #FEFEED40"
            >
              <Icon as={FaLink} color="white" boxSize="1.5em" />
            </Flex>
          </Flex>
          <Flex 
            flexDir="column" 
            ml="5vw" 
            w="9.5em"
            fontWeight={700} 
            fontSize="20px"
            color="white" 
            justify="center"
          >
            Register project
          </Flex>
          <Flex
            w="5.5em"
            fontWeight={900} 
            fontSize="20px"
            color="white" 
            justifyContent="flex-end"
            align="center"
          >
            <Icon as={FaChevronRight} color="white" />
          </Flex>
        </Flex>

        {/* Third button */}
        <Flex 
          minW="18vw" 
          minH="9vh"
          bg="#363636" 
          borderRadius={15}
          boxShadow="0px 4px 8px 4px #FEFEED40"
          onClick={() => { navigate("/create-leaderboard/") }}
          _hover={{
            boxShadow: "0px 0px 8px 4px rgba(217, 179, 250, 0.6)"
          }}
        >
          <Flex ml={8} align="center">
            <Flex 
              borderRadius="50%" 
              borderWidth="1px"
              borderColor="gray"
              p="0.7em" 
              bgGradient="linear(to-r, #B5E5FF, #C6C7FF, #E1A9F6, #F9ABE7)"
              boxShadow="0px 2px 3px 1px #FEFEED40"
            >
              <Icon as={IoRocket} color="white" boxSize="1.5em" />
            </Flex>
          </Flex>
          <Flex 
            flexDir="column" 
            ml="5vw" 
            w="9.5em"
            fontWeight={700} 
            fontSize="20px"
            color="white" 
            justify="center"
          >
            Create leaderboard
          </Flex>
          <Flex
            w="5.5em"
            fontWeight={900} 
            fontSize="20px"
            color="white" 
            justifyContent="flex-end"
            align="center"
          >
            <Icon as={FaChevronRight} color="white" />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Home;