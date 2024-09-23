import PropTypes from 'prop-types';

import { useState } from 'react';
import { Popover, Table, Menu, Button, Row, Popconfirm, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { timestamp2string, renderQuota, copy } from '@/utils/common';
import { IconDotsVertical, IconEdit, IconTrash, IconCaretDownFilled, IconCopy, IconMessageChatbot } from '@tabler/icons-react';
// export default function RedemptionTableRow({ item, manageRedemption, handleOpenModal, setModalRedemptionId }) {
//   const { t } = useTranslation();
//   const [open, setOpen] = useState(null);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [statusSwitch, setStatusSwitch] = useState(item.status);

//   const handleDeleteOpen = () => {
//     handleCloseMenu();
//     setOpenDelete(true);
//   };

//   const handleDeleteClose = () => {
//     setOpenDelete(false);
//   };

//   const handleOpenMenu = (event) => {
//     setOpen(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setOpen(null);
//   };

//   const handleStatus = async () => {
//     const switchValue = statusSwitch === 1 ? 2 : 1;
//     const { success } = await manageRedemption(item.id, 'status', switchValue);
//     if (success) {
//       setStatusSwitch(switchValue);
//     }
//   };

//   const handleDelete = async () => {
//     handleCloseMenu();
//     await manageRedemption(item.id, 'delete', '');
//   };

//   return (
//     <>
//       <Table.Row>
//         <Table.Cell>{item.id}</Table.Cell>
//         <Table.Cell>{item.name}</Table.Cell>
//         <Table.Cell>
//           {item.status !== 1 && item.status !== 2 ? (
//             <Tag color={item.status === 3 ? 'success' : 'orange'}>
//               {item.status === 3 ? t('analytics_index.used') : t('common.unknown')}
//             </Tag>
//           ) : (
//             <Switch checked={statusSwitch === 1} onChange={handleStatus} />
//           )}
//         </Table.Cell>
//         <Table.Cell>{renderQuota(item.quota)}</Table.Cell>
//         <Table.Cell>{timestamp2string(item.created_time)}</Table.Cell>
//         <Table.Cell>{item.redeemed_time ? timestamp2string(item.redeemed_time) : t('redemptionPage.unredeemed')}</Table.Cell>
//         <Table.Cell>
//           <Space>
//             <Button type="primary" size="small" onClick={() => copy(item.key, t('topupCard.inputLabel'))}>
//               {t('token_index.copy')}
//             </Button>
//             <Button icon={<MoreOutlined />} onClick={handleOpenMenu} />
//           </Space>
//         </Table.Cell>
//       </Table.Row>

//       <Popover
//         visible={!!open}
//         trigger="click"
//         content={
//           <Menu>
//             <Menu.Item
//               disabled={item.status !== 1 && item.status !== 2}
//               onClick={() => {
//                 handleCloseMenu();
//                 handleOpenModal();
//                 setModalRedemptionId(item.id);
//               }}
//             >
//               <EditOutlined />
//               {t('common.edit')}
//             </Menu.Item>
//             <Menu.Item onClick={handleDeleteOpen} danger>
//               <DeleteOutlined />
//               {t('common.delete')}
//             </Menu.Item>
//           </Menu>
//         }
//       >
//         <Button icon={<MoreOutlined />} onClick={handleOpenMenu} />
//       </Popover>

//       <Modal
//         visible={openDelete}
//         onCancel={handleDeleteClose}
//         onOk={handleDelete}
//         okText={t('common.delete')}
//         cancelText={t('common.close')}
//         okButtonProps={{ danger: true }}
//       >
//         <p>
//           {t('redemptionPage.delTip')} {item.name}？
//         </p>
//       </Modal>
//     </>
//   );
// }

// RedemptionTableRow.propTypes = {
//   item: PropTypes.object,
//   manageRedemption: PropTypes.func,
//   handleOpenModal: PropTypes.func,
//   setModalRedemptionId: PropTypes.func
// };

// Table Render
// text, record, index
export const RedemptionTableRowRender = (text, record, index, column, t, manageRedemptions) => {
  const handleDelete = async () => {
    await manageRedemptions(record.id, 'delete', '');
  };
  if (column === 'status') {
    return <Tag color={text === 3 ? 'blue' : 'default'}>{text === 3 ? t('analytics_index.used') : t('common.unknown')}</Tag>;
  }
  if (column === 'quota') {
    return renderQuota(text);
  }
  if (column === 'created_time') {
    return timestamp2string(text);
  }
  if (column === 'redeemed_time') {
    return text ? timestamp2string(text) : t('redemptionPage.unredeemed');
  }
  if (column === 'action') {
    return (
      <>
        <Button type="link" icon={<IconCopy size={14} />} size="small" onClick={() => copy(record.key, t('topupCard.inputLabel'))}>
          {t('token_index.copy')}
        </Button>

        <Popconfirm
          content={
            <Space direction={'vertical'} size={16}>
              <Row>是否确认删除</Row>
              <Row>{record.name}</Row>
            </Space>
          }
          title="温馨提示"
          trigger="click"
          onConfirm={handleDelete}
        >
          <Button type={'link'} danger={true} icon={<IconTrash size={14} />} size={'small'}></Button>
        </Popconfirm>
      </>
    );
  }
  return <span>{text}</span>;
};
RedemptionTableRowRender.propTypes = {
  text: PropTypes.any,
  record: PropTypes.object,
  index: PropTypes.number,
  column: PropTypes.string
};