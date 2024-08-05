import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, useMediaQuery } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import ThemeButton from '@/ui-component/ThemeButton';
import ContactButton from '@/ui-component/ContactButton';
import I18nButton from '@/ui-component/i18nButton';
import styled from './style.module.scss';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import { Grid, Space, Card, Button } from '@arco-design/web-react';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';
import { useDispatch, useSelector } from 'react-redux';
import { SET_MENU } from '@/store/actions';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle, showLogo = true, showMenuCollapse = false }) => {
  const theme = useTheme();
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();

  function onCollapseChange(colapsed) {
    console.log('collapsed', colapsed);
    dispatch({ type: SET_MENU, opened: !colapsed });
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <div className={'header-left'} style={{ width: 'max-content', flex: 1, display: 'flex' }}>
        {showLogo && <LogoSection />}
        {showMenuCollapse && (
          <Button shape={'circle'} type={'primary'} onClick={() => onCollapseChange(leftDrawerOpened)}>
            {!leftDrawerOpened ? <IconMenuUnfold></IconMenuUnfold> : <IconMenuFold></IconMenuFold>}
          </Button>
        )}
      </div>
      {/* logo & toggler button */}

      <div className={'header-right'} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Space size={16}>
          <ContactButton />
          {/*<ThemeButton />*/}
          <I18nButton />
          <ProfileSection />
        </Space>
      </div>
      {/*<ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>*/}
      {/*  <Avatar*/}
      {/*    variant="rounded"*/}
      {/*    sx={{*/}
      {/*      ...theme.typography.commonAvatar,*/}
      {/*      ...theme.typography.mediumAvatar,*/}
      {/*      ...theme.typography.menuButton,*/}
      {/*      transition: 'all .2s ease-in-out',*/}
      {/*      '&:hover': {*/}
      {/*        background: `${theme.palette.primary.main}!important`,*/}
      {/*        color: theme.palette.primary.light*/}
      {/*      }*/}
      {/*    }}*/}
      {/*    onClick={handleLeftDrawerToggle}*/}
      {/*    color="inherit"*/}
      {/*  >*/}
      {/*    <IconMenu2 stroke={1.5} size="1.3rem" />*/}
      {/*  </Avatar>*/}
      {/*</ButtonBase>*/}
    </div>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
