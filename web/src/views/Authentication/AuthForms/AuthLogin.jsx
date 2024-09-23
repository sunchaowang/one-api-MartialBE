import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, FormHelperText } from '@mui/material';

import { Button, Form, Input, Divider, Row, Col, Typography } from 'antd';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useLogin from '@/hooks/useLogin';
import AnimateButton from '@/ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import AuthClient from '@/views/Authentication/AuthForms/AuthClient';
import { showInfo } from '@/utils/common';
import Turnstile from 'react-turnstile';
import { onGitHubOAuthClicked, onLarkOAuthClicked } from '@/utils/common';
import { useTranslation } from 'react-i18next';

// ============================|| FIREBASE - LOGIN ||============================ //

const LoginForm = ({ ...others }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { login } = useLogin();
  const siteInfo = useSelector((state) => state.siteInfo);

  const [showPassword, setShowPassword] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (siteInfo.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(siteInfo.turnstile_site_key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteInfo]);

  return (
    <>
      <AuthClient></AuthClient>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required(t('login.usernameRequired')),
          password: Yup.string().max(255).required(t('login.passwordRequired'))
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          if (turnstileEnabled && turnstileToken === '') {
            showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
            setSubmitting(false);
            return;
          }
          const { success, message } = await login(values.username, values.password, turnstileToken);
          if (success) {
            setStatus({ success: true });
          } else {
            setStatus({ success: false });
            if (message) {
              setErrors({ submit: message });
            }
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <Form noValidate {...others} size={'large'} layout={'vertical'}>
            <Form.Item label={t('login.usernameOrEmail')}>
              <Input
                onChange={(e) =>
                  handleChange({
                    target: {
                      value: e.target.value,
                      name: 'username'
                    }
                  })
                }
                value={values.username}
                name={'username'}
                allowClear
              ></Input>
            </Form.Item>
            <Form.Item label={t('login.password')}>
              <Input.Password
                onChange={(e) =>
                  handleChange({
                    target: {
                      value: e.target.value,
                      name: 'password'
                    }
                  })
                }
                name={'password'}
                value={values.password}
                allowClear
              ></Input.Password>
            </Form.Item>
            {/*<FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>*/}
            {/*  <InputLabel htmlFor="outlined-adornment-username-login">{t('login.usernameOrEmail')}</InputLabel>*/}
            {/*  <OutlinedInput*/}
            {/*    id="outlined-adornment-username-login"*/}
            {/*    type="text"*/}
            {/*    value={values.username}*/}
            {/*    name="username"*/}
            {/*    onBlur={handleBlur}*/}
            {/*    onChange={handleChange}*/}
            {/*    label={t('login.usernameOrEmail')}*/}
            {/*    inputProps={{ autoComplete: 'username' }}*/}
            {/*  />*/}
            {/*  {touched.username && errors.username && (*/}
            {/*    <FormHelperText error id="standard-weight-helper-text-username-login">*/}
            {/*      {errors.username}*/}
            {/*    </FormHelperText>*/}
            {/*  )}*/}
            {/*</FormControl>*/}

            {/*<FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>*/}
            {/*  <InputLabel htmlFor="outlined-adornment-password-login">{t('login.password')}</InputLabel>*/}
            {/*  <OutlinedInput*/}
            {/*    id="outlined-adornment-password-login"*/}
            {/*    type={showPassword ? 'text' : 'password'}*/}
            {/*    value={values.password}*/}
            {/*    name="password"*/}
            {/*    onBlur={handleBlur}*/}
            {/*    onChange={handleChange}*/}
            {/*    endAdornment={*/}
            {/*      <InputAdornment position="end">*/}
            {/*        <IconButton*/}
            {/*          aria-label="toggle password visibility"*/}
            {/*          onClick={handleClickShowPassword}*/}
            {/*          onMouseDown={handleMouseDownPassword}*/}
            {/*          edge="end"*/}
            {/*          size="large"*/}
            {/*        >*/}
            {/*          {showPassword ? <Visibility /> : <VisibilityOff />}*/}
            {/*        </IconButton>*/}
            {/*      </InputAdornment>*/}
            {/*    }*/}
            {/*    label="Password"*/}
            {/*  />*/}
            {/*  {touched.password && errors.password && (*/}
            {/*    <FormHelperText error id="standard-weight-helper-text-password-login">*/}
            {/*      {errors.password}*/}
            {/*    </FormHelperText>*/}
            {/*  )}*/}
            {/*</FormControl>*/}
            <Typography.Link type="text" onClick={() => navigate('/reset')}>
              {t('login.forgetPassword')}
            </Typography.Link>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            {turnstileEnabled ? (
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
              />
            ) : (
              <></>
            )}
            <Row>
              <Col span={24}>
                <Button block onClick={handleSubmit} long loading={isSubmitting} fullWidth size={'large'} type="primary">
                  {t('menu.login')}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginForm;
