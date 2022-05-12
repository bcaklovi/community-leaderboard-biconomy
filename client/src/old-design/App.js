/*
import React, { useState, useEffect, createContext } from "react";

import RegisterProject from "./views/RegisterProject";

import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Divider } from "@chakra-ui/react";
import CreateLeaderboard from "./views/CreateLeaderboard";
import Projects from "./views/Projects";
import { Web3ContextProvider } from "./Web3Context";

const App = () => {

  return ( 
    <Flex 
      flexDir="column" 
      align="center" 
      bgColor="black" 
      minH="100vh"
      pt={50}
    >
      <Tabs variant='soft-rounded'>
        <TabList>
          <Tab _selected={{color: "#C6C7FF", fontWeight: 800 }} color="white" fontWeight={700}>Register Project</Tab>
          <Tab _selected={{color: "#C6C7FF", fontWeight: 800 }} color="white" fontWeight={700}>Create Leaderboard</Tab>
          <Tab _selected={{color: "#C6C7FF", fontWeight: 800 }} color="white" fontWeight={700}>All Projects</Tab>
        </TabList>

        <Divider borderColor="#C6C7FF" />

        <TabPanels>
          <TabPanel>
            <RegisterProject />
          </TabPanel>
          <TabPanel>
            <CreateLeaderboard />
          </TabPanel>
          <TabPanel>
            <Projects />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
   );
}
 
export default App;
*/