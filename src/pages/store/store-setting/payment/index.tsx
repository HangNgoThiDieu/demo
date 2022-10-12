import HeaderContent from "components/commons/header-content";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import { settingService } from "services/setting.service";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { PaymentStoreSettingModel } from "types/models/store-setting/payment/payment-setting.model";
import Icon_OnePay from "assets/images/onepay.png";
import Icon_Momo from "assets/images/momo.png";
import Icon_arrow_down from "assets/images/icon_arrow_down.svg";
import { PaymentStoreSettingResult } from "types/results/store-setting/payment/payment-settting.result";
import OnePayComponent from "./one-pay";
import MoMoPayComponent from "./momo-pay";
import { PAYMENT_GATEWAY } from "utils";
import { useLoadingContext } from "context/loading";
import { Accordion, AccordionContext, Card, useAccordionButton } from "react-bootstrap";

const PaymentSetting = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();
  const [enablePayment, setEnablePayment] = useState<boolean>(false);
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [paymentGatewayKeys, setPaymentGatewayKeys] = useState([] as number[]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentSetting, setPaymentSetting] = 
    useState<PaymentStoreSettingResult>({} as PaymentStoreSettingResult);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentStoreSettingModel>();

  const getPayment = () => {
    settingService.getPaymentStoreSetting().then((result) => {
      hideLoading();
      setPaymentSetting(result);
      setEnablePayment(result.isEnablePayment);
      setPaymentGatewayKeys(result.paymentGateways);
    })
    .catch ((err) => {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    });
  };

  const onSubmit = (data: PaymentStoreSettingModel) => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      const paymentModel = {
        isEnablePayment: enablePayment,
        paymentGateways: paymentGatewayKeys,
        onePayPayment: data.onePayPayment,
        moMoPayment: data.moMoPayment
      } as PaymentStoreSettingModel;

      if (enablePayment) {
        if (paymentGatewayKeys.length == 0) {
          setIsSubmitted(false);
          toast.error(t("storeSetting.payment.errors.chooseAtLeast"));
          return;
        }
      }
      showLoading();
      settingService
        .setPayment(paymentModel)
        .then(() => {
          hideLoading();
          setIsSubmitted(false);
          toast.success(t("storeSetting.payment.success"));
          getPayment();
        })
        .catch((e) => {
          hideLoading();
          setIsSubmitted(false);
          toast.error(t("validation.errorMessage"));
        });
    }
  };

  const handlePaymentGatewayKey = (e: any) => {
    let checked = e.target.checked;
    if (checked) {
      setPaymentGatewayKeys([...paymentGatewayKeys, parseInt(e.target.value)]);
    } else {
      setPaymentGatewayKeys(
        paymentGatewayKeys.filter((id) => id != e.target.value)
      );
    }
  };

  const CustomToggle = ({ children, eventKey, isMomo }: any) => {
    let { activeEventKey } = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey);

    let isCurrentEventKey = false;
    if (activeEventKey?.includes(""+eventKey)) {
      isCurrentEventKey = true;
    }

    let className = styles.icon_arrow;
    if (isCurrentEventKey) {
      className = styles.icon_arrow_active;
    }

    return (
      <div className={styles.header_box}>
        <span className={className}>
          <img src={Icon_arrow_down} alt="arrow_down" />
        </span>
        <label className={styles.mr_24}>
          <input
            type="checkbox"
            name="a"
            value={eventKey}
            defaultChecked={paymentGatewayKeys.some((x) => x == eventKey)}
            onClick={decoratedOnClick}
            onChange={handlePaymentGatewayKey}
          />
          <span>{children}</span>
        </label>
        {isMomo ? (
          <img src={Icon_Momo} alt="momo" className={styles.icon_momo} />
        ) : (
          <img src={Icon_OnePay} alt="OnePay" className={styles.icon_one_pay} />
        )}
      </div>
    );
  };

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name');
    setValue(attribute, event.target.value.trim());
  }

  useEffect(() => {
    showLoading();
    getPayment();
  }, []);

  useEffect(() => {
    const getHeight = () => {
      if (elementRef && elementRef.current && elementRef.current.clientHeight) {
        setHeightBtn(elementRef?.current?.clientHeight + 1);
      }
    };
    getHeight();
  }, []);

  return (
    <div className={styles.content}>
      <HeaderContent
        title={t("storeSetting.payment.title")}
        isBtnLeft
        onBtnLeft={() => history.goBack()}
      />
      <form onSubmit={handleSubmit(onSubmit) } autoComplete="off">
        <div className="container">
          <div className={styles.payment}>
            <label>{t("storeSetting.payment.usePayment")}</label>
            <label className={`switch`}>
              <input
                type="checkbox"
                checked={enablePayment}
                onChange={() => setEnablePayment(!enablePayment)}
              />
              <span className={`slider round`}></span>
            </label>
          </div>
        </div>
        {/* setting payment gateway */}
        {enablePayment && (
          <div className={styles.setting_payment}>
            <label className={styles.font_weight_bold}>{t("storeSetting.payment.paymentGateway")}</label>
            <div className={styles.payment_gateway_box}>
              <Accordion
                defaultActiveKey={["-1"]}
                activeKey={paymentGatewayKeys.map(String)}
                alwaysOpen
              >
                <Card bsPrefix={styles.item_card}>
                  <Card.Header>
                    <CustomToggle eventKey={PAYMENT_GATEWAY.OnePay} isMomo={false}>
                      OnePay
                    </CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={PAYMENT_GATEWAY.OnePay.toString()}>
                    <Card.Body bsPrefix={styles.collapse_box}>
                      <OnePayComponent 
                        {...{register, errors}} 
                        formatInput={formatInput} 
                        paymentGatewayKeys={paymentGatewayKeys} 
                        onePayPayment={paymentSetting.onePayPayment} 
                        t={t}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card bsPrefix={styles.item_card}>
                  <Card.Header>
                    <CustomToggle eventKey={PAYMENT_GATEWAY.MoMo} isMomo={true}>
                      MoMo
                    </CustomToggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey={PAYMENT_GATEWAY.MoMo.toString()}>
                    <Card.Body bsPrefix={styles.collapse_box}>
                      <MoMoPayComponent 
                        {...{register, errors}} 
                        formatInput={formatInput} 
                        paymentGatewayKeys={paymentGatewayKeys} 
                        moMoPayment={paymentSetting.moMoPayment} 
                        t={t}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </div>
        )}
        <div style={{ height: heightBtn }}></div>
        <div
          className={`${styles.form_group} ${styles.form_button}`}
          ref={elementRef}
        >
          <button type="submit" className={`btn_main`} disabled={Array.isArray(errors) || Object.values(errors).toString() != ""}>
            {t("storeSetting.payment.buttonSetting")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentSetting;
