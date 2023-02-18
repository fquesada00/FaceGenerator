import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import router from './router';
import mdTheme from './theme';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider theme={mdTheme}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
