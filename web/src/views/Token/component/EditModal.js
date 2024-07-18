import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Switch,
  FormControlLabel,
  FormHelperText
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderQuotaWithPrompt, showSuccess, showError } from '@/utils/common';
import { API } from '@/utils/api';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/zh-cn';

const validationSchema = Yup.object().shape({
  is_edit: Yup.boolean(),
  name: Yup.string().required('名称 不能为空'),
  remain_quota: Yup.number().min(0, '必须大于等于0'),
  expired_time: Yup.number(),
  unlimited_quota: Yup.boolean()
});

const originInputs = {
  is_edit: false,
  name: '',
  remain_quota: 0,
  expired_time: -1,
  unlimited_quota: false,
  chat_cache: false,
  model_limits_enabled: false,
  model_limits: '',
  channel_limits_enabled: false,
  channel_limits: ''
};

const EditModal = ({ open, tokenId, onCancel, onOk, userIsAdmin}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [inputs, setInputs] = useState(originInputs);
  const siteInfo = useSelector((state) => state.siteInfo);

  const submit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);

    values.remain_quota = parseInt(values.remain_quota);
    let res;

    try {
      if (values.is_edit) {
        res = await API.put(`/api/token/`, { ...values, id: parseInt(tokenId) });
      } else {
        res = await API.post(`/api/token/`, values);
      }
      const { success, message } = res.data;
      if (success) {
        if (values.is_edit) {
          showSuccess('令牌更新成功！');
        } else {
          showSuccess('令牌创建成功，请在列表页面点击复制获取令牌！');
        }
        setSubmitting(false);
        setStatus({ success: true });
        onOk(true);
      } else {
        showError(message);
        setErrors({ submit: message });
      }
    } catch (error) {
      return;
    }
  };

  const loadToken = async () => {
    try {
      let res = await API.get(`/api/token/${tokenId}`);
      const { success, message, data } = res.data;
      if (success) {
        data.is_edit = true;
        setInputs(data);
      } else {
        showError(message);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (tokenId) {
      loadToken().then();
    } else {
      setInputs(originInputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth={'md'}>
      <DialogTitle sx={{ margin: '0px', fontWeight: 700, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
        {tokenId ? t('token_index.editToken') : t('token_index.createToken')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Alert severity="info">{t('token_index.quotaNote')}</Alert>
        <Formik initialValues={inputs} enableReinitialize validationSchema={validationSchema} onSubmit={submit}>
          {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldError, setFieldValue, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit}>
              <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.otherInput }}>
                <InputLabel htmlFor="channel-name-label">{t('token_index.name')}</InputLabel>
                <OutlinedInput
                  id="channel-name-label"
                  label={t('token_index.name')}
                  type="text"
                  value={values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{ autoComplete: 'name' }}
                  aria-describedby="helper-text-channel-name-label"
                  size={'small'}
                />
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-tex-channel-name-label">
                    {errors.name}
                  </FormHelperText>
                )}
              </FormControl>
              {values.expired_time !== -1 && (
                <FormControl
                  fullWidth
                  error={Boolean(touched.expired_time && errors.expired_time)}
                  sx={{ ...theme.typography.otherInput }}
                  size={'small'}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
                    <DateTimePicker
                      label={t('token_index.expiryTime')}
                      ampm={false}
                      value={dayjs.unix(values.expired_time)}
                      onError={(newError) => {
                        if (newError === null) {
                          setFieldError('expired_time', null);
                        } else {
                          setFieldError('expired_time', t('token_index.invalidDate'));
                        }
                      }}
                      onChange={(newValue) => {
                        setFieldValue('expired_time', newValue.unix());
                      }}
                      slotProps={{
                        actionBar: {
                          actions: ['today', 'accept']
                        }
                      }}
                    />
                  </LocalizationProvider>
                  {errors.expired_time && (
                    <FormHelperText error id="helper-tex-channel-expired_time-label">
                      {errors.expired_time}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={values.expired_time === -1}
                    onClick={() => {
                      if (values.expired_time === -1) {
                        setFieldValue('expired_time', Math.floor(Date.now() / 1000));
                      } else {
                        setFieldValue('expired_time', -1);
                      }
                    }}
                  />
                }
                label={t('token_index.neverExpires')}
              />

              <FormControl fullWidth error={Boolean(touched.remain_quota && errors.remain_quota)} sx={{ ...theme.typography.otherInput }}>
                <InputLabel htmlFor="channel-remain_quota-label">{t('token_index.quota')}</InputLabel>
                <OutlinedInput
                  id="channel-remain_quota-label"
                  label={t('token_index.quota')}
                  type="number"
                  value={values.remain_quota}
                  name="remain_quota"
                  endAdornment={<InputAdornment position="end">{renderQuotaWithPrompt(values.remain_quota)}</InputAdornment>}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  aria-describedby="helper-text-channel-remain_quota-label"
                  disabled={values.unlimited_quota}
                  size={'small'}
                />

                {touched.remain_quota && errors.remain_quota && (
                  <FormHelperText error id="helper-tex-channel-remain_quota-label">
                    {errors.remain_quota}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth size={'small'}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.unlimited_quota === true}
                      onClick={() => {
                        setFieldValue('unlimited_quota', !values.unlimited_quota);
                      }}
                    />
                  }
                  label={t('token_index.unlimitedQuota')}
                />
                {siteInfo.chat_cache_enabled && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.chat_cache}
                        onClick={() => {
                          setFieldValue('chat_cache', !values.chat_cache);
                        }}
                      />
                    }
                    label={t('token_index.enableCache')}
                  />
                )}
              </FormControl>
              {/* 模型限制 */}
              <FormControl
                fullWidth
                error={Boolean(touched.model_limits && errors.model_limits)}
                sx={{ ...theme.typography.otherInput }}
                size={'small'}
              >
                <InputLabel htmlFor="channel-model_limits-label" size={'small'}>
                  模型限制
                </InputLabel>
                <OutlinedInput
                  id="channel-model_limits-label"
                  label="模型限制"
                  type="text"
                  value={values.model_limits}
                  name="model_limits"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{ autoComplete: 'model_limits' }}
                  aria-describedby="helper-text-channel-model_limits-label"
                  size={'small'}
                  disabled={!values.model_limits_enabled}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={values.model_limits_enabled}
                    onClick={() => {
                      setFieldValue('model_limits_enabled', !values.model_limits_enabled);
                    }}
                  />
                }
                label="模型限制"
              />
              {
                userIsAdmin &&
                <div>
                  {/* 渠道限制 */}
                  <FormControl
                    fullWidth
                    error={Boolean(touched.channel_limits && errors.channel_limits)}
                    sx={{ ...theme.typography.otherInput }}
                    size={'small'}
                  >
                    <InputLabel htmlFor="channel-channel_limits-label" size={'small'}>
                      渠道限制
                    </InputLabel>
                    <OutlinedInput
                      id="channel-channel_limits-label"
                      label="模型限制"
                      type="text"
                      value={values.channel_limits}
                      name="channel_limits"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{ autoComplete: 'channel_limits' }}
                      aria-describedby="helper-text-channel-channel_limits-label"
                      size={'small'}
                      disabled={!values.channel_limits_enabled}
                    />
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.channel_limits_enabled}
                        onClick={() => {
                          setFieldValue('channel_limits_enabled', !values.channel_limits_enabled);
                        }}
                      />
                    }
                    label="渠道限制"
                  />
                </div>
              }

              <DialogActions>
                <Button onClick={onCancel}>{t('token_index.cancel')}</Button>
                <Button disableElevation disabled={isSubmitting} type="submit" variant="contained" color="primary">
                  {t('token_index.submit')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;

EditModal.propTypes = {
  open: PropTypes.bool,
  tokenId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};
