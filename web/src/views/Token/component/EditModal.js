import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { Drawer, Modal, Form, Input, InputNumber, Switch, DatePicker, Button, Alert, Divider, Space, Select, Tag, Typography } from 'antd';
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
  direct_group: 'default'
};

const EditModal = ({ open, tokenId, onCancel, onOk, userIsAdmin, _directGroupRatio }) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState(originInputs);
  const siteInfo = useSelector((state) => state.siteInfo);
  const [directGroupRatio, setDirectGroupRatio] = useState([]);
  const [form] = Form.useForm();

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
        setInputs(data);

        data.is_edit = true;
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

  useEffect(() => {
    if (_directGroupRatio) {
      console.log('directGroupRatio', _directGroupRatio);
      setDirectGroupRatio(() =>
        Object.keys(_directGroupRatio).map((key) => {
          return {
            label: key,
            value: key,
            ratio: _directGroupRatio[key]
          };
        })
      );
    }
  }, [_directGroupRatio]);

  return (
    <Drawer
      open={open}
      onClose={onCancel}
      title={tokenId ? t('token_index.editToken') : t('token_index.createToken')}
      width={800}
      destroyOnClose={true}
      footer={
        <Space>
          <Button onClick={onCancel}>{t('token_index.cancel')}</Button>
          <Button type="primary" onClick={() => form.submit()}>
            {t('token_index.submit')}
          </Button>
        </Space>
      }
    >
      <Alert message={t('token_index.quotaNote')} type="info" style={{ marginBottom: 16 }} />
      <Form form={form} layout="vertical" initialValues={inputs}>
        <Form.Item name="name" label={t('token_index.name')} rules={[{ required: true, message: '名称不能为空' }]}>
          <Input />
        </Form.Item>

        <Form.Item label={'令牌分组'} name={'direct_group'}>
          <Select
            options={directGroupRatio.map((item) => item)}
            optionRender={(option) => (
              <Space>
                <span role="img" aria-label={option.data.label}>
                  {option.data.value}
                </span>
                <Tag>倍率 {option.data.ratio}</Tag>
              </Space>
            )}
          />
        </Form.Item>

        <Form.Item label={t('token_index.expiryTime')} name="expired_time">
          <Space>
            <DatePicker showTime disabled={form.getFieldValue('expired_time') === -1} />
            <Form.Item name="never_expires" valuePropName="checked" noStyle>
              <Switch onChange={(checked) => form.setFieldsValue({ expired_time: checked ? -1 : null })} />
            </Form.Item>
            <span>{t('token_index.neverExpires')}</span>
          </Space>
        </Form.Item>

        <Form.Item name="remain_quota" label={t('token_index.quota')} rules={[{ type: 'number', min: 0, message: '必须大于等于0' }]}>
          <InputNumber
            disabled={form.getFieldValue('unlimited_quota')}
            addonAfter={renderQuotaWithPrompt(form.getFieldValue('remain_quota'), 6)}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item name="unlimited_quota" valuePropName="checked">
          <Space>
            <Switch />
            <span>{t('token_index.unlimitedQuota')}</span>
          </Space>
        </Form.Item>

        <Form.Item label="模型限制" name="model_limits">
          <Input.TextArea
            disabled={!form.getFieldValue('model_limits_enabled')}
            placeholder="用逗号分隔模型名称，如：gpt-3.5-turbo,text-davinci-003"
          />
        </Form.Item>

        <Form.Item name="model_limits_enabled" valuePropName="checked">
          <Space>
            <Switch />
            <span>模型限制</span>
          </Space>
        </Form.Item>

        {userIsAdmin && (
          <>
            <Form.Item label="渠道限制" name="channel_limits">
              <Input.TextArea disabled={!form.getFieldValue('channel_limits_enabled')} placeholder="用逗号分隔渠道名称" />
            </Form.Item>

            <Form.Item name="channel_limits_enabled" valuePropName="checked">
              <Space>
                <Switch />
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
  _directGroupRatio: PropTypes.object
};

export default EditModal;
