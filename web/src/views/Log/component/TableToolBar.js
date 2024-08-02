import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { IconUser, IconKey, IconBrandGithubCopilot, IconSitemap } from '@tabler/icons-react';
import { Card, Form, Input, DatePicker } from '@arco-design/web-react';
import { InputAdornment, OutlinedInput, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LogType from '../type/LogType';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/zh-cn';
import { isMobile } from '@/utils/common';
// ----------------------------------------------------------------------
export default function NewTableToolBar({ filterName, handleFilterName, userIsAdmin }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Form layout={isMobile() ? 'vertical' : 'inline'}>
        <Form.Item label={t('tableToolBar.tokenName')}>
          <Input
            name={'token_name'}
            placeholder={t('tableToolBar.tokenName')}
            onChange={(value) => handleFilterName({ target: { name: 'token_name', value } })}
            allowClear
          ></Input>
        </Form.Item>
        <Form.Item label={t('tableToolBar.modelName')}>
          <Input
            name={'model_name'}
            placeholder={t('tableToolBar.modelName')}
            onChange={(value) => handleFilterName({ target: { name: 'model_name', value } })}
            allowClear
          ></Input>
        </Form.Item>
        {/*startTime*/}
        <Form.Item label={t('tableToolBar.startTime')}>
          <DatePicker
            placeholder={t('tableToolBar.startTime')}
            format={(value) => `${value.format('YYYY-MM-DD HH:mm:ss')}`}
            onChange={(dataString, date) => {
              if (dataString === null) {
                handleFilterName({ target: { name: 'start_timestamp', value: 0 } });
                return;
              }
              handleFilterName({ target: { name: 'start_timestamp', value: date.unix() } });
            }}
            style={{ width: '100%' }}
          ></DatePicker>
        </Form.Item>
        {/*endTime*/}
        <Form.Item label={t('tableToolBar.endTime')}>
          <DatePicker
            placeholder={t('tableToolBar.endTime')}
            format={(value) => `${value.format('YYYY-MM-DD HH:mm:ss')}`}
            onChange={(dataString, date) => {
              if (dataString === null) {
                handleFilterName({ target: { name: 'end_timestamp', value: 0 } });
                return;
              }
              handleFilterName({ target: { name: 'end_timestamp', value: date.unix() } });
            }}
            style={{ width: '100%' }}
            defaultValue={filterName.end_timestamp === 0 ? null : dayjs.unix(filterName.end_timestamp)}
          ></DatePicker>
        </Form.Item>
        {/*channelId*/}
        {userIsAdmin && (
          <Form.Item label={t('tableToolBar.channelId')}>
            <Input
              name={'channel_id'}
              placeholder={t('tableToolBar.channelId')}
              onChange={(value) => handleFilterName({ target: { name: 'channel_id', value } })}
              allowClear
            ></Input>
          </Form.Item>
        )}
        {userIsAdmin && (
          <Form.Item label={t('tableToolBar.username')}>
            <Input
              name={'username'}
              placeholder={t('tableToolBar.username')}
              onChange={(value) => handleFilterName({ target: { name: 'username', value } })}
              allowClear
            ></Input>
          </Form.Item>
        )}
        {userIsAdmin && (
          <Form.Item label={'用户ID'}>
            <Input
              name={'user_id'}
              placeholder={t('用户ID')}
              onChange={(value) => handleFilterName({ target: { name: 'user_id', value } })}
              allowClear
            ></Input>
          </Form.Item>
        )}
      </Form>
    </>
  );
}

export function TableToolBar({ filterName, handleFilterName, userIsAdmin }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const grey500 = theme.palette.grey[500];

  return (
    <>
      <Card>
        <FormControl>
          <InputLabel htmlFor="channel-token_name-label">{t('tableToolBar.tokenName')}</InputLabel>
          <OutlinedInput
            id="token_name"
            name="token_name"
            sx={{
              minWidth: '100%'
            }}
            label={t('tableToolBar.tokenName')}
            value={filterName.token_name}
            onChange={handleFilterName}
            placeholder={t('tableToolBar.tokenName')}
            startAdornment={
              <InputAdornment position="start">
                <IconKey stroke={1.5} size="20px" color={grey500} />
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="channel-model_name-label">{t('tableToolBar.modelName')}</InputLabel>
          <OutlinedInput
            id="model_name"
            name="model_name"
            sx={{
              minWidth: '100%'
            }}
            label={t('tableToolBar.modelName')}
            value={filterName.model_name}
            onChange={handleFilterName}
            placeholder={t('tableToolBar.modelName')}
            startAdornment={
              <InputAdornment position="start">
                <IconBrandGithubCopilot stroke={1.5} size="20px" color={grey500} />
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
            <DateTimePicker
              label={t('tableToolBar.startTime')}
              ampm={false}
              name="start_timestamp"
              value={filterName.start_timestamp === 0 ? null : dayjs.unix(filterName.start_timestamp)}
              onChange={(value) => {
                if (value === null) {
                  handleFilterName({ target: { name: 'start_timestamp', value: 0 } });
                  return;
                }
                handleFilterName({ target: { name: 'start_timestamp', value: value.unix() } });
              }}
              slotProps={{
                actionBar: {
                  actions: ['clear', 'today', 'accept']
                }
              }}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
            <DateTimePicker
              label={t('tableToolBar.endTime')}
              name="end_timestamp"
              ampm={false}
              value={filterName.end_timestamp === 0 ? null : dayjs.unix(filterName.end_timestamp)}
              onChange={(value) => {
                if (value === null) {
                  handleFilterName({ target: { name: 'end_timestamp', value: 0 } });
                  return;
                }
                handleFilterName({ target: { name: 'end_timestamp', value: value.unix() } });
              }}
              slotProps={{
                actionBar: {
                  actions: ['clear', 'today', 'accept']
                }
              }}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl sx={{ minWidth: '22%' }}>
          <InputLabel htmlFor="channel-log_type-label">{t('tableToolBar.type')}</InputLabel>
          <Select
            id="channel-type-label"
            label={t('tableToolBar.type')}
            value={filterName.log_type}
            name="log_type"
            onChange={handleFilterName}
            sx={{
              minWidth: '100%'
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200
                }
              }
            }}
          >
            {Object.values(LogType).map((option) => {
              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.text}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Card>

      {userIsAdmin && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2, md: 4 }} padding={'24px'}>
          <FormControl>
            <InputLabel htmlFor="channel-channel_id-label">{t('tableToolBar.channelId')}</InputLabel>
            <OutlinedInput
              id="channel_id"
              name="channel_id"
              sx={{
                minWidth: '100%'
              }}
              label={t('tableToolBar.channelId')}
              value={filterName.channel_id}
              onChange={handleFilterName}
              placeholder={t('tableToolBar.channelId')}
              startAdornment={
                <InputAdornment position="start">
                  <IconSitemap stroke={1.5} size="20px" color={grey500} />
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="channel-username-label">{t('tableToolBar.username')}</InputLabel>
            <OutlinedInput
              id="username"
              name="username"
              sx={{
                minWidth: '100%'
              }}
              label={t('tableToolBar.username')}
              value={filterName.username}
              onChange={handleFilterName}
              placeholder={t('tableToolBar.username')}
              startAdornment={
                <InputAdornment position="start">
                  <IconUser stroke={1.5} size="20px" color={grey500} />
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl size="small">
            <InputLabel htmlFor="channel-username-label">用户ID</InputLabel>
            <OutlinedInput
              id="user_id"
              name="user_id"
              sx={{
                minWidth: '100%'
              }}
              label="用户ID"
              value={filterName.user_id}
              onChange={handleFilterName}
              placeholder="用户ID"
              startAdornment={
                <InputAdornment position="start">
                  <IconUser stroke={1.5} size="20px" color={grey500} />
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
      )}
    </>
  );
}

TableToolBar.propTypes = {
  filterName: PropTypes.object,
  handleFilterName: PropTypes.func,
  userIsAdmin: PropTypes.bool
};
