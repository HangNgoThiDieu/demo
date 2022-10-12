import HeaderContent from 'components/commons/header-content';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./index.module.scss";
import Image from "components/commons/image";
import Config from 'config';
import "react-datepicker/dist/react-datepicker.css";
import { notificationService } from 'services/notification.service';
import { useHistory, useParams } from 'react-router';
import { NotificationUserDetailResult } from 'types/results/notification/notification-user-detail.result';
import NoImage from "assets/images/no-image.png";
import { useUserContext } from 'layouts/user';
import ImgOptimizeByWebp from 'components/commons/img-webp';
import { useLoadingContext } from "context/loading";
import { tokenHelper } from 'utils/store-token';
import { TRANSACTION_INFO } from 'utils';

interface NotificationUserParams {
  notificationId: number;
}

const NotificationDetail : React.FC = (props: any) =>{
  const { t } = useTranslation();
  const params = useParams();
  const { notificationId } = params as NotificationUserParams;
  const info = tokenHelper.getPropertyFromStorage(TRANSACTION_INFO);
  const [notificationDetail, setNotificationDetail] = useState<NotificationUserDetailResult>();
  const width = window.innerWidth;
  const history = useHistory();
  const {isOrderHistory} = useUserContext();
  const { showLoading, hideLoading } = useLoadingContext();
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);

  const getHeight = () => {
    if (elementRef && elementRef.current && elementRef.current.clientHeight) {
      setHeightBtn(elementRef?.current?.clientHeight + 28);
    }
  }

  useEffect(() => {
    showLoading();
    isOrderHistory(undefined);
    const getNotificationUserById = async () => {
      try {
        const result = await notificationService.getNotificationUserDetail(notificationId, info.com);
        setNotificationDetail(result);
        hideLoading();
      }
      catch (err) {
        hideLoading();
      }
    }

    getNotificationUserById();
  }, [notificationId]);

  useEffect(() => {
    getHeight();
  }, []);

  return (
    <div className={styles.detail_notification}>
      <HeaderContent
        titleStyle={styles.title_style}
        title={t("user.notification.detail.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.goBack()}
      />
      <div className={styles.content}>
        <div className={styles.div_lable}>
          <div className={styles.text_lable}>{notificationDetail?.label}</div>
        
        </div>
        <p className={`title_modal ${styles.title}`}>{notificationDetail?.title}</p>
        <div className={styles.line}></div>
        <div className={styles.pt_9}>
          <div className={styles.text_content}>
            <pre>{notificationDetail?.content}</pre> </div>
            <ImgOptimizeByWebp
              className={`${styles.image} mt_4`}
              src={`${
                !notificationDetail?.fileName
                  ? NoImage
                  : Config.API_URL.GET_IMAGE + notificationDetail?.fileName
                }`}
              fallback={NoImage}
              type="image/webp"
              alt="image"
            />
        </div>
       
      </div>
      <div style={{ height: heightBtn }}></div>
      <div className={styles.form_button} ref={elementRef}>
          <button className={`btn_main ${styles.btn_top}`}
          onClick={() => history.push(`/user/transaction/${info.trans.toString()}/order/select-product`)}>
            {t("user.notification.detail.order")}
          </button>
        </div>
    </div>
  )
}

export default NotificationDetail;