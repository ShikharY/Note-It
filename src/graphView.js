import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import GraphComponent from "./components/GraphComponent";
import { createRoot } from "react-dom/client";

const theme = createTheme({
  /** Put your mantine theme override here */
});

// Add global style for dark background and white text everywhere
const globalStyle = `
  body, #root {
    background: #1A1A1A !important;
    color: #fff !important;
  }
  *, *::before, *::after {
    color: #fff !important;
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('graphview-global-style')) {
  const style = document.createElement('style');
  style.id = 'graphview-global-style';
  style.innerHTML = globalStyle;
  document.head.appendChild(style);
}

function GraphViewApp() {
  const [colorScheme, setColorScheme] = useState("dark");
  return (
    <React.StrictMode>
      <MantineProvider theme={theme} colorScheme={colorScheme} defaultColorScheme="dark">
        <GraphComponent colorScheme={colorScheme} setColorScheme={setColorScheme} />
      </MantineProvider>
    </React.StrictMode>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<GraphViewApp />);
}
