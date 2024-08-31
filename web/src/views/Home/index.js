import React, { useEffect, useState } from 'react';
import { showError, showNotice } from '@/utils/common';
import { API } from '@/utils/api';
import { marked } from 'marked';
import HomeContent from './HomeContent';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';

const Home = () => {
  const { t } = useTranslation();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [modal, contextHolder] = Modal.useModal();

  const displayNotice = async () => {
    try {
      const res = await API.get('/api/notice');
      const { success, message, data } = res.data;
      if (success) {
        let oldNotice = localStorage.getItem('notice');
        if (data !== '') {
          if (data !== oldNotice) {
            localStorage.setItem('notice', data);
          }
          const htmlNotice = marked(data);

          modal.success({
            title: '通知',
            icon: null,
            content: <div dangerouslySetInnerHTML={{ __html: htmlNotice }} />,
            style: {
              maxWidth: '90vw',
              padding: 20
            }
          });
        }
      } else {
        showError(message);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    displayNotice().then();
  }, []);

  return (
    <>
      {contextHolder}
      <HomeContent />
    </>
  );
};

export default Home;
