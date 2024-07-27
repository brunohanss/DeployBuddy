import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: {
    100: '#29B9D9',
    200: '#F2F2EB',
    300: '#F27405',
    400: '#F23322',
    500: '#400101',
  },
};

const theme = extendTheme({ colors });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <ChakraProvider theme={theme}>
    <App /></ChakraProvider>
  </React.StrictMode>,
);
