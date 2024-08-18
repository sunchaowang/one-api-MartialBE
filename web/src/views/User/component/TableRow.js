import PropTypes from 'prop-types';
import { useState } from 'react';
import { Table, Space, Popconfirm, Button, Switch, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, WechatOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import Label from '@/ui-component/Label';
import { renderQuota, renderNumber, timestamp2string } from '@/utils/common';
import { useTranslation } from 'react-i18next';

function renderRole(t, role) {
  switch (role) {
    case 1:
      return <Tag color="default">{t('userPage.cUserRole')}</Tag>;
    case 10:
      return <Tag color="orange">{t('userPage.adminUserRole')}</Tag>;
    case 100:
      return <Tag color="success">{t('userPage.superAdminRole')}</Tag>;
    default:
      return <Tag color="error">{t('userPage.uUserRole')}</Tag>;
  }
}

export default function UsersTableRow({ item, manageUser, handleOpenModal, setModalUserId }) {
  const { t } = useTranslation();
  const [statusSwitch, setStatusSwitch] = useState(item.status);

  const handleStatus = async () => {
    const switchVlue = statusSwitch === 1 ? 2 : 1;
    const { success } = await manageUser(item.username, 'status', switchVlue);
    if (success) {
      setStatusSwitch(switchVlue);
    }
  };

  const handleDelete = async () => {
    await manageUser(item.username, 'delete', '');
  };

  return (
    <Table.Row>
      <Table.Cell>{item.id}</Table.Cell>
      <Table.Cell>{item.username}</Table.Cell>
      <Table.Cell>
        <Tag>{item.group}</Tag>
      </Table.Cell>
      <Table.Cell>
        <Space>
          <Label color="primary" variant="outlined">
            {renderQuota(item.quota, 6)}
          </Label>
          <Label color="primary" variant="outlined">
            {renderQuota(item.used_quota, 6)}
          </Label>
          <Label color="primary" variant="outlined">
            {renderNumber(item.request_count)}
          </Label>
          <Label color="primary" variant="outlined">
            {item.inviter_id}
          </Label>
        </Space>
      </Table.Cell>
      <Table.Cell>{renderRole(t, item.role)}</Table.Cell>
      <Table.Cell>
        <Space>
          <Tooltip title={item.wechat_id ? item.wechat_id : t('profilePage.notBound')}>
            <WechatOutlined style={{ color: item.wechat_id ? '#52c41a' : '#d9d9d9' }} />
          </Tooltip>
          <Tooltip title={item.github_id ? item.github_id : t('profilePage.notBound')}>
            <GithubOutlined style={{ color: item.github_id ? '#000' : '#d9d9d9' }} />
          </Tooltip>
          <Tooltip title={item.email ? item.email : t('profilePage.notBound')}>
            <MailOutlined style={{ color: item.email ? '#000' : '#d9d9d9' }} />
          </Tooltip>
        </Space>
      </Table.Cell>
      <Table.Cell>{item.created_time === 0 ? t('common.unknown') : timestamp2string(item.created_time)}</Table.Cell>
      <Table.Cell>
        <Switch checked={statusSwitch === 1} onChange={handleStatus} />
      </Table.Cell>
      <Table.Cell>
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(item.id, 'edit')}>
            {t('common.edit')}
          </Button>
          <Popconfirm title={t('userPage.delTip')} onConfirm={handleDelete}>
            <Button type="link" icon={<DeleteOutlined />} danger>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      </Table.Cell>
    </Table.Row>
  );
}

UsersTableRow.propTypes = {
  item: PropTypes.object,
  manageUser: PropTypes.func,
  handleOpenModal: PropTypes.func,
  setModalUserId: PropTypes.func
};