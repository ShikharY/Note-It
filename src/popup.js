import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
); 