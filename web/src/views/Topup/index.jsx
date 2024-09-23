import { useEffect, useState } from 'react';
import { showError } from '@/utils/common';
import { Row, Col, Alert, Card } from 'antd';
import TopupCard from './component/TopupCard';
import InviteCard from './component/InviteCard';
import { API } from '@/utils/api';
import { useTranslation } from 'react-i18next';

const Topup = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({});

  const loadUserSelf = async () => {
    try {
      const res = await API.get('/api/user/self');
      const { success, message, data } = res.data;
      if (success) {
        setUser(data);
      } else {
        showError(message);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    loadUserSelf().then();
  }, []);

  return (
    <Card title={'充值'}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Alert message={t('topupPage.alertMessage')} />
        </Col>
        <Col xs={24}>
          <TopupCard user={user} />
        </Col>
        {/* <Col xs={24} md={12} lg={12}>
          <Card>
            <InviteCard user={user} />
          </Card>
        </Col> */}
      </Row>
    </Card>
  );
};

export default Topup;
