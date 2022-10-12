import { FC, useState } from "react";
import styles from "./index.module.scss";
import avatar from "assets/images/pic.svg";
import { useAuth } from "context/auth";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ConfirmModal from "components/modals/confirm";
import { MenuSider, Role } from "utils/enums";
import { LOGOUT } from "utils/constants";

interface SiderProps {
  open: boolean;
  onClose: () => void;
  removeScrollHidden: () => void;
}

const Sider: FC<SiderProps> = ({ open, onClose, removeScrollHidden }) => {
  const { user, signOut } = useAuth();
  const history = useHistory();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const logout = async () => {
    removeScrollHidden();
    if (!isSubmit) {
      try {
        setIsSubmit(true);
        await signOut();
        history.push(`${LOGOUT}`);
      } catch (err) {
        setIsSubmit(false);
      }
    }
  };

  const handleLink = (menu: string) =>{
    onClose();
    switch (menu){
      case MenuSider.StoreSetting : {
        history.push('/store/setting/');
        break;
      }
      case MenuSider.DesignSetting : {
        history.push('/design-setting/');
        break;
      }
      case MenuSider.TableSetting : {
        history.push('/table/setting/');
        break;
      }
      case MenuSider.SeatSetting : {
        history.push('/seat-setting');
        break;
      }
      case MenuSider.PaymentSetting : {
        history.push('/payment-setting');
        break;
      }
      case MenuSider.StaffManagement : {
        history.push('/account/');
        break;
      }
      case MenuSider.SalesAnalysis : {
        history.push('/revenue-analysis/');
        break;
      }
      case MenuSider.ProductManagement : {
        history.push('/products/');
        break;
      }
      case MenuSider.NotificationSetting : {
        history.push('/notifications/');
        break;
      }
      case MenuSider.TableList : {
        history.push('/table/');
        break;
      }
      case MenuSider.OrderList : {
        history.push('/order/');
        break;
      }
    }
    
  }
  return (
    <>
      {open ? (
        <div>
          <div
            aria-hidden="true"
            className={styles.overlay}
            onClick={onClose}
          ></div>
          <div className={styles.menu}>
            <div className={styles.user}>
              <Link to={`/account/${user?.userId}`}
                onClick={onClose}
              >
                <img className={styles.avatar} src={avatar} alt="avatar" />
                <label className={`${styles.user_name} text_title`}>
                  {user?.fullname ?? ""}
                </label>
              </Link>
            </div>
            <div className={styles.list_menu}>
              {user?.role == Role.StoreManager && (
                <div>
                  <p className="text_title">{t("menu.setting")}</p>
                  <div className={styles.sub_menu}>
                    <ul className={styles.menu_ul}>
                      <li>
                        <p className={`${styles.menu_item} text_menu`} 
                          onClick={()=>handleLink(MenuSider.StoreSetting)}>{t("menu.restaurantSetting")}
                        </p>
                        <div className={styles.line}></div>
                      </li>
                      <li>
                        <p className={`${styles.menu_item} text_menu`} 
                          onClick={()=>handleLink(MenuSider.DesignSetting)}>{t("menu.designSetting")}
                        </p>
                        <div className={styles.line}></div>
                      </li>
                      <li>
                        <p className={`${styles.menu_item} text_menu`} 
                          onClick={()=>handleLink(MenuSider.TableSetting)}>{t("menu.tableSetting")}
                        </p>
                        <div className={styles.line}></div>
                      </li>
                      <li>
                        <p className={`${styles.menu_item} text_menu`} 
                          onClick={()=>handleLink(MenuSider.SeatSetting)}>{t("menu.seatSetting")}
                        </p>
                        <div className={styles.line}></div>
                      </li>
                      <li>
                        <p className={`${styles.menu_item} text_menu`} 
                          onClick={()=>handleLink(MenuSider.PaymentSetting)}>{t("menu.paymentSetting")}
                          </p>
                        <div className={styles.line}></div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <div className={styles.mt_24}>
                {user?.role == Role.StoreManager && (
                  <>
                    <p className="text_title">{t("menu.management")}</p>
                    <div className={styles.sub_menu}>
                      <ul className={styles.menu_ul}>
                        <div>
                          <li>
                            <p className={`${styles.menu_item} text_menu`} 
                              onClick={()=>handleLink(MenuSider.StaffManagement)}>{t("menu.staffManagement")}
                            </p>
                            <div className={styles.line}></div>
                          </li>
                          <li>
                            <p className={`${styles.menu_item} text_menu`} 
                              onClick={()=>handleLink(MenuSider.SalesAnalysis)}>{t("menu.salesAnalysis")}
                            </p>
                            <div className={styles.line}></div>
                          </li>
                          <li>
                            <p className={`${styles.menu_item} text_menu`} 
                              onClick={()=>handleLink(MenuSider.ProductManagement)}>{t("menu.productManagement")}
                              </p>
                            <div className={styles.line}></div>
                          </li>
                        </div>
                      </ul>
                    </div>
                  </>
                )}
              </div>
              {user?.role == Role.Staff && (
                <div className={styles.mt_32}>
                  <p className={`${styles.menu_item} text_title`} 
                    onClick={()=>handleLink(MenuSider.ProductManagement)}>{t("menu.productManagement")}
                  </p>
                </div>
              )}
              {user?.role == Role.StoreManager && (
                <div
                className={styles.mt_32}
                >
                  <p className={`${styles.menu_item} text_title`} 
                    onClick={()=>handleLink(MenuSider.NotificationSetting)}>{t("menu.notificationUserList")}
                  </p>
                </div>
              )}
              <div className={styles.mt_18}>
                <p className={`${styles.menu_item} text_title`} 
                  onClick={()=>handleLink(MenuSider.TableList)}>{t("menu.tableList")}
                </p>
              </div>
              <div className={styles.mt_18}>
                <p className={`${styles.menu_item} text_title`} 
                  onClick={()=>handleLink(MenuSider.OrderList)}>{t("menu.orderList")}
                </p>
              </div>
              <div className={styles.mt_18}>
                <p
                  onClick={() => setOpenModal(true)}
                  className={`${styles.menu_item} text_title`}
                >
                  {t("logout.logout")}
                </p>
              </div>
            </div>
          </div>
          <ConfirmModal
            open={openModal}
            title={t("logout.logout")}
            subTitle={t("logout.confirm.title")}
            textButton={t("logout.logout")}
            textCancel={t("cancel")}
            handleEvent={logout}
            handleCloseModal={() => setOpenModal(false)}
          ></ConfirmModal>
        </div>
      ) : null}
    </>
  );
};

export default Sider;
