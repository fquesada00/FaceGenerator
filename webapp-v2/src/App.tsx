import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import router from './router';
import mdTheme from './theme';
import AuthProvider from 'context/AuthProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
