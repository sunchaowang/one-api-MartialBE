import { useState, useEffect } from 'react';
import { showError, showSuccess, trims } from '@/utils/common';
import { Table, Button, Card, Typography, Space, Row, Col, Modal, Input, Form, Spin } from 'antd';
import { RedemptionTableRowRender } from './component/TableRow';
import KeywordTableHead from '@/ui-component/TableHead';
import { API } from '@/utils/api';
import { ITEMS_PER_PAGE } from '@/constants';
import EditeModal from './component/EditModal';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------
export default function Redemption() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [listCount, setListCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [redemptions, setRedemptions] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editRedemptionId, setEditRedemptionId] = useState(0);

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (page) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (value) => {
    setPage(1);
    setRowsPerPage(value);
  };

  const searchRedemptions = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setPage(1);
    setSearchKeyword(formData.get('keyword'));
  };

  const fetchData = async () => {
    setSearching(true);
    const keyword = trims(searchKeyword);
    const orderStr = order === 'desc' ? '-' + orderBy : orderBy;
    try {
      const res = await API.get(`/api/redemption/`, {
        params: {
          page,
          size: rowsPerPage,
          keyword,
          order: orderStr
        }
      });
      const { success, message, data } = res.data;
      if (success) {
        setListCount(data.total_count);
        setRedemptions(data.data);
      } else {
        showError(message);
      }
    } catch (error) {
      console.error(error);
    }
    setSearching(false);
  };

  const handleRefresh = () => {
    setOrderBy('id');
    setOrder('desc');
    setRefreshFlag(!refreshFlag);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, searchKeyword, order, orderBy, refreshFlag]);

  const manageRedemptions = async (id, action, value) => {
    const url = '/api/redemption/';
    let data = { id };
    let res;

    try {
      switch (action) {
        case 'delete':
          res = await API.delete(url + id);
          break;
        case 'status':
          res = await API.put(url + '?status_only=true', {
            ...data,
            status: value
          });
          break;
      }
      const { success, message } = res.data;
      if (success) {
        showSuccess(t('redemptionPage.successMessage'));
        if (action === 'delete') {
          await handleRefresh();
        }
      } else {
        showError(message);
      }
      return res.data;
    } catch (error) {
      return;
    }
  };

  const handleOpenModal = (redemptionId) => {
    setEditRedemptionId(redemptionId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditRedemptionId(0);
  };

  const handleOkModal = (status) => {
    if (status === true) {
      handleCloseModal();
      handleRefresh();
    }
  };

  return (
    <>
      <Card
        title={t('redemptionPage.pageTitle')}
        extra={
          <Button type="primary" onClick={() => handleOpenModal(0)}>
            {t('redemptionPage.createRedemptionCode')}
          </Button>
        }
      >
        <Form layout="horizontal">
          <Form.Item>
            <Input placeholder={t('redemptionPage.searchPlaceholder')} onChange={(value) => setSearchKeyword(value.target.value)} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={searchRedemptions}>
              搜索
            </Button>
            {/* <Button onClick={handleReset}>重置</Button> */}
          </Form.Item>
        </Form>
        <Table
          columns={[
            {
              id: 'id',
              dataIndex: 'id',
              key: 'id',
              title: t('redemptionPage.headLabels.id'),
              disableSort: false,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'id', t, manageRedemptions)
            },
            {
              id: 'name',
              dataIndex: 'name',
              key: 'name',
              title: t('redemptionPage.headLabels.name'),
              disableSort: false,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'name', t, manageRedemptions)
            },
            {
              id: 'status',
              dataIndex: 'status',
              key: 'status',
              title: t('redemptionPage.headLabels.status'),
              disableSort: false,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'status', t, manageRedemptions)
            },
            {
              id: 'quota',
              dataIndex: 'quota',
              key: 'quota',
              title: t('redemptionPage.headLabels.quota') + '($)',
              disableSort: false,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'quota', t, manageRedemptions)
            },
            {
              id: 'created_time',
              dataIndex: 'created_time',
              key: 'created_time',
              title: t('redemptionPage.headLabels.createdTime'),
              disableSort: false,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'created_time', t, manageRedemptions)
            },
            {
              id: 'redeemed_time',
              dataIndex: 'redeemed_time',
              key: 'redeemed_time',
              title: t('redemptionPage.headLabels.redeemedTime'),
              disableSort: false,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'redeemed_time', t, manageRedemptions)
            },
            {
              id: 'action',
              dataIndex: 'action',
              key: 'action',
              title: t('redemptionPage.headLabels.action'),
              disableSort: true,
              render: (text, record, index) => RedemptionTableRowRender(text, record, index, 'action', t, manageRedemptions)
            }
          ]}
          dataSource={redemptions}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: rowsPerPage,
            total: listCount,
            onChange: handleChangePage,
            pageSizeOptions: [10, 25, 30],
            onShowSizeChange: handleChangeRowsPerPage
          }}
        >
          {/* <Table.Body>
            {redemptions.map((row) => (
              <RedemptionTableRow
                item={row}
                manageRedemption={manageRedemptions}
                key={row.id}
                handleOpenModal={handleOpenModal}
                setModalRedemptionId={setEditRedemptionId}
              />
            ))}
          </Table.Body> */}
        </Table>
      </Card>
      <EditeModal open={openModal} onCancel={handleCloseModal} onOk={handleOkModal} redemptiondId={editRedemptionId} />
    </>
  );
}