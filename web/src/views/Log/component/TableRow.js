import PropTypes from 'prop-types';

import { TableRow, TableCell, Stack } from '@mui/material';

import { timestamp2string, renderQuota } from '@/utils/common';
import Label from '@/ui-component/Label';
import LogType from '../type/LogType';
import { Button, Card, Grid, Table, Tag } from '@arco-design/web-react';

function renderType(type) {
  const typeOption = LogType[type];
  if (typeOption) {
    return <Tag color={typeOption.color}> {typeOption.text} </Tag>;
  } else {
    return <Tag color="red"> 未知 </Tag>;
  }
}

function requestTimeLabelOptions(request_time) {
  let color = 'red';
  if (request_time === 0) {
    color = '';
  } else if (request_time <= 1000) {
    color = 'green';
  } else if (request_time <= 3000) {
    color = 'green';
  } else if (request_time <= 5000) {
    color = 'arcoblue';
  }

  return color;
}

function requestTSLabelOptions(request_ts) {
  let color = 'green';
  if (request_ts === 0) {
    color = '';
  } else if (request_ts <= 10) {
    color = 'red';
  } else if (request_ts <= 15) {
    color = 'green';
  } else if (request_ts <= 20) {
    color = 'green';
  }

  return color;
}

export default function LogTableRow({ item, userIsAdmin }) {
  let request_time = item.request_time / 1000;
  let request_time_str = request_time.toFixed(2) + ' s';
  let request_ts = 0;
  let request_ts_str = '';
  if (request_time > 0 && item.completion_tokens > 0) {
    request_ts = (item.completion_tokens ? item.completion_tokens : 1) / request_time;
    request_ts_str = request_ts.toFixed(2) + ' t/s';
  }

  return (
    <>
      <TableRow tabIndex={item.id}>
        <TableCell>{timestamp2string(item.created_at)}</TableCell>

        {userIsAdmin && (
          <TableCell>
            <Stack direction={'column'}>
              {item.type === 2 ? (
                <>
                  <div>
                    <Tag>{item.channel_id} </Tag>
                  </div>
                  {item.channel?.name}
                </>
              ) : (
                ''
              )}
            </Stack>
          </TableCell>
        )}
        {userIsAdmin && (
          <TableCell>
            <Stack direction={'column'} width={'auto'}>
              <div>
                <Tag variant={'outlined'}>{item.user_id}</Tag>
              </div>
              {item.username}
            </Stack>
          </TableCell>
        )}
        <TableCell>{item.token_name && <Tag size={'small'}>{item.token_name}</Tag>}</TableCell>
        <TableCell>{renderType(item.type)}</TableCell>
        <TableCell>
          {item.model_name && (
            <Tag color="arcoblue" bordered>
              {item.model_name}
            </Tag>
          )}
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <Tag color={requestTimeLabelOptions(item.request_time)}> {item.request_time == 0 ? '无' : request_time_str} </Tag>
            {request_ts_str && (
              <Tag size={'small'} color={requestTSLabelOptions(request_ts)}>
                {' '}
                {request_ts_str}{' '}
              </Tag>
            )}
          </Stack>
        </TableCell>
        <TableCell>{String(item.type) === LogType['2'].value ? item.prompt_tokens || '0' : ''}</TableCell>
        <TableCell>{String(item.type) === LogType['2'].value ? item.completion_tokens || '0' : ''}</TableCell>
        <TableCell>{String(item.type) === LogType['2'].value ? (item.quota ? renderQuota(item.quota, 6) : '$0') : ''}</TableCell>
        <TableCell>{item.content}</TableCell>
      </TableRow>
    </>
  );
}

LogTableRow.propTypes = {
  item: PropTypes.object,
  userIsAdmin: PropTypes.bool
};
