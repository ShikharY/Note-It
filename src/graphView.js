import React from "react";
import ReactDOM from "react-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import GraphComponent from "./components/GraphComponent";

const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <GraphComponent />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
