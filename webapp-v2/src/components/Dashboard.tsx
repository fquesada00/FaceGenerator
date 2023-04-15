import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Container from '@mui/material/Container';

import { useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import { ToastContainer } from 'react-toastify';
import useLogout from 'hooks/useLogout';
import DrawerContent from './Drawer/DrawerContent';
import { CustomToastContainer } from './Toast';
import clsx from 'clsx';
import useAuth from 'hooks/useAuth';
import paths from 'routes/paths';

const Dashboard: React.FC<React.PropsWithChildren> = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const logout = useLogout();
  const navigate = useNavigate();

  const signOut = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const auth = useAuth();
  const { isAdmin } = auth;

  const handleSettings = useCallback(() => {
    navigate(paths.adminPanel.path);
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='absolute' open={open}>
        <Toolbar
          sx={{
            pr: '24px' // keep right padding when drawer closed
          }}
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
                md: 'block',
                lg: 'block',
                xl: 'block'
              }
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Face Generator
          </Typography>
          <div className='gap-4 flex'>
            <IconButton
              onClick={handleSettings}
              className={clsx(!isAdmin ? 'hidden' : '')}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={signOut}>
              <LogoutIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1]
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component='nav'>
          <DrawerContent />
        </List>
      </Drawer>
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          <Outlet />
          <CustomToastContainer />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
