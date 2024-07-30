import React, { useEffect, useState } from 'react';
import { Typography } from '@arco-design/web-react';

const BaseCheckin = (props) => {
  return (
    <>
      {props?.check_in ? (
        <Typography.Text>已签到</Typography.Text>
      ) : (
        <>
          <Typography.Text>立即签到</Typography.Text>
        </>
      )}
    </>
  );
};

export default BaseCheckin;
