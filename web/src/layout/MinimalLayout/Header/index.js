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
import { Grid, Space, Card } from '@arco-design/web-react';
import LogoSection from '@/layout/MainLayout/LogoSection';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeButton from '@/ui-component/ThemeButton';
import I18nButton from '@/ui-component/i18nButton';
import ContactButton from '@/ui-component/ContactButton';
import ProfileSection from '@/layout/MainLayout/Header/ProfileSection';
import { IconMenu2 } from '@tabler/icons-react';
import Transitions from '@/ui-component/extended/Transitions';
import MainCard from '@/ui-component/cards/MainCard';
import { useMediaQuery } from '@mui/material';
import { Button } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import styled from './style.module.scss';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [open, setOpen] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const handleOpenMenu = (event) => {
    setOpen(open ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <Grid.Row style={{ width: '100%' }} align="center" justify="space-around">
        <Grid.Col flex={'150px'}>
          <LogoSection />
        </Grid.Col>
        <Grid.Col flex={'auto'}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            {isMobile ? (
              <Space size={16}>
                <ThemeButton />
                <I18nButton />
                <IconButton onClick={handleOpenMenu}>
                  <IconMenu2 />
                </IconButton>
              </Space>
            ) : (
              <Space size={16}>
                <Button onClick={() => navigate('/')} type={pathname === '/' ? 'primary' : 'text'}>
                  {t('menu.home')}
                </Button>
                {account.user && (
                  <Button onClick={() => navigate('/playground')} type={pathname === '/playground' ? 'primary' : 'text'}>
                    Playground
                  </Button>
                )}
                <Button onClick={() => navigate('/about')} type={pathname === '/about' ? 'primary' : 'text'}>
                  {t('menu.about')}
                </Button>
                <ContactButton />
                <ThemeButton />
                <I18nButton />
                {account.user ? (
                  <>
                    <Button type={'outline'} onClick={() => navigate('/panel/dashboard')}>
                      {t('menu.console')}
                    </Button>
                    <ProfileSection />
                  </>
                ) : (
                  <Button onClick={() => navigate('/login')} type="primary">
                    {t('menu.login')}
                  </Button>
                )}
              </Space>
            )}
          </div>
        </Grid.Col>
      </Grid.Row>
      {/* <Popper
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
                      <ListItemText primary={<Typography variant="body2">{t('menu.home')}</Typography>} />
                    </ListItemButton>

                    {account.user && (
                      <ListItemButton component={Link} variant="text" to="/playground">
                        <ListItemText primary={<Typography variant="body2">Playground</Typography>} />
                      </ListItemButton>
                    )}

                    <ListItemButton component={Link} variant="text" to="/about">
                      <ListItemText primary={<Typography variant="body2">{t('menu.about')}</Typography>} />
                    </ListItemButton>
                    <Divider />
                    {account.user ? (
                      <>
                        <ListItemButton component={Link} variant="contained" to="/panel" color="primary">
                          {t('menu.console')}
                        </ListItemButton>
                      </>
                    ) : (
                      <ListItemButton component={Link} variant="contained" to="/login" color="primary">
                        {t('menu.login')}
                      </ListItemButton>
                    )}
                  </List>
                </MainCard>
              </Paper>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper> */}
    </>
  );
};

export default Header;
