import React from 'react';
import Router from './Router';
import GlobalStyles from './GlobalStyles';
import { UserProvider } from '../context';

function App() {
  return (
    <UserProvider>
      <GlobalStyles />
      <Router />
    </UserProvider>
  );
}

export default App;
