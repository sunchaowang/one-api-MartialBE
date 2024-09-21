import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import dayjs from 'dayjs';
import { Modal, Form, Input, InputNumber, Switch, DatePicker, Button, Alert, Divider, Space, Select, Tag, Typography, Drawer } from 'antd';
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
  channel_limits: '',
  token_group: ''
};

const EditModal = ({ open, tokenId, onCancel, onOk, userIsAdmin, tokenGroupRatio }) => {
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

  const formik = useFormik({
    initialValues: inputs,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: submit
  });

  return (
    <Drawer
      open={open}
      onCancel={onCancel}
      onClose={onCancel}
      title={tokenId ? t('token_index.editToken') : t('token_index.createToken')}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={formik.handleSubmit} loading={formik.isSubmitting}>
            提交
          </Button>
        </Space>
      }
      width={600}
      destroyOnClose={true}
    >
      <Alert message={t('token_index.quotaNote')} type="info" style={{ marginBottom: 16 }} />
      <Form layout="vertical">
        <Form.Item
          label={t('token_index.name')}
          validateStatus={formik.touched.name && formik.errors.name ? 'error' : ''}
          help={formik.touched.name && formik.errors.name}
        >
          <Input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        </Form.Item>

        <Form.Item label={'令牌分组'} name={'token_group'}>
          <Typography.Text style={{ display: 'none' }}>{JSON.stringify(tokenGroupRatio)}</Typography.Text>
          <Select
            name={'token_group'}
            value={formik.values.token_group}
            options={Object.keys(tokenGroupRatio)
              .map((key) => {
                return {
                  label: key,
                  value: key,
                  ratio: tokenGroupRatio[key]
                };
              })
              .map((item) => item)}
            onChange={(value) => formik.setFieldValue('token_group', value)}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {option.data.value}
                </span>
                <Tag>倍率 {option.data.ratio}</Tag>
              </Space>
            )}
          ></Select>
        </Form.Item>

        <Form.Item label={t('token_index.expiryTime')}>
          <DatePicker
            showTime
            disabled={formik.values.expired_time === -1}
            value={formik.values.expired_time !== -1 ? dayjs.unix(formik.values.expired_time) : null}
            onChange={(date) => formik.setFieldValue('expired_time', date ? date.unix() : -1)}
          />
          <Switch
            size={'small'}
            checked={formik.values.expired_time === -1}
            onChange={(checked) => formik.setFieldValue('expired_time', checked ? -1 : dayjs().unix())}
            style={{ marginLeft: 8 }}
          />
          <span style={{ marginLeft: 8 }}>{t('token_index.neverExpires')}</span>
        </Form.Item>

        <Form.Item
          label={t('token_index.quota')}
          validateStatus={formik.touched.remain_quota && formik.errors.remain_quota ? 'error' : ''}
          help={formik.touched.remain_quota && formik.errors.remain_quota}
        >
          <InputNumber
            name="remain_quota"
            value={formik.values.remain_quota}
            onChange={(value) => formik.setFieldValue('remain_quota', value)}
            onBlur={formik.handleBlur}
            disabled={formik.values.unlimited_quota}
            addonAfter={renderQuotaWithPrompt(formik.values.remain_quota, 6)}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Switch
              size={'small'}
              checked={formik.values.unlimited_quota}
              onChange={(checked) => formik.setFieldValue('unlimited_quota', checked)}
            />
            <span>{t('token_index.unlimitedQuota')}</span>
          </Space>
        </Form.Item>

        {/* {siteInfo.chat_cache_enabled && (
              <Form.Item>
                <Space>
                  <Switch size={'small'} checked={values.chat_cache} onChange={(checked) => setFieldValue('chat_cache', checked)} />
                  <span>{t('token_index.enableCache')}</span>
                </Space>
              </Form.Item>
            )} */}

        <Form.Item label="模型限制">
          <Input.TextArea
            name="model_limits"
            value={formik.values.model_limits}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!formik.values.model_limits_enabled}
            placeholder="用逗号分隔模型名称，如：gpt-3.5-turbo,text-davinci-003"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Switch
              size={'small'}
              checked={formik.values.model_limits_enabled}
              onChange={(checked) => formik.setFieldValue('model_limits_enabled', checked)}
            />
            <span>模型限制</span>
          </Space>
        </Form.Item>

        {userIsAdmin && (
          <>
            <Form.Item label="渠道限制">
              <Input.TextArea
                name="channel_limits"
                value={formik.values.channel_limits}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.channel_limits_enabled}
                placeholder="用逗号分隔渠道名称"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Switch
                  size={'small'}
                  checked={formik.values.channel_limits_enabled}
                  onChange={(checked) => formik.setFieldValue('channel_limits_enabled', checked)}
                />
                <span>渠道限制</span>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>
    </Drawer>
  );
};

EditModal.propTypes = {
  open: PropTypes.bool,
  tokenId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  userIsAdmin: PropTypes.bool,
  tokenGroupRatio: PropTypes.object
};

export default EditModal;