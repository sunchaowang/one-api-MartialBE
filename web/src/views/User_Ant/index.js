import { useState, useEffect } from 'react';
import { showError, showSuccess, trims } from '@/utils/common';

// import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import PerfectScrollbar from 'react-perfect-scrollbar';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';
import ButtonGroup from '@mui/material/ButtonGroup';
import Toolbar from '@mui/material/Toolbar';

import { Box, Stack, Container, Typography } from '@mui/material';
import UsersTableRow, { tableColumns } from './component/TableRow';
import KeywordTableHead from '@/ui-component/TableHead';
import TableToolBar from '@/ui-component/TableToolBar';
import { API } from '@/utils/api';
import { ITEMS_PER_PAGE } from '@/constants';
import { IconRefresh, IconPlus, IconSearch } from '@tabler/icons-react';
import EditeModal from './component/EditModal';

import { useTranslation } from 'react-i18next';
import { Button, Card, Table, Row, Col, Space, Form, Input, Flex } from 'antd';
import { useStateWithCallback } from '@/utils/common';
// ----------------------------------------------------------------------
export default function Users() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [listCount, setListCount] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useStateWithCallback('');
  const [users, setUsers] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editUserId, setEditUserId] = useState(0);
  const [editOperation, setEditOperation] = useState('edit');

  const [form] = Form.useForm();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (newPage, pageSize) => {
    setPage(newPage);
    setRowsPerPage(pageSize);
  };

  const handleChangeRowsPerPage = (value) => {
    setPage(0);
    setRowsPerPage(parseInt(value, 10));
  };

  const searchUsers = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setPage(0);
    setSearchKeyword(formData.get('keyword'));
  };

  const fetchData = async (page, rowsPerPage, keyword, order, orderBy) => {
    setSearching(true);
    keyword = trims(keyword);
    try {
      if (orderBy) {
        orderBy = order === 'desc' ? '-' + orderBy : orderBy;
      }
      setUsers([]);
      const res = await API.get(`/api/user/`, {
        params: {
          page: page,
          size: rowsPerPage,
          keyword: keyword,
          order: orderBy
        }
      });
      const { success, message, data } = res.data;
      if (success) {
        setListCount(data.total_count);
        setUsers(data.data);
      } else {
        showError(message);
      }
    } catch (error) {
      console.error(error);
    }
    setSearching(false);
  };

  // 处理刷新
  const handleRefresh = async () => {
    setOrderBy('id');
    setOrder('desc');
    setRefreshFlag(!refreshFlag);
  };

  useEffect(() => {
    fetchData(page, rowsPerPage, searchKeyword, order, orderBy);
  }, [page, rowsPerPage, order, orderBy, refreshFlag]);

  const manageUser = async (username, action, value) => {
    const url = '/api/user/manage';
    let data = { username: username, action: '' };
    let res;
    switch (action) {
      case 'delete':
        data.action = 'delete';
        break;
      case 'status':
        data.action = value === 1 ? 'enable' : 'disable';
        break;
      case 'role':
        data.action = value === true ? 'promote' : 'demote';
        break;
    }

    try {
      res = await API.post(url, data);
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('userPage.operationSuccess'));
        await handleRefresh();
      } else {
        showError(message);
      }

      return res.data;
    } catch (error) {
      return;
    }
  };

  const handleOpenModal = (userId, operationType) => {
    setEditUserId(userId);
    setOpenModal(true);
    setEditOperation(operationType);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditUserId(0);
  };

  const handleOkModal = (status) => {
    if (status === true) {
      handleCloseModal();
      handleRefresh();
    }
  };

  function handleSearch() {
    const formData = form.getFieldsValue();
    fetchData(page, rowsPerPage, formData.keyword, order, orderBy);
  }

  function handleReset() {
    form.resetFields();
    handleSearch();
  }

  return (
    <Card
      title={t('userPage.users')}
      extra={
        <Button type="primary" icon={<IconPlus />} onClick={() => handleOpenModal(0, 'add')}>
          {t('userPage.createUser')}
        </Button>
      }
    >
      <Flex style={{ width: '100%' }} vertical gap={'middle'}>
        <Row>
          <Col span={24}>
            <Form form={form}>
              <Form.Item name={'keyword'} getValueProps={(value) => ({ value })}>
                <Input allowClear placeholder={t('userPage.searchPlaceholder')} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Flex gap={'small'}>
              <Button onClick={handleSearch} icon={<IconSearch width={14} />} type={'primary'}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<IconRefresh width={14} />}>
                重置
              </Button>
            </Flex>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={tableColumns({
                t,
                manageUser,
                handleSearch
              })}
              dataSource={users}
              pagination={{
                current: page,
                total: listCount,
                pageSize: rowsPerPage,
                onChange: (page, pageSize) => handleChangePage(page, pageSize),
                onShowSizeChange: (current, size) => handleChangeRowsPerPage(size),
                showTotal: (count) => `共 ${count} 条`,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              loading={searching}
              scroll={{ x: true }}
            >
              <TableBody>
                {users.map((row) => (
                  <UsersTableRow
                    item={row}
                    manageUser={manageUser}
                    key={row.id}
                    handleOpenModal={(type) => handleOpenModal(type)}
                    setModalUserId={setEditUserId}
                  />
                ))}
              </TableBody>
            </Table>
          </Col>
        </Row>
      </Flex>
      <EditeModal open={openModal} onCancel={handleCloseModal} onOk={handleOkModal} userId={editUserId} />
    </Card>
  );
}
