import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Flex, Image } from "@chakra-ui/react";
import { Web3ContextProvider } from "../Web3Context";

import BgPhoto from "./bgphoto3.jpg";
import RegisterProjectNew from "./RegisterProjectNew";
import CreateLeaderboardNew from "./CreateLeaderboardNew";
import Home from "./Home";
import AllProjects from "./AllProjects";
import ProjectLeaderboardsNew from "./ProjectLeaderboardsNew";
import LeaderboardIndividualNew from "./LeaderboardIndividualNew";

const Main = () => {

  return ( 
    <Flex 
      flexDir="row" 
      bgColor="black" 
      minH="100vh"
    >
      <Flex
        flexDir="column"
        minW="50vw"
      >
        <Image src={BgPhoto} minH="100vh" fit="cover" />
      </Flex>
      <Flex
        flexDir="column"
        minW="50vw"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/all-projects" element={<AllProjects/>} />
            <Route path="/register-project" element={<RegisterProjectNew/>} />
            <Route path="/create-leaderboard" element={<CreateLeaderboardNew/>} />
            <Route path="/project/:projectId" element={<ProjectLeaderboardsNew/>} />
            <Route path="/leaderboard/:projectId/:leaderboardId" element={<LeaderboardIndividualNew/>} />
          </Routes> 
        </BrowserRouter>
      </Flex>
    </Flex>
   );
}
 
export default Main;