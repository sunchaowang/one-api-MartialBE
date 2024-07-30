import { Dialog, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import { useState } from 'react';
import QQGroupQCode from '@/assets/images/qq-group.jpg?url';
import { Button, Modal } from '@arco-design/web-react';
import { copy } from '@/utils/common';

export default function ContactButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCopyQQGroupNumber = () => {
    copy('924076327');
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="text" onClick={handleClickOpen}>
        联系方式
      </Button>
      <Modal
        visible={open}
        onCancel={handleClose}
        footer={[
          <Button type="text" onClick={handleCopyQQGroupNumber}>
            复制QQ群号
          </Button>,
          <Button type="primary" onClick={handleClose}>
            知道了
          </Button>
        ]}
      >
        <img
          src={QQGroupQCode}
          style={{
            maxHeight: '50vh',
            width: '100%'
          }}
        />
      </Modal>
    </>
  );
}
