import { useState, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, ClickAwayListener, List, ListItemButton, ListItemIcon, ListItemText, Paper, Popper } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import Transitions from '@/ui-component/extended/Transitions';
import User1 from '@/assets/images/users/user-round.svg';
import useLogin from '@/hooks/useLogin';

// assets
import { IconLogout, IconSettings, IconUserScan, IconLicense } from '@tabler/icons-react';
import { showError, showSuccess } from '@/utils/common';
import { API } from '@/utils/api';
import CheckInModal from '@/ui-component/CheckInModal';

import { useTranslation } from 'react-i18next';
import { Modal, Dropdown, Avatar, Menu, Space, Typography } from '@arco-design/web-react';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const customization = useSelector((state) => state.customization);
  const { logout } = useLogin();

  const [open, setOpen] = useState(false);
  const [checkinModalVisible, setCheckinModalVisible] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    logout();
  };

  const handleUserOperationCheckIn = async () => {
    try {
      let res = await API.post(`/api/operation/checkin`);
      const { success, message } = res.data;
      if (success) {
        showSuccess(message);
      } else {
        showError(message);
      }
    } catch (error) {}
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  function onMenuClick(key) {
    if (key === 'menu.setting') {
      navigate('/panel/profile');
    }
    if (key === 'menu.checkin') {
      // handleUserOperationCheckIn();
      setCheckinModalVisible(true);
    }
    if (key === 'menu.signout') {
      handleLogout();
    }
  }

  const droplist = (
    <Menu onClickMenuItem={onMenuClick}>
      <Menu.Item key="menu.setting">
        <Space>
          <IconUserScan stroke={1.5} size="1.3rem" />
          <Typography.Text>{t('setting')}</Typography.Text>
        </Space>
      </Menu.Item>
      <Menu.Item key="menu.checkin">
        <Space>
          <IconLicense stroke={1.5} size="1.3rem" />
          立即签到
        </Space>
      </Menu.Item>
      <Menu.Item key="menu.signout">
        <Space>
          <IconLogout stroke={1.5} size="1.3rem" />
          {t('menu.signout')}
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <CheckInModal
        visible={checkinModalVisible}
        onCancel={() => setCheckinModalVisible(false)}
        onClose={() => setCheckinModalVisible(false)}
      />
      <Dropdown icon={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />} droplist={droplist} position="br">
        <Avatar size={32} src={User1} ref={anchorRef} aria-controls={open ? 'menu-list-grow' : undefined}>
          <img width={32} height={32} alt="avatar" src={User1} />
        </Avatar>
      </Dropdown>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
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
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      maxWidth: 350,
                      minWidth: 150,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: '10px',
                      [theme.breakpoints.down('md')]: {
                        minWidth: '100%'
                      },
                      '& .MuiListItemButton-root': {
                        mt: 0.5
                      }
                    }}
                  >
                    <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={() => navigate('/panel/profile')}>
                      <ListItemIcon>
                        <IconUserScan stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2">{t('setting')}</Typography>} />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }}>
                      <ListItemIcon>
                        <IconLicense stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <BaseCheckin></BaseCheckin>
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleLogout}>
                      <ListItemIcon>
                        <IconLogout stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2">{t('menu.signout')}</Typography>} />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
