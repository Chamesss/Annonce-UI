import React from 'react';
import ReactDOM from 'react-dom/client';
import './modern-normalize.css';
import './index.css';
import './styles/button.css'
import './styles/input.css'
import './styles/spinner.css'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);