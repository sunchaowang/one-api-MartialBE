// material-ui
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Popper,
  IconButton,
  List,
  ListItemButton,
  Paper,
  ListItemText,
  Typography,
  Divider,
  ClickAwayListener
} from '@mui/material';
import LogoSection from '@/layout/MainLayout/LogoSection';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeButton from '@/ui-component/ThemeButton';
import ContactButton from '@/ui-component/ContactButton';
import ProfileSection from '@/layout/MainLayout/Header/ProfileSection';
import { IconMenu2 } from '@tabler/icons-react';
import Transitions from '@/ui-component/extended/Transitions';
import MainCard from '@/ui-component/cards/MainCard';
import { useMediaQuery } from '@mui/material';
import { Button } from 'antd';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [open, setOpen] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenMenu = (event) => {
    setOpen(open ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ flexGrow: 1 }}>
          <LogoSection />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
        {isMobile ? (
          <>
            <ThemeButton />
            <IconButton onClick={handleOpenMenu}>
              <IconMenu2 />
            </IconButton>
          </>
        ) : (
          <>
            <Button variant="text" onClick={() => navigate('/')} type={pathname === '/' ? 'link' : 'text'}>
              首页
            </Button>
            {account.user && (
              <Button variant="text" onClick={() => navigate('/playground')} type={pathname === '/playground' ? 'link' : 'text'}>
                Playground
              </Button>
            )}
            <Button variant="text" onClick={() => navigate('/about')} type={pathname === '/about' ? 'link' : 'text'}>
              关于
            </Button>
            <ContactButton />
            <ThemeButton />
            {account.user ? (
              <>
                <Button type="primary" variant="contained" onClick={() => navigate('/panel/dashboard')} color="primary">
                  控制台
                </Button>
                <ProfileSection />
              </>
            ) : (
              <Button component={Link} variant="contained" onClick={() => navigate('/login')} color="primary">
                登录
              </Button>
            )}
          </>
        )}
      </Stack>

      <Popper
        open={!!open}
        anchorEl={open}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
        style={{ width: '100vw' }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <Paper style={{ width: '100%' }}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      minWidth: '100%',
                      backgroundColor: theme.palette.background.paper,

                      '& .MuiListItemButton-root': {
                        mt: 0.5
                      }
                    }}
                    onClick={handleCloseMenu}
                  >
                    <ListItemButton component={Link} variant="text" to="/">
                      <ListItemText primary={<Typography variant="body2">首页</Typography>} />
                    </ListItemButton>

                    {account.user && (
                      <ListItemButton component={Link} variant="text" to="/playground">
                        <ListItemText primary={<Typography variant="body2">Playground</Typography>} />
                      </ListItemButton>
                    )}

                    <ListItemButton component={Link} variant="text" to="/about">
                      <ListItemText primary={<Typography variant="body2">关于</Typography>} />
                    </ListItemButton>
                    <Divider />
                    {account.user ? (
                      <>
                        <ListItemButton component={Link} variant="contained" to="/panel" color="primary">
                          控制台
                        </ListItemButton>
                      </>
                    ) : (
                      <ListItemButton component={Link} variant="contained" to="/login" color="primary">
                        登录
                      </ListItemButton>
                    )}
                  </List>
                </MainCard>
              </Paper>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default Header;
