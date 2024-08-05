import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../AuthForms/AuthLogin';
import Logo from '@/ui-component/Logo';

import { Card, Row, Col, Divider } from 'antd';

import { useTranslation } from 'react-i18next';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card bordered={false}>
      <Row justify={'center'} align={'center'}>
        <Col xs={24} sm={18} md={12} lg={8} xl={6} xxl={4} xxxl={2}>
          <Col lg={24} xs={24}>
            <Card bordered={false}>
              <Row align={'center'} justify={'center'}>
                <Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                  {t('menu.login')}
                </Typography>
              </Row>
            </Card>
          </Col>
          <Col lg={24} xs={24}>
            <AuthLogin />
          </Col>
          <Col lg={24} xs={24}>
            <Divider />
          </Col>
          <Col lg={24} xs={24}>
            <Row align={'center'} justify={'center'}>
              <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                {t('menu.signup')}
              </Typography>
            </Row>
          </Col>
        </Col>
      </Row>
    </Card>
  );
};

export default Login;
