import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { Modal, Form, Input, InputNumber, Switch, DatePicker, Button, Alert, Divider, Space } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { renderQuotaWithPrompt, showSuccess, showError } from '@/utils/common';
import { API } from '@/utils/api';
import 'dayjs/locale/zh-cn';

const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  is_edit: Yup.boolean(),
  name: Yup.string().required('名称不能为空'),
  remain_quota: Yup.number().min(0, '必须大于等于0'),
  expired_time: Yup.number(),
  unlimited_quota: Yup.boolean()
});

const originInputs = {
  is_edit: false,
  name: '',
  remain_quota: 0,
  expired_time: -1,
  unlimited_quota: true,
  chat_cache: false,
  model_limits_enabled: false,
  model_limits: '',
  channel_limits_enabled: false,
  channel_limits: ''
};

const EditModal = ({ open, tokenId, onCancel, onOk, userIsAdmin }) => {
  const { t } = useTranslation();
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
  }, [tokenId]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={tokenId ? t('token_index.editToken') : t('token_index.createToken')}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      <Divider />
      <Alert message={t('token_index.quotaNote')} type="info" showIcon style={{ marginBottom: 16 }} />
      <Formik initialValues={inputs} enableReinitialize validationSchema={validationSchema} onSubmit={submit}>
        {({ errors, touched, values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={t('token_index.name')}
              validateStatus={touched.name && errors.name ? 'error' : ''}
              help={touched.name && errors.name}
            >
              <Input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
            </Form.Item>

            <Form.Item label={t('token_index.expiryTime')}>
              <DatePicker
                showTime
                disabled={values.expired_time === -1}
                value={values.expired_time !== -1 ? dayjs.unix(values.expired_time) : null}
                onChange={(date) => setFieldValue('expired_time', date ? date.unix() : -1)}
              />
              <Switch
                checked={values.expired_time === -1}
                onChange={(checked) => setFieldValue('expired_time', checked ? -1 : dayjs().unix())}
                style={{ marginLeft: 8 }}
              />
              <span style={{ marginLeft: 8 }}>{t('token_index.neverExpires')}</span>
            </Form.Item>

            <Form.Item
              label={t('token_index.quota')}
              validateStatus={touched.remain_quota && errors.remain_quota ? 'error' : ''}
              help={touched.remain_quota && errors.remain_quota}
            >
              <InputNumber
                name="remain_quota"
                value={values.remain_quota}
                onChange={(value) => setFieldValue('remain_quota', value)}
                onBlur={handleBlur}
                disabled={values.unlimited_quota}
                addonAfter={renderQuotaWithPrompt(values.remain_quota, 6)}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Switch checked={values.unlimited_quota} onChange={(checked) => setFieldValue('unlimited_quota', checked)} />
                <span>{t('token_index.unlimitedQuota')}</span>
              </Space>
            </Form.Item>

            {siteInfo.chat_cache_enabled && (
              <Form.Item>
                <Space>
                  <Switch checked={values.chat_cache} onChange={(checked) => setFieldValue('chat_cache', checked)} />
                  <span>{t('token_index.enableCache')}</span>
                </Space>
              </Form.Item>
            )}

            <Form.Item label="模型限制">
              <Input.TextArea
                name="model_limits"
                value={values.model_limits}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!values.model_limits_enabled}
                placeholder="用逗号分隔模型名称，如：gpt-3.5-turbo,text-davinci-003"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Switch checked={values.model_limits_enabled} onChange={(checked) => setFieldValue('model_limits_enabled', checked)} />
                <span>模型限制</span>
              </Space>
            </Form.Item>

            {userIsAdmin && (
              <>
                <Form.Item label="渠道限制">
                  <Input.TextArea
                    name="channel_limits"
                    value={values.channel_limits}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!values.channel_limits_enabled}
                    placeholder='用逗号分隔渠道名称'
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Switch
                      checked={values.channel_limits_enabled}
                      onChange={(checked) => setFieldValue('channel_limits_enabled', checked)}
                    />
                    <span>渠道限制</span>
                  </Space>
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Space>
                <Button onClick={onCancel}>{t('token_index.cancel')}</Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  {t('token_index.submit')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

EditModal.propTypes = {
  open: PropTypes.bool,
  tokenId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  userIsAdmin: PropTypes.bool
};

export default EditModal;
