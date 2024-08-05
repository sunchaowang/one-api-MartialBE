import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, Menu } from 'antd';

import menuItem from '@/menu-items';
import { useTranslation } from 'react-i18next';
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
    <Menu selectedKeys={selectedMenuItemKeys} {...props}>
      {panelMenus.children.map((child) => (
        <Menu.Item key={`${child.id}`} title={child.title} icon={<child.icon className="arco-icon" />}>
          {child.title}
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default function MenuSider({ isMobile, onCloseDrawer }) {
  const navigate = useNavigate();
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const dispatch = useDispatch();

  function onClickMenuItem({ key }) {
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
        <Card
          bordered={false}
          styles={{
            body: { boxShadow: 'none' }
          }}
          style={{
            boxShadow: 'none'
          }}
        >
          <div style={{ height: '36px' }}>{isMobile || leftDrawerOpened ? <LogoSection /> : <></>}</div>
        </Card>

        <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
          <BaseMenu onClick={onClickMenuItem} onCollapseChange={onCollapseChange} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </>
  );
}
