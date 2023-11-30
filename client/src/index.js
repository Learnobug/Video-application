import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { SocketProvider } from "./Context/SocketProvider";
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    
    <BrowserRouter>
      <SocketProvider>
      <ChakraProvider>
        <App />
        </ChakraProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
