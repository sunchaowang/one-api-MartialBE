import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, Menu, Message, Space } from '@arco-design/web-react';

import menuItem from '@/menu-items';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SET_MENU } from '@/store/actions';
import LogoSection from '@/layout/MainLayout/LogoSection';
import styled from '../style.module.scss';

const MenuItem = Menu.Item;

function BaseMenu(props) {
  const { t } = useTranslation();
  const [selectedMenuItemKeys, setSelectedMenuItemKeys] = React.useState([]);
  const location = useLocation();

  menuItem.items.forEach((group) => {
    group.children.forEach((item) => {
      item.title = t(item.id);
    });
  });
  const panelMenus = menuItem.items.find((item) => item.type === 'group');

  useEffect(() => {
    console.log('location', location);
    const pathname = location.pathname;
    if (panelMenus.children.length) {
      const currentPath = panelMenus.children.find((child) => child.url.includes(pathname));
      if (currentPath) {
        setSelectedMenuItemKeys([currentPath.id]);
      }
    }
  }, [location, panelMenus]);

  return (
    <Menu mode={'pop'} selectedKeys={selectedMenuItemKeys} {...props}>
      {panelMenus.children.map((child) => (
        <MenuItem key={`${child.id}`} title={child.title}>
          {child.icon && <child.icon className="arco-icon" />}
          {child.title}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default function MenuSider({ isMobile, onCloseDrawer }) {
  const navigate = useNavigate();
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const dispatch = useDispatch();

  function onClickMenuItem(key) {
    console.log('key', key);
    navigate(`/panel/${key}`);
    if (isMobile) {
      onCloseDrawer();
    }
  }

  function onCollapseChange(colapsed) {
    console.log('collapsed', colapsed);
    dispatch({ type: SET_MENU, opened: !colapsed });
  }
  return (
    <>
      <div style={{ width: '100%', height: '100%', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Card>
          <div style={{ height: '36px' }}>{leftDrawerOpened ? <LogoSection /> : <></>}</div>
        </Card>

        <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
          <BaseMenu onClickMenuItem={onClickMenuItem} onCollapseChange={onCollapseChange} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </>
  );
}
