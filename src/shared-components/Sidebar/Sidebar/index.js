import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import { ListItemButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import './style.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { text: 'Dashboard', icon: <HomeIcon sx={{ color: '#025318' }} />, path: '/dashboard' },
    { text: 'Loans', icon: <MonetizationOnIcon sx={{ color: '#025318' }} />, path: '/loans' },
    { text: 'Members', icon: <PeopleIcon sx={{ color: '#025318' }} />, path: '/members' },
    { text: 'Banks', icon: <AccountBalanceIcon sx={{ color: '#025318' }} />, path: '/banks' },
  ];

  const logoutItem = {
    text: 'Logout',
    icon: <LogoutIcon sx={{ color: '#025318' }} />,
    path: '/logout',
  };

  return (
    <Box
      className="sidebar"
      sx={{
        width: 250,
        height: '97vh',
        backgroundColor: '#011204',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}>
        <img
          src="/logo_agricreds.svg"
          alt="Agricreds Logo"
          style={{ width: 50, height: 50, marginRight: 8 }}
        />
        <Typography variant="h6" sx={{ fontSize: 30 }}>
          Agricreds
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <nav>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: location.pathname === item.path ? '#ffffff' : 'transparent',
                  '&:hover': {
                    backgroundColor: location.pathname === item.path ? '#ffffff' : '#02531833',
                  },
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? '#011204' : '#ffffff',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#025318',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </nav>
        <Box sx={{ flexGrow: 1 }} />
        <nav>
          <List>
            <ListItemButton
              component={Link}
              to={logoutItem.path}
              sx={{
                backgroundColor: location.pathname === logoutItem.path ? '#ffffff' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === logoutItem.path ? '#ffffff' : '#02531833',
                },
                '& .MuiListItemText-primary': {
                  color: location.pathname === logoutItem.path ? '#011204' : '#ffffff',
                },
                '& .MuiListItemIcon-root': {
                  color: '#025318',
                },
              }}
            >
              <ListItemIcon>{logoutItem.icon}</ListItemIcon>
              <ListItemText primary={logoutItem.text} />
            </ListItemButton>
          </List>
        </nav>
      </Box>
    </Box>
  );
};

export default Sidebar;