import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Header from './Header';
import Footer from '@/ui-component/Footer';
import { Layout } from 'antd';
import styled from '../style.module.scss';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const theme = useTheme();

  return (
    <Layout className={styled.layout}>
      <Layout.Header className={styled['layout-header']}>
        <Header />
      </Layout.Header>
      <Layout.Content className={styled['layout-content']}>
        <Layout>
          <Layout.Content>
            <Outlet />
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout.Content>
    </Layout>
  );
};

export default MinimalLayout;
