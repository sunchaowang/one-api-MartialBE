import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconLanguageHiragana } from '@tabler/icons-react';
import i18nList from '@/i18n/i18nList';
import useI18n from '@/hooks/useI18n';
import { Button, Menu, Dropdown } from '@arco-design/web-react';
import { IconLanguage } from '@arco-design/web-react/icon';

export default function I18nButton() {
  const theme = useTheme();
  const i18n = useI18n();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (key) => {
    console.log(key);
    // onClick={() => handleLanguageChange(item.lng)}
    handleLanguageChange(key);
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const droplist = (
    <Menu onClickMenuItem={handleMenuClick}>
      {i18nList.map((item) => (
        <Menu.Item key={item.lng}>{item.name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Dropdown droplist={droplist}>
        <Button shape="circle" icon={<IconLanguage />}></Button>
      </Dropdown>
    </>
  );
}
