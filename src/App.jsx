import React from 'react';
import Router from './components/Router';
import GlobalStyles from './components/GlobalStyles';
import { UserProvider } from './context';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <GlobalStyles />
        <Router />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
