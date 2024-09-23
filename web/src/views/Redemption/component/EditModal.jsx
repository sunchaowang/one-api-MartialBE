import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { renderQuotaWithPrompt, showSuccess, showError, downloadTextAsFile, trims } from '@/utils/common';
import { API } from '@/utils/api';

const getValidationSchema = (t) =>
  Yup.object().shape({
    is_edit: Yup.boolean(),
    name: Yup.string().required(t('validation.requiredName')),
    quota: Yup.number().min(0, t('redemption_edit.requiredQuota')).required(t('validation.requiredQuota')),
    count: Yup.number()
      .when('is_edit', {
        is: false,
        then: Yup.number().min(1, t('redemption_edit.requiredCount')),
        otherwise: Yup.number()
      })
      .required(t('validation.requiredCount'))
  });

const originInputs = {
  is_edit: false,
  name: '',
  quota: 100000,
  count: 1
};

const EditModal = ({ open, redemptiondId, onCancel, onOk }) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState(originInputs);

  const submit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    values = trims(values);
    let res;
    try {
      if (values.is_edit) {
        res = await API.put(`/api/redemption/`, { ...values, id: parseInt(redemptiondId) });
      } else {
        res = await API.post(`/api/redemption/`, values);
      }
      const { success, message, data } = res.data;
      if (success) {
        if (values.is_edit) {
          showSuccess(t('redemption_edit.editOk'));
        } else {
          showSuccess(t('redemption_edit.addOk'));
          if (data.length > 1) {
            let text = '';
            for (let i = 0; i < data.length; i++) {
              text += data[i] + '\n';
            }
            downloadTextAsFile(text, `${values.name}.txt`);
          }
        }
        setSubmitting(false);
        setStatus({ success: true });
        onOk(true);
      } else {
        showError(message);
        setErrors({ submit: message });
      }
    } catch (error) {
      setSubmitting(false);
    }
  };

  const loadRedemptiond = async () => {
    try {
      let res = await API.get(`/api/redemption/${redemptiondId}`);
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
    if (redemptiondId) {
      loadRedemptiond();
    } else {
      setInputs(originInputs);
    }
  }, [redemptiondId]);

  const formik = useFormik({
    initialValues: inputs,
    validationSchema: getValidationSchema(t),
    onSubmit: submit,
    enableReinitialize: true
  });

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onClose={onCancel}
      title={redemptiondId ? t('common.edit') : t('common.create')}
      footer={[
        <Button onClick={onCancel}>{t('common.cancel')}</Button>,
        <Button type="primary" onClick={formik.handleSubmit}>
          {t('common.submit')}
        </Button>
      ]}
    >
      <Form layout="vertical">
        <Form.Item
          label={t('redemptionPage.headLabels.name')}
          required={true}
          validateStatus={formik.touched.name && formik.errors.name ? 'error' : ''}
          help={formik.touched.name && formik.errors.name}
        >
          <Input name="name" value={formik.values.name} onBlur={formik.handleBlur} onChange={formik.handleChange} />
        </Form.Item>

        <Form.Item
          label={t('redemptionPage.headLabels.quota')}
          required={true}
          validateStatus={formik.touched.quota && formik.errors.quota ? 'error' : ''}
          help={formik.touched.quota && formik.errors.quota}
        >
          <InputNumber
            name="quota"
            value={formik.values.quota}
            onBlur={formik.handleBlur}
            onChange={(value) => formik.setFieldValue('quota', value)}
            addonAfter={renderQuotaWithPrompt(formik.values.quota)}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {!formik.values.is_edit && (
          <Form.Item
            label={t('redemption_edit.number')}
            required={true}
            validateStatus={formik.touched.count && formik.errors.count ? 'error' : ''}
            help={formik.touched.count && formik.errors.count}
          >
            <InputNumber
              name="count"
              value={formik.values.count}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditModal;

EditModal.propTypes = {
  open: PropTypes.bool,
  redemptiondId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};