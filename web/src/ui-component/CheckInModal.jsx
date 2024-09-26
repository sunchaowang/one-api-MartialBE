import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Turnstile from 'react-turnstile';
import { API } from '@/utils/api';
import { Typography, Modal, Button, Space, Spin } from 'antd';

import { showError, showSuccess, showInfo } from '@/utils/common';

export default function CheckInModal(props) {
  const siteInfo = useSelector((state) => state.siteInfo);

  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [checkinLoading, setCheckinLoading] = useState(false);

  useEffect(() => {
    console.log('siteInfo', siteInfo);
    if (siteInfo.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(siteInfo.turnstile_site_key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteInfo]);

  const handleTurnStileOnLoad = (widgetId, bound) => {
    // before:
    window.turnstile.execute(widgetId);
    // now:
    bound.execute();
    setTurnstileLoaded(true);
  };

  // 签到
  const handleUserOperationCheckIn = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    // TODO
    // showInfo('签到系统正在维护中！');
    // return;
    setCheckinLoading(true);
    try {
      let res = await API.post(`/api/operation/checkin?turnstile=${turnstileToken}`);
      const { success, message } = res.data;
      if (success) {
        showSuccess(message);
        handleClose();
        if (props.loadUser) {
          props.loadUser();
        }
      } else {
        showError(message);
      }
      setCheckinLoading(false);
    } catch (error) {
      setCheckinLoading(false);
      return;
    }
  };

  function handleClose() {
    props?.onClose?.();
  }

  function afterClose() {
    setTurnstileToken('');
    setCheckinLoading(false);
  }

  return (
    <Modal
      open={props.visible}
      maskClosable={false}
      onCancel={handleClose}
      footer={[
        <Button onClick={() => handleClose()}>取消</Button>,
        <Button disabled={!turnstileToken} loading={checkinLoading} onClick={() => handleUserOperationCheckIn()} type="primary">
          立即签到
        </Button>
      ]}
      afterClose={afterClose}
      destroyOnClose
    >
      <Space direction={'vertical'} size={16}>
        <Typography.Paragraph heading={4}>正在检查用户环境</Typography.Paragraph>
        <Typography>温馨提示：每日签到获得的额度以前一日的总消耗额度为基础获得随机返赠🤓</Typography>
        {turnstileEnabled ? (
          <Spin spinning={!turnstileLoaded}>
            <div style={{ width: 300, height: 65 }}>
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
                onLoad={handleTurnStileOnLoad}
                executution="execute"
              />
            </div>
          </Spin>
        ) : (
          <Spin>
            <div style={{ width: 300, height: 65 }}></div>
          </Spin>
        )}
      </Space>
    </Modal>
  );
}
