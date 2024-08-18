import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Button, Alert, Typography, Row, Col, Form, Input, Space, Table, message } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { showError, showSuccess, trims } from '@/utils/common';
import { API } from '@/utils/api';
import { ITEMS_PER_PAGE } from '@/constants';
import { isAdmin } from '@/utils/common';
import EditeModal from './component/EditModal';
import TokensTableRow, { tableRowColumns } from './component/TableRow';

const { Text } = Typography;

export default function Token() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editTokenId, setEditTokenId] = useState(0);
  const siteInfo = useSelector((state) => state.siteInfo);
  const userIsAdmin = isAdmin();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: ITEMS_PER_PAGE,
    total: 0
  });
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('descend');

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const { current, pageSize, keyword, sortField, sortOrder } = params;
      const orderBy = sortOrder === 'descend' ? '-' + sortField : sortField;
      const res = await API.get('/api/token/', {
        params: {
          page: current,
          size: pageSize,
          keyword: trims(keyword),
          order: orderBy
        }
      });
      const { success, message: msg, data } = res.data;
      if (success) {
        setTokens(data.data);
        setPagination({
          ...params.pagination,
          total: data.total_count
        });
      } else {
        message.error(msg);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData({
      current: 1,
      pageSize: ITEMS_PER_PAGE
    });
  }, []);

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...newPagination,
      ...filters
    });
  };

  const handleSearch = () => {
    fetchData({
      current: 1,
      pageSize: pagination.pageSize,
      ...form.getFieldValue()
    });
  };

  const handleRefresh = () => {
    form.resetFields();
    fetchData({
      current: 1,
      pageSize: pagination.pageSize
    });
  };

  const manageToken = async (id, action, value) => {
    try {
      let res;
      switch (action) {
        case 'delete':
          res = await API.delete(`/api/token/${id}`);
          break;
        case 'status':
          res = await API.put(`/api/token/?status_only=true`, {
            id,
            status: value
          });
          break;
      }
      const { success, message: msg } = res.data;
      if (success) {
        message.success('操作成功完成！');
        handleRefresh();
      } else {
        message.error(msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (tokenId) => {
    setEditTokenId(tokenId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditTokenId(0);
  };

  const handleOkModal = (status) => {
    if (status === true) {
      handleCloseModal();
      handleRefresh();
    }
  };

  return (
    <Card
      title={t('token_index.token')}
      extra={
        <Button type="primary" onClick={() => handleOpenModal(0)} icon={<PlusOutlined />}>
          {t('token_index.createToken')}
        </Button>
      }
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Alert
          message={
            <>
              {t('token_index.replaceApiAddress1')}
              <Text copyable strong>
                {siteInfo.server_address}
              </Text>
              {t('token_index.replaceApiAddress2')}
            </>
          }
          type="info"
        />
        <Form form={form}>
          <Form.Item name="keyword" label={'令牌名称'}>
            <Input placeholder={t('token_index.searchTokenName')} />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
              搜索
            </Button>
            <Button onClick={handleRefresh} icon={<ReloadOutlined />}>
              重置
            </Button>
          </Space>
        </Form>
        <Table
          columns={tableRowColumns(t, userIsAdmin, manageToken, handleSearch, handleOpenModal)}
          dataSource={tokens}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </Space>
      <EditeModal open={openModal} onCancel={handleCloseModal} onOk={handleOkModal} tokenId={editTokenId} userIsAdmin={userIsAdmin} />
    </Card>
  );
}
