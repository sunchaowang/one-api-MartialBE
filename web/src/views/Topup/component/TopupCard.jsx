import {
  Stack,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormControl,
  useMediaQuery,
  TextField,
  Box,
  Grid,
  Divider,
  Badge
} from '@mui/material';
import { Button, Flex, Form, Input, Row, Col, Typography, Space, Descriptions, Radio, Image } from 'antd';
import { IconBuildingBank } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import SubCard from '@/ui-component/cards/SubCard';
import UserCard from '@/ui-component/cards/UserCard';
import AnimateButton from '@/ui-component/extended/AnimateButton';
import { useSelector } from 'react-redux';
import PayDialog from './PayDialog';

import { API } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { showError, showInfo, showSuccess, renderQuota, trims } from '@/utils/common';
import { useTranslation } from 'react-i18next';
import { isMobile } from '@/utils/common';

const TopupCard = (props) => {
  const { t } = useTranslation(); // Translation hook
  const theme = useTheme();
  const [redemptionCode, setRedemptionCode] = useState('');
  const [userQuota, setUserQuota] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [payment, setPayment] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [amount, setAmount] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [disabledPay, setDisabledPay] = useState(false);
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const siteInfo = useSelector((state) => state.siteInfo);
  const RechargeDiscount = useSelector((state) => {
    if (state.siteInfo.RechargeDiscount === '') {
      return {};
    }
    return JSON.parse(state.siteInfo.RechargeDiscount || '{}');
  });

  const [redemptionForm] = Form.useForm();
  const [topupForm] = Form.useForm();

  const topUp = async () => {
    const redemptionCode = redemptionForm.getFieldValue('redemptionCode');
    if (redemptionCode === '') {
      showInfo(t('topupCard.inputPlaceholder'));
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: trims(redemptionCode)
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess('充值成功！');
        setUserQuota((quota) => {
          return quota + data;
        });
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError('请求失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePay = () => {
    if (!selectedPayment) {
      showError(t('topupCard.selectPaymentMethod'));
      return;
    }

    if (amount <= 0 || amount < siteInfo.PaymentMinAmount) {
      showError(`${t('topupCard.amountMinLimit')} ${siteInfo.PaymentMinAmount}`);
      return;
    }

    if (amount > 1000000) {
      showError(t('topupCard.amountMaxLimit'));
      return;
    }

    // 判读金额是否是正整数
    if (!/^[1-9]\d*$/.test(amount)) {
      showError(t('topupCard.positiveIntegerAmount'));
      return;
    }

    setDisabledPay(true);
    setOpen(true);
  };

  const onClosePayDialog = () => {
    setOpen(false);
    setDisabledPay(false);
  };

  const getPayment = async () => {
    try {
      let res = await API.get(`/api/user/payment`);
      const { success, data } = res.data;
      if (success) {
        if (data.length > 0) {
          data.sort((a, b) => b.sort - a.sort);
          setPayment(data);
          setSelectedPayment(data[0]);
        }
      }
    } catch (error) {
      return;
    }
  };

  const openTopUpLink = () => {
    if (!siteInfo.top_up_link) {
      showError(t('topupCard.adminSetupRequired'));
      return;
    }
    window.open(siteInfo.top_up_link, '_blank');
  };

  const openTopUpLink2 = () => {
    if (!topUpLink) {
      showError('超级管理员未设置充值链接！');
      return;
    }
    window.open('https://www.zaofaka.com/links/F8373848', '_blank');
  };

  const getUserQuota = async () => {
    try {
      let res = await API.get(`/api/user/self`);
      const { success, message, data } = res.data;
      if (success) {
        setUserQuota(data.quota);
      } else {
        showError(message);
      }
    } catch (error) {
      return;
    }
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      setAmount('');
      return;
    }
    handleSetAmount(value);
  };

  const handleSetAmount = (amount) => {
    amount = Number(amount);
    setAmount(amount);
    handleDiscountTotal(amount);
  };

  const calculateFee = () => {
    if (!selectedPayment) return 0;

    if (selectedPayment.fixed_fee > 0) {
      return Number(selectedPayment.fixed_fee); //固定费率不计算折扣
    }
    const discount = RechargeDiscount[amount] || 1; // 如果没有折扣，则默认为1（即没有折扣）
    let newAmount = amount * discount; //折后价格
    return parseFloat(selectedPayment.percent_fee * Number(newAmount)).toFixed(2);
  };

  const calculateTotal = () => {
    if (amount === 0) return 0;
    const discount = RechargeDiscount[amount] || 1; // 如果没有折扣，则默认为1（即没有折扣）
    let newAmount = amount * discount; //折后价格
    let total = Number(newAmount) + Number(calculateFee());
    if (selectedPayment && selectedPayment.currency === 'CNY') {
      total = parseFloat((total * siteInfo.PaymentUSDRate).toFixed(2));
    }
    return total;
  };

  const handleDiscountTotal = (amount) => {
    if (amount === 0) return 0;
    // 如果金额在RechargeDiscount中，则应用折扣,手续费和货币换算汇率不算在折扣内
    const discount = RechargeDiscount[amount] || 1; // 如果没有折扣，则默认为1（即没有折扣）
    console.log(amount, discount);
    setDiscountTotal(amount * discount);
  };

  useEffect(() => {
    getPayment().then();
    getUserQuota().then();
  }, []);

  return (
    <UserCard>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} paddingTop={'20px'}>
        <IconBuildingBank color={theme.palette.primary.main} />
        <Typography variant="h4">{t('topupCard.currentQuota')}</Typography>
        <Typography variant="h4">{renderQuota(userQuota)}</Typography>
      </Stack>

      <Row gutter={16}>
        {payment.length > 0 && (
          <Col span={isMobile() ? 24 : 12}>
            <SubCard
              style={{
                marginTop: '40px'
              }}
              title={t('topupCard.onlineTopup')}
            >
              <Stack spacing={2}>
                <Radio.Group value={'left'}>
                  {payment.map((payment) => {
                    return (
                      <Radio.Button
                        value="left"
                        style={{
                          height: 'max-content'
                        }}
                      >
                        <Space align={'center'} style={{ padding: 8 }}>
                          <div>
                            <Image preview={false} src={payment.icon} width={'100%'} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                          </div>
                          <div>{payment.name}</div>
                        </Space>
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>

                <Grid container spacing={2}>
                  {Object.entries(RechargeDiscount).map(([key, value]) => (
                    <Grid item key={key}>
                      <Badge badgeContent={value !== 1 ? `${value * 10}折` : null} color="error">
                        <Button onClick={() => handleSetAmount(key)} type={'dashed'}>
                          ${key}
                        </Button>
                      </Badge>
                    </Grid>
                  ))}
                </Grid>
                <Form form={topupForm}>
                  <Form.Item>
                    <Input placeholder={t('topupCard.amount')} onChange={handleAmountChange} value={amount}></Input>
                  </Form.Item>
                </Form>
                <Divider />
                <Descriptions column={1}>
                  <Descriptions.Item
                    label={
                      <Typography variant="h6" style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                        {t('topupCard.topupAmount')}:{' '}
                      </Typography>
                    }
                  >
                    ${Number(amount)}
                  </Descriptions.Item>
                  {discountTotal !== amount && (
                    <>
                      <Descriptions.Item
                        label={
                          <Typography variant="h6" style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                            {t('topupCard.discountedPrice')}:{' '}
                          </Typography>
                        }
                      >
                        ${discountTotal}
                      </Descriptions.Item>
                    </>
                  )}
                  {selectedPayment && (selectedPayment.percent_fee > 0 || selectedPayment.fixed_fee > 0) && (
                    <>
                      <Descriptions.Item
                        label={
                          <Typography variant="h6" style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                            {t('topupCard.fee')}:{' '}
                            {selectedPayment &&
                              (selectedPayment.fixed_fee > 0
                                ? '(固定)'
                                : selectedPayment.percent_fee > 0
                                  ? `(${selectedPayment.percent_fee * 100}%)`
                                  : '')}{' '}
                          </Typography>
                        }
                      >
                        ${calculateFee()}
                      </Descriptions.Item>
                    </>
                  )}

                  <Descriptions.Item
                    label={
                      <Typography variant="h6" style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                        {t('topupCard.actualAmountToPay')}:{' '}
                      </Typography>
                    }
                  >
                    {calculateTotal()}{' '}
                    {selectedPayment &&
                      (selectedPayment.currency === 'CNY'
                        ? `CNY (${t('topupCard.exchangeRate')}: ${siteInfo.PaymentUSDRate})`
                        : selectedPayment.currency)}
                  </Descriptions.Item>
                </Descriptions>
                <Divider />
                <Button type="primary" onClick={handlePay} disabled={disabledPay}>
                  {t('topupCard.topup')}
                </Button>
              </Stack>
              <PayDialog open={open} onClose={onClosePayDialog} amount={amount} uuid={selectedPayment.uuid} />
            </SubCard>
          </Col>
        )}
        <Col span={isMobile() ? 24 : payment.length > 0 ? 12 : 24}>
          <SubCard
            style={{
              marginTop: '40px'
            }}
            title={t('topupCard.redemptionCodeTopup')}
          >
            <Form form={redemptionForm} name={'redemptionForm'}>
              <Form.Item name={'redemptionCode'}>
                <Input placeholder={t('topupCard.inputPlaceholder')}></Input>
              </Form.Item>
              <Form.Item>
                <Space size={'middle'}>
                  <Button type="primary" onClick={topUp} disabled={isSubmitting}>
                    {isSubmitting ? t('topupCard.exchangeButton.submitting') : t('topupCard.exchangeButton.default')}
                  </Button>
                  <Button type={'dashed'} primary onClick={openTopUpLink}>
                    {t('topupCard.getRedemptionCode')}
                  </Button>
                  <Button size={'small'} type={'link'} onClick={openTopUpLink2}>
                    备用{t('topupCard.getRedemptionCode')}地址
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </SubCard>
        </Col>
      </Row>
    </UserCard>
  );
};

export default TopupCard;
