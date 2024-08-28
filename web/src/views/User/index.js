import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Input, Space, Popconfirm, Switch, Tooltip, Descriptions, Row, Col, Tag, Form, Flex } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  WechatOutlined,
  GithubOutlined,
  MailOutlined,
  SearchOutlined
} from '@ant-design/icons';
import LinuxDoIcon from '@/assets/images/icons/linuxdo.svg?react';
import { showError, showSuccess, trims, renderQuota, renderNumber, timestamp2string } from '@/utils/common';
import { API } from '@/utils/api';
import { ITEMS_PER_PAGE } from '@/constants';
import { useTranslation } from 'react-i18next';
import EditeModal from './component/EditModal';
import { Divider } from 'antd/lib';

const { Title } = Typography;
const { Search } = Input;

export default function Users() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userId, setUserId] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('descend');
  const [modalVisible, setModalVisible] = useState(false);
  const [editUserId, setEditUserId] = useState(0);
  const [editOperation, setEditOperation] = useState('edit');
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/user/', {
        params: {
          page,
          size: pageSize,
          keyword: searchKeyword,
          user_id: userId,
          order: sortOrder === 'ascend' ? sortField : `-${sortField}`
        }
      });
      const { success, message, data } = res.data;
      if (success) {
        setTotal(data.total_count);
        setUsers(data.data);
      } else {
        showError(message);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchKeyword, sortField, sortOrder, userId]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchKeyword(form.getFieldValue('searchKeyword'));
    setUserId(form.getFieldValue('userId'));
  };

  const handleRefresh = () => {
    setSortField('id');
    setSortOrder('descend');
    setSearchKeyword('');
    setUserId('');
    form.resetFields();
    fetchData();
  };

  const manageUser = async (username, action, value) => {
    try {
      const res = await API.post('/api/user/manage', { username, action, value });
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('userPage.operationSuccess'));
        fetchData();
      } else {
        showError(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: t('userPage.id'), dataIndex: 'id' },
    { title: t('userPage.username'), dataIndex: 'username' },
    { title: t('userPage.group'), dataIndex: 'group', render: (text) => <Tag>{text}</Tag> },
    {
      title: t('userPage.statistics'),
      dataIndex: 'stats',

      render: (_, record) => (
        <Flex gap="small" vertical>
          {[
            { label: t('token_index.remainingQuota'), value: renderQuota(record.quota, 6) },
            { label: t('token_index.usedQuota'), value: renderQuota(record.used_quota, 6) },
            { label: t('userPage.useQuota'), value: record.request_count },
            { label: '邀请用户', value: record.inviter_id }
          ].map((item) => (
            <Row>
              <Tag>{item.label}</Tag>
              <Divider type={'vertical'} />
              {item.value}
            </Row>
          ))}
        </Flex>
      )
    },
    {
      title: t('userPage.userRole'),
      dataIndex: 'role',
      render: (role) => {
        switch (role) {
          case 1:
            return <Tag>{t('userPage.cUserRole')}</Tag>;
          case 10:
            return <Tag>{t('userPage.adminUserRole')}</Tag>;
          case 100:
            return <Tag>{t('userPage.superAdminRole')}</Tag>;
          default:
            return <Tag>{t('userPage.uUserRole')}</Tag>;
        }
      }
    },
    {
      title: t('userPage.bind'),
      dataIndex: 'bind',
      onCell: (record) => {
        return {
          style: {
            minWidth: 80
          }
        };
      },

      render: (_, record) => (
        <Flex vertical gap={'small'}>
          {[
            record.wechat_id ? { label: <WechatOutlined />, value: record.wechat_id } : null,
            record.github_id ? { label: <GithubOutlined />, value: record.github_id } : null,
            record.email ? { label: <MailOutlined />, value: record.email } : null,
            record.linuxdo_id
              ? {
                  label: <LinuxDoIcon />,
                  value: (
                    <>
                      {record.linuxdo_id}
                      <Divider type={'vertical'} />
                      {record.linuxdo_name}
                      <Divider type={'vertical'} />
                      {record.linuxdo_username}
                      <Divider type={'vertical'} />
                      {record.linuxdo_level}级
                    </>
                  )
                }
              : null
          ]
            .filter((item) => !!item)
            .map((item) => {
              return (
                <Flex justify={'center'} align={'center'}>
                  {item.label}
                  <Divider type={'vertical'} />
                  {item.value}
                </Flex>
              );
            })}
        </Flex>
      )
    },
    {
      title: t('userPage.creationTime'),
      dataIndex: 'created_time',
      onCell: (record) => {
        return {
          style: {
            minWidth: 120
          }
        };
      },
      render: (time) => (time === 0 ? t('common.unknown') : timestamp2string(time))
    },
    {
      title: t('userPage.status'),
      dataIndex: 'status',
      render: (status, record) => (
        <Switch size={'small'} checked={status === 1} onChange={(checked) => manageUser(record.username, 'status', checked ? 1 : 2)} />
      )
    },
    {
      title: t('userPage.action'),
      key: 'action',
      onCell: (record) => {
        return {
          style: {
            minWidth: 120
          }
        };
      },
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" type={'link'} icon={<EditOutlined />} onClick={() => handleOpenModal(record.id, 'edit')}>
            编辑
          </Button>
          <Popconfirm
            title={t('userPage.delTip')}
            onConfirm={() => manageUser(record.username, 'delete', '')}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button size="small" type="link" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleOpenModal = (userId, operationType) => {
    setEditUserId(userId);
    setModalVisible(true);
    setEditOperation(operationType);
  };

  return (
    <>
      <Card
        title={t('userPage.users')}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal(0, 'add')}>
            {t('userPage.createUser')}
          </Button>
        }
      >
        <Row
          style={{
            marginBottom: 16
          }}
        >
          <Col span={24}>
            <Form form={form} layout={'inline'}>
              <Form.Item label="用户ID" name={'userId'}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label="关键字" name={'searchKeyword'}>
                <Input placeholder={t('userPage.searchPlaceholder')} />
              </Form.Item>

              <Form.Item>
                <Flex gap={'small'}>
                  <Button icon={<SearchOutlined />} onClick={handleSearch} type={'primary'}>
                    搜索
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                    重置{' '}
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
      <EditeModal visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => setModalVisible(false)} userId={editUserId} />
    </>
  );
}
