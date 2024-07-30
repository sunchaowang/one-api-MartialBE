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
import { Grid, Space, Card } from '@arco-design/web-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Grid.Row style={{ width: '100%' }} align="center" justify="space-around">
        <Grid.Col flex={'150px'}>
          <LogoSection />
        </Grid.Col>
        <Grid.Col flex={'auto'}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Space size={16}>
              <ContactButton />
              <ThemeButton />
              <I18nButton />
              <ProfileSection />
            </Space>
          </div>
        </Grid.Col>
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
      </Grid.Row>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
