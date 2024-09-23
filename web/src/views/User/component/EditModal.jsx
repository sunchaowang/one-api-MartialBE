import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { renderQuotaWithPrompt, showSuccess, showError, trims } from '@/utils/common';
import { API } from '@/utils/api';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  is_edit: Yup.boolean(),
  username: Yup.string().required('userPage.usernameRequired'),
  display_name: Yup.string(),
  password: Yup.string().when('is_edit', {
    is: false,
    then: Yup.string().required('userPage.passwordRequired'),
    otherwise: Yup.string()
  }),
  group: Yup.string().when('is_edit', {
    is: false,
    then: Yup.string().required('userPage.groupRequired'),
    otherwise: Yup.string()
  }),
  quota: Yup.number().when('is_edit', {
    is: false,
    then: Yup.number().min(0, 'userPage.quotaMin'),
    otherwise: Yup.number()
  })
});

const originInputs = {
  is_edit: false,
  username: '',
  display_name: '',
  password: '',
  group: 'default',
  quota: 0,
  updateQuota: 0,
  updateQuotaRemark: ''
};

const EditModal = ({ visible, userId, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [groupOptions, setGroupOptions] = useState([]);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: originInputs,
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      setSubmitting(true);
      values = trims(values);
      try {
        let res;
        if (values.is_edit) {
          res = await API.put(`/api/user/`, { ...values, id: parseInt(userId) });
        } else {
          res = await API.post(`/api/user/`, values);
        }
        const { success, message } = res.data;
        if (success) {
          showSuccess(t(values.is_edit ? 'userPage.saveSuccess' : 'userPage.createSuccess'));
          setSubmitting(false);
          setStatus({ success: true });
          onOk(true);
        } else {
          showError(message);
          setErrors({ submit: message });
        }
      } catch (error) {
        showError(error.message);
      }
      setSubmitting(false);
    }
  });

  const [quotaPrompt, setQuotaPrompt] = useState('');
  useEffect(() => {
    setQuotaPrompt(renderQuotaWithPrompt(formik.values.quota, 6));
    console.log(formik.values);
  }, [formik.values.quota]);

  const loadUser = async () => {
    try {
      let res = await API.get(`/api/user/${userId}`);
      const { success, message, data } = res.data;
      if (success) {
        data.is_edit = true;
        formik.setValues(data);
        form.setFieldsValue(data);
      } else {
        showError(message);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const fetchGroups = async () => {
    try {
      let res = await API.get(`/api/group/`);
      setGroupOptions(res.data.data);
    } catch (error) {
      showError(error.message);
    }
  };

  useEffect(() => {
    fetchGroups();
    if (userId) {
      loadUser();
    } else {
      formik.setValues(originInputs);
      form.resetFields();
    }
  }, [userId]);

  return (
    <Modal
      title={userId ? t('userPage.editUser') : t('userPage.createUser')}
      open={visible}
      onCancel={onCancel}
      footer={
        <>
          <Space>
            <Button onClick={onCancel}>{t('userPage.cancel')}</Button>
            <Button type="primary" onClick={formik.handleSubmit} loading={formik.isSubmitting}>
              {t('userPage.submit')}
            </Button>
          </Space>
        </>
      }
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label={t('userPage.username')}
          validateStatus={formik.touched.username && formik.errors.username ? 'error' : ''}
          help={formik.touched.username && formik.errors.username ? t(formik.errors.username) : ''}
        >
          <Input onChange={(e) => formik.setFieldValue('username', e.target.value)} />
        </Form.Item>

        <Form.Item name="display_name" label={t('userPage.displayName')}>
          <Input onChange={(e) => formik.setFieldValue('display_name', e.target.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('userPage.password')}
          validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
          help={formik.touched.password && formik.errors.password ? t(formik.errors.password) : ''}
        >
          <Input.Password
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            onChange={(e) => formik.setFieldValue('password', e.target.value)}
          />
        </Form.Item>

        {formik.values.is_edit && (
          <>
            <Form.Item name="quota" label={t('userPage.quota')}>
              <Input addonAfter={<>{quotaPrompt}</>} parser={(value) => value.replace(/[^\d.-]/g, '')} />
            </Form.Item>

            <Form.Item name="updateQuota" label="额度修改">
              <Input
                addonAfter={<>{renderQuotaWithPrompt(formik.values.updateQuota, 6)}</>}
                parser={(value) => value.replace(/[^\d.-]/g, '')}
                onChange={(value) => formik.setFieldValue('updateQuota', value)}
              />
            </Form.Item>

            <Form.Item name="updateQuotaRemark" label="额度修改备注">
              <Input onChange={(e) => formik.setFieldValue('updateQuotaRemark', e.target.value)} />
            </Form.Item>

            <Form.Item
              name="group"
              label={t('userPage.group')}
              validateStatus={formik.touched.group && formik.errors.group ? 'error' : ''}
              help={formik.touched.group && formik.errors.group ? t(formik.errors.group) : ''}
            >
              <Select onChange={(value) => formik.setFieldValue('group', value)}>
                {groupOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default EditModal;
