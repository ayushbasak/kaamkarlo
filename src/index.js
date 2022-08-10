import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain='ayushbasak.us.auth0.com'
      clientId='BSqWhn6MjZN8qkRYZmw0sVfVIj1L73ZL'
      redirectUri={window.location.origin}
    >
      <ChakraProvider>
        <ColorModeScript initialColorMode="dark"/>
          <App />
      </ChakraProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
