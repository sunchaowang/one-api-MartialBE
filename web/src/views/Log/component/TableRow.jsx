import PropTypes from 'prop-types';

import { TableRow, TableCell, Stack } from '@mui/material';

import { timestamp2string, renderQuota } from '@/utils/common';
import Label from '@/ui-component/Label';
import LogType from '../type/LogType';
import { Space, Tag, Typography } from 'antd';
import { stringToTagColor } from '@/utils/common';
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
    color = 'blue';
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

function requestTsText(item) {
  let request_time = item.request_time / 1000;
  let request_time_str = request_time.toFixed(2) + ' s';
  let request_ts = 0;
  let request_ts_str = '';
  if (request_time > 0 && item.completion_tokens > 0) {
    request_ts = (item.completion_tokens ? item.completion_tokens : 1) / request_time;
    request_ts_str = request_ts.toFixed(2) + ' t/s';
  }
  return {
    request_ts,
    request_ts_str,
    request_time,
    request_time_str
  };
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

export function tableRowColumns(t, userIsAdmin) {
  return [
    {
      id: 'created_at',
      label: t('logPage.timeLabel'),
      disableSort: false,
      render: (col, item, index) => timestamp2string(item.created_at),
      width: 120,
      onCell: (record) => {
        return {
          style: {
            minWidth: 200
          }
        };
      }
    },
    {
      id: 'channel_id',
      label: t('logPage.channelLabel'),
      disableSort: false,
      hide: !userIsAdmin,
      width: 250,
      render: (col, item, index) =>
        item.type === 2 ? (
          <>
            <div>
              <Tag>{item.channel_id} </Tag>
            </div>
            {item.channel?.name}
          </>
        ) : (
          ''
        )
    },
    {
      id: 'user_id',
      label: t('logPage.userLabel'),
      disableSort: false,
      hide: !userIsAdmin,
      render: (col, item) => (
        <>
          <div>
            <Tag>{item.user_id} </Tag>
          </div>
          {item.username}
        </>
      ),
      onCell: (record) => {
        return {
          style: {
            minWidth: 100
          }
        };
      }
    },
    {
      id: 'token_name',
      label: t('logPage.tokenLabel'),
      disableSort: false,
      render: (col, item, index) => item.token_name && <Tag size={'small'}>{item.token_name}</Tag>,
      width: 120
    },
    {
      id: 'directGroup',
      label: '令牌分组',
      disableSort: false,
      render: (col, item, index) =>
        item.type &&
        (String(item.type) === LogType['2'].value ? (
          <Tag color={item.token_group === 'default' ? 'default' : stringToTagColor(item.token_group)}>{item.token_group}</Tag>
        ) : (
          ''
        ))
    },
    {
      id: 'model_name',
      label: t('logPage.modelLabel'),
      disableSort: false,
      render: (col, item, index) => {
        return (
          item.model_name && (
            <Tag color="blue" bordered>
              {item.model_name}
            </Tag>
          )
        );
      }
    },
    {
      id: 'duration',
      label: t('logPage.durationLabel'),
      tooltip: t('logPage.durationTooltip'),
      disableSort: true,
      render: (col, item, index) =>
        String(item.type) === LogType['2'].value ? (
          <Space direction={'vertical'} size={5}>
            <Tag color={requestTimeLabelOptions(item.request_time)}>
              {' '}
              {item.request_time == 0 ? '无' : requestTsText(item).request_time_str}{' '}
            </Tag>
            {requestTsText(item).request_ts_str && (
              <Tag size={'small'} color={requestTSLabelOptions(requestTsText(item).request_ts)}>
                {' '}
                {requestTsText(item).request_ts_str}{' '}
              </Tag>
            )}
          </Space>
        ) : (
          ''
        )
    },
    {
      id: 'message',
      label: t('logPage.inputLabel'),
      disableSort: true,
      render: (col, item, index) => (String(item.type) === LogType['2'].value ? item.prompt_tokens || '0' : ''),
      onCell: () => {
        return {
          style: {
            minWidth: 80
          }
        };
      }
    },
    {
      id: 'completion',
      label: t('logPage.outputLabel'),
      disableSort: true,
      render: (col, item, index) => (String(item.type) === LogType['2'].value ? item.completion_tokens || '0' : ''),
      onCell: () => {
        return {
          style: {
            minWidth: 80
          }
        };
      }
    },
    {
      id: 'quota',
      label: t('logPage.quotaLabel'),
      disableSort: true,
      render: (col, item, index) => (String(item.type) === LogType['2'].value ? (item.quota ? renderQuota(item.quota, 6) : '$0') : ''),
      onCell: () => {
        return {
          style: {
            minWidth: 100
          }
        };
      }
    },
    {
      id: 'detail',
      label: t('logPage.detailLabel'),
      disableSort: true,
      render: (col, item, index) => (
        <Space direction={'vertical'} size={8}>
          {renderType(item.type)}
          <Typography.Text>{item.content}</Typography.Text>
          <Typography.Text>{item.request_ip}</Typography.Text>
        </Space>
      ),
      onCell: () => {
        return {
          style: {
            minWidth: 250
          }
        };
      }
    }
  ]
    .filter((c) => !c.hide)
    .map((c) => ({ ...c, title: c.label, dataIndex: c.id }));
}

LogTableRow.propTypes = {
  item: PropTypes.object,
  userIsAdmin: PropTypes.bool
};
