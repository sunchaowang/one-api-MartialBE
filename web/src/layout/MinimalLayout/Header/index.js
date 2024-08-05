// material-ui
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Popper, List, ListItemButton, Paper, ListItemText, Divider, ClickAwayListener } from '@mui/material';
import { Grid, Space, Row, Col, Menu } from 'antd';
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
import { Button, Dropdown, Typography } from 'antd';
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

  const onClickMenuItem = (key) => {
    switch (key) {
      case 'menu.home':
        navigate('/');
        return;
      case 'menu.playground':
        navigate('/playground');
        return;
      case 'menu.about':
        navigate('/about');
        return;
      case 'menu.console':
        navigate('/panel/dashboard');
        return;
      case 'menu.login':
        navigate('/login');
        return;
      default:
        return;
    }
  };

  const renderDropMenuList = (
    <Menu
      onClickMenuItem={onClickMenuItem}
      style={{
        width: '100vw'
      }}
    >
      <Menu.Item key={'menu.home'}>
        <Typography.Text variant="body2">{t('menu.home')}</Typography.Text>
      </Menu.Item>

      <Menu.Item key={'menu.about'}>
        <Typography.Text variant="body2">{t('menu.about')}</Typography.Text>
      </Menu.Item>
      {account.user ? (
        [
          <Menu.Item key={'menu.playground'}>
            <Typography.Text>Playground</Typography.Text>
          </Menu.Item>,
          <Menu.Item key={'menu.console'}>
            <Typography.Text variant="body2">{t('menu.console')}</Typography.Text>
          </Menu.Item>
        ]
      ) : (
        <Menu.Item key={'menu.login'}>
          <Typography.Text variant="body2">{t('menu.login')}</Typography.Text>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <Row style={{ width: '100%' }} align="middle" justify="space-around">
        <Col flex={'150px'}>
          <LogoSection />
        </Col>
        <Col flex={'auto'}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            {isMobile ? (
              <Space size={16}>
                {/*<ThemeButton />*/}
                <I18nButton />
                <Dropdown droplist={renderDropMenuList}>
                  <Button shape={'circle'}>
                    <IconMenu2 className={'arco-icon'} />
                  </Button>
                </Dropdown>
                {/*<Button shape={'circle'} onClick={handleOpenMenu}></Button>*/}
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
                {/*<ThemeButton />*/}
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
        </Col>
      </Row>
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
      </Popper>
    </>
  );
};

export default Header;
