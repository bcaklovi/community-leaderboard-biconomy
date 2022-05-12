import React from "react";
import { render } from "react-dom";

import { Web3ContextProvider } from "./Web3Context";

import { ChakraProvider } from "@chakra-ui/react";
import Main from "./new-design/Main";
import theme from "./theme";

const rootElement = document.getElementById("root");

render(
  <ChakraProvider theme={theme}>
    <Web3ContextProvider>
      <Main />
    </Web3ContextProvider>
  </ChakraProvider>,
  rootElement
);

/* Old design router
render(
  <ChakraProvider>
    <Web3ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/project/:projectId" element={<ProjectLeaderboards/>} />
          <Route path="/leaderboard/:projectId/:leaderboardId" element={<LeaderboardIndividual/>} />
        </Routes> 
      </BrowserRouter>
    </Web3ContextProvider>
  </ChakraProvider>,
  rootElement
);
*/
