import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../AuthForms/AuthLogin';
import Logo from '@/ui-component/Logo';

import { Card, Grid, Divider } from '@arco-design/web-react';

import { useTranslation } from 'react-i18next';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card>
      <Grid.Row justify={'center'} align={'center'}>
        <Grid.Col xs={24} lg={12}>
          <Grid.Col lg={24} xs={24}>
            <Card>
              <Grid.Row align={'center'} justify={'center'}>
                <Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                  {t('menu.login')}
                </Typography>
              </Grid.Row>
            </Card>
          </Grid.Col>
          <Grid.Col lg={24} xs={24}>
            <AuthLogin />
          </Grid.Col>
          <Grid.Col lg={24} xs={24}>
            <Divider />
          </Grid.Col>
          <Grid.Col lg={24} xs={24}>
            <Grid.Row align={'center'} justify={'center'}>
              <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                {t('menu.signup')}
              </Typography>
            </Grid.Row>
          </Grid.Col>
        </Grid.Col>
      </Grid.Row>
    </Card>
  );
};

export default Login;
