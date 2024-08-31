import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { Typography, Button } from 'antd';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { QRCode } from 'react-qrcode-logo';
import successSvg from '@/assets/images/success.svg';
import { API } from '@/utils/api';
import { isMobile, showError } from '@/utils/common';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';

const PayDialog = ({ open, onClose, amount, uuid }) => {
  const theme = useTheme();
  const siteInfo = useSelector((state) => state.siteInfo);
  const defaultLogo = theme.palette.mode === 'light' ? '/logo-loading.svg' : '/logo-loading-white.svg';
  const [message, setMessage] = useState('正在拉起支付中...');
  const [subMessage, setSubMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [success, setSuccess] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  let useLogo = siteInfo.logo ? siteInfo.logo : defaultLogo;

  const clearValue = () => {
    setMessage('正在拉起支付中...');
    setSubMessage(null);
    setLoading(false);
    setQrCodeUrl(null);
    setSuccess(false);
  };

  const pollOrderStatus = useCallback((tradeNo) => {
    const id = setInterval(() => {
      API.get(`/api/user/order/status?trade_no=${tradeNo}`).then((response) => {
        if (response.data.success) {
          clearInterval(id);
          setMessage('支付成功');
          setLoading(false);
          setSuccess(true);
          setQrCodeUrl(null);
          clearInterval(id);
          setIntervalId(null);
        }
      });
    }, 3000);
    setIntervalId(id);
  }, []);

  function openPayUrl(method, url, params) {
    const form = document.createElement('form');
    form.method = method;
    form.action = url;
    form.target = '_blank';
    for (const key in params) {
      const input = document.createElement('input');
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    setMessage('正在拉起支付中...');
    setLoading(true);

    API.post('/api/user/order', {
      uuid: uuid,
      amount: Number(amount)
    }).then((response) => {
      if (!response.data.success) {
        showError(response.data.message);
        setLoading(false);
        onClose();
        return;
      }

      const { type, data } = response.data.data;
      if (type === 1) {
        setMessage('等待支付中...');
        setSubMessage(
          <>
            如果没有自动跳转，请点击
            <a href="#" onClick={() => openPayUrl(data.method, data.url, data.params)}>
              这里跳转
            </a>
          </>
        );
        openPayUrl(data.method, data.url, data.params);
      } else if (type === 2) {
        setQrCodeUrl(data.url);
        setLoading(false);
        setMessage('请扫码支付');
      }
      pollOrderStatus(response.data.data.trade_no);
    });
  }, [open, onClose, amount, uuid, pollOrderStatus]);

  //打开支付宝
  const handleOpenAlipay = (alipayUrl) => {
    if (alipayUrl && alipayUrl.startsWith('https://qr.alipay.com')) {
      window.open(alipayUrl, '_blank');
    }
  };
  return (
    <Modal open={open} fullWidth maxWidth={'90vw'} destroyOnClose title={'支付'} footer={null}>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        {loading && <img src={useLogo} alt="loading" height="100" />}
        {qrCodeUrl && (
          <QRCode value={qrCodeUrl} size={256} qrStyle="dots" eyeRadius={20} fgColor={'#1677ff'} bgColor={theme.palette.background.paper} />
        )}
        {success && <img src={successSvg} alt="success" height="100" />}
        <Typography variant="h3">{message}</Typography>
        {subMessage && <Typography variant="body">{subMessage}</Typography>}
        {qrCodeUrl && qrCodeUrl.startsWith('https://qr.alipay.com') && !success && (
          <>
            <Typography.Text>充值未到账请联系管理员</Typography.Text>

            {isMobile() && (
              <Button type={'primary'} block={true} onClick={() => handleOpenAlipay(qrCodeUrl)}>
                打开支付宝
              </Button>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
};

export default PayDialog;

PayDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  amount: PropTypes.number,
  uuid: PropTypes.string
};
