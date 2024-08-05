import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import AuthGuard from '@/utils/route-guard/AuthGuard';
import styled from './style.module.scss';
// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import AdminContainer from '@/ui-component/AdminContainer';

// project imports
import Breadcrumbs from '@/ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import navigation from '@/menu-items';
import { drawerWidth } from '@/store/constant';
import { SET_MENU } from '@/store/actions';
import { Layout, Card, Drawer } from 'antd';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Layout className={styled.layout} style={!isMobile ? { minWidth: 1400, overflow: 'scroll' } : {}}>
      {!isMobile ? (
        <Layout.Sider theme={'light'} collapsedWidth={80} className={styled.layoutSider} width={260} collapsed={!leftDrawerOpened}>
          <Sidebar
            isMobile={false}
            drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
            drawerToggle={handleLeftDrawerToggle}
          />
        </Layout.Sider>
      ) : (
        <Drawer
          width={260}
          open={!leftDrawerOpened}
          footer={null}
          title={null}
          closeIcon={null}
          placement={'left'}
          onClose={handleLeftDrawerToggle}
        >
          <Sidebar
            isMobile={isMobile}
            drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
            drawerToggle={handleLeftDrawerToggle}
            onCloseDrawer={handleLeftDrawerToggle}
          />
        </Drawer>
      )}

      <Layout.Content className={styled['layout-content']}>
        <Layout style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#eef2f6' }}>
          <Layout.Header className={styled['layout-header']}>
            <Header showMenuCollapse={true} showLogo={false}></Header>
          </Layout.Header>
          <Layout.Content style={{ width: '100%', height: '100%' }}>
            <Card
              bordered={false}
              styles={{
                body: { boxShadow: 'none', padding: 16 }
              }}
              style={{ width: '100%', height: '100%', overflow: 'scroll', backgroundColor: '#eef2f6' }}
            >
              <div style={{ width: '100%', height: '100%', paddingBottom: 68 }}>
                <AuthGuard>
                  <AdminContainer>
                    <Outlet></Outlet>
                  </AdminContainer>
                </AuthGuard>
              </div>
            </Card>
          </Layout.Content>
        </Layout>
      </Layout.Content>
    </Layout>
  );
};

export default MainLayout;
