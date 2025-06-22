import React from 'react';
import { createRoot } from 'react-dom/client';
import GraphComponent from './components/GraphComponent';
import './graphViewStyles.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<GraphComponent />); 