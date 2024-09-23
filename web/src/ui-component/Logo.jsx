// material-ui
import logoLight from '@/assets/images/logo.svg';
import logoDark from '@/assets/images/logo-white.svg';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Button, Typography } from '@arco-design/web-react';
import { Space } from '@arco-design/web-react';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from '@/assets/images/logo-dark.svg';
 * import logo from '@/assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const siteInfo = useSelector((state) => state.siteInfo);
  const theme = useTheme();
  const defaultLogo = theme.palette.mode === 'light' ? logoLight : logoDark;

  if (siteInfo.isLoading) {
    return null; // 数据加载未完成时不显示 logo
  }

  return (
    <Space direction={'horizontal'} size={16}>
      <img
        src={defaultLogo}
        alt={siteInfo.system_name}
        height="32"
        style={{
          borderRadius: '50%'
        }}
      />
      <Typography.Text>
        <strong>{siteInfo.system_name}</strong>
      </Typography.Text>
    </Space>
  );
};

export default Logo;
