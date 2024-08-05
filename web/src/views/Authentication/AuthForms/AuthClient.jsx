import { Box, useMediaQuery } from '@mui/material';
import AnimateButton from '@/ui-component/extended/AnimateButton';
import { Button, Row, Col, Space, Divider } from 'antd';
import { onGitHubOAuthClicked, onLarkOAuthClicked, onLinuxDOAuthClicked } from '@/utils/common';
import Github from '@/assets/images/icons/github.svg';
import LinuxDo from '@/assets/images/icons/linuxdo.svg?react';
import Wechat from '@/assets/images/icons/wechat.svg';
import WechatModal from '@/views/Authentication/AuthForms/WechatModal';
import Lark from '@/assets/images/icons/lark.svg';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useLogin from '@/hooks/useLogin';
import { useTheme } from '@mui/material/styles';

const AuthClient = () => {
  const theme = useTheme();
  const { wechatLogin } = useLogin();

  const [openWechat, setOpenWechat] = useState(false);
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const siteInfo = useSelector((state) => state.siteInfo);
  // const [checked, setChecked] = useState(true);
  const [githubLoading, setGithubLoading] = useState(false);
  const [linuxDoLoading, setLinuxDoLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  let tripartiteLogin = false;
  if (siteInfo.github_oauth || siteInfo.linuxdo_oauth || siteInfo.wechat_login || siteInfo.lark_client_id) {
    tripartiteLogin = true;
  }

  // 寻找 oauth 为 true 的个数
  const oauthClientCounts = [siteInfo.github_oauth, siteInfo.linuxdo_oauth, siteInfo.wechat_login, siteInfo.lark_client_id].filter(
    (item) => !!item
  ).length;

  const handleWechatOpen = () => {
    setOpenWechat(true);
  };

  const handleWechatClose = () => {
    setOpenWechat(false);
  };

  useEffect(() => {
    if (githubLoading || linuxDoLoading) {
      setAuthLoading(true);
    } else {
      setAuthLoading(false);
    }
  }, [githubLoading, linuxDoLoading]);

  return (
    <>
      {tripartiteLogin ? (
        <Row>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            {siteInfo.github_oauth && (
              <Col>
                <Button
                  disabled={authLoading || githubLoading}
                  loading={githubLoading}
                  block
                  onClick={() => onGitHubOAuthClicked(siteInfo.github_client_id, true, githubLoading, setGithubLoading)}
                  long
                  size={'large'}
                >
                  <Space align={'center'}>
                    <img
                      src={Github}
                      alt="github"
                      width={25}
                      height={25}
                      style={{ marginRight: matchDownSM ? 8 : 16, verticalAlign: 'middle' }}
                    />
                    使用 Github 登录
                  </Space>
                </Button>
              </Col>
            )}
            {siteInfo.linuxdo_oauth && (
              <Col>
                <Button
                  disabled={authLoading || linuxDoLoading}
                  loading={linuxDoLoading}
                  block
                  disableElevation
                  fullWidth
                  onClick={() => onLinuxDOAuthClicked(siteInfo.linuxdo_client_id, true, linuxDoLoading, setLinuxDoLoading)}
                  size="large"
                  long
                >
                  <Space>
                    <LinuxDo style={{ width: '25px', height: '25px' }} />
                    使用 LinuxDO 登录
                  </Space>
                </Button>
              </Col>
            )}
            {siteInfo.wechat_login && (
              <Col item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    onClick={handleWechatOpen}
                    size="large"
                    variant="outlined"
                    sx={{
                      ...theme.typography.LoginButton
                    }}
                  >
                    <Box sx={{ mr: { xs: 1, sm: 2, width: 20 }, display: 'flex', alignItems: 'center' }}>
                      <img src={Wechat} alt="Wechat" width={25} height={25} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                    </Box>
                    使用 Wechat 登录
                  </Button>
                </AnimateButton>
                <WechatModal open={openWechat} handleClose={handleWechatClose} wechatLogin={wechatLogin} qrCode={siteInfo.wechat_qrcode} />
              </Col>
            )}
            {siteInfo.lark_login && (
              <Col item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    fullWidth
                    onClick={() => onLarkOAuthClicked(siteInfo.lark_client_id)}
                    size="large"
                    variant="outlined"
                    sx={{
                      ...theme.typography.LoginButton
                    }}
                  >
                    <Box sx={{ mr: { xs: 1, sm: 2, width: 20 }, display: 'flex', alignItems: 'center' }}>
                      <img src={Lark} alt="Lark" width={25} height={25} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                    </Box>
                    使用飞书登录
                  </Button>
                </AnimateButton>
              </Col>
            )}
            <Col item xs={12}>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                {/*<Divider sx={{ flexGrow: 1 }} orientation="horizontal" />*/}

                {/*<Button*/}
                {/*  variant="outlined"*/}
                {/*  sx={{*/}
                {/*    cursor: 'unset',*/}
                {/*    m: 2,*/}
                {/*    py: 0.5,*/}
                {/*    px: 7,*/}
                {/*    borderColor: `${theme.palette.grey[100]} !important`,*/}
                {/*    color: `${theme.palette.grey[900]}!important`,*/}
                {/*    fontWeight: 500,*/}
                {/*    borderRadius: `${customization.borderRadius}px`*/}
                {/*  }}*/}
                {/*  disableRipple*/}
                {/*  disabled*/}
                {/*>*/}
                {/*  OR*/}
                {/*</Button>*/}

                {/*<Divider sx={{ flexGrow: 1 }} orientation="horizontal" />*/}
              </Box>
            </Col>
          </Space>
          <Divider />
        </Row>
      ) : null}
    </>
  );
};

export default AuthClient;
