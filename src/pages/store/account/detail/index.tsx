import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeaderContent from "components/commons/header-content";
import styles from "./index.module.scss";
import { useParams } from "react-router";
import Label from "components/commons/label";
import { accountService } from "services/account.service";
import { AccountDetailResult } from "types/results/account/account-detail.result";
import GroupsButtonBottom from "components/commons/group-button-bottom";
import { EDIT_ACCOUNT, STORE_ROLES } from "utils/constants";
import { useAuth } from "context/auth";
import { useLoadingContext } from "context/loading";

interface AccountDetailParams {
  userId: string;
}

const AccountDetail = () => {
  const history = useHistory();
  const params = useParams();
  const { userId } = params as AccountDetailParams;
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoadingContext();

  const [item, setItem] = useState<AccountDetailResult>();
  const [id, setId] = useState<string>("");

  const getDetailUser = async (userId: string) => {
    try {
      const result = await accountService.getAccountDetail(userId);
      setItem(result);
      setId(result.id);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  useEffect(() => {
    showLoading();
    getDetailUser(userId);
  }, [userId]);

  return (
    <>
      <div className={styles.content_account}>
        <HeaderContent
          title={t("account.detail.titleDetailAccount")}
          isBtnLeft={true}
          onBtnLeft={() =>
            user?.role == STORE_ROLES.Staff
              ? history.goBack()
              : history.push("/account")
          }
        />
        <div className={styles.main_content}>
          <ul>
            <li>
              <Label text={t("account.emailAddress")} />
              <p>{item?.email}</p>
            </li>
            <li>
              <Label text={t("account.username")} />
              <p>{item?.fullName}</p>
            </li>
            <li>
              <Label text={t("account.titleRole")} />
              <p>
                {item?.role === STORE_ROLES.Staff
                  ? `${t("account.staff")}`
                  : `${t("account.storeManager")}`}
              </p>
            </li>
            <li>
              <Label text={t("account.detail.accountUser")} />
              <p>
                {item?.status == 0
                  ? `${t("account.valid")}`
                  : `${t("account.invalid")}`}
              </p>
            </li>
          </ul>
        </div>
        <GroupsButtonBottom
          textButtonLeft={t("account.detail.buttonChangePassword")}
          textButtonRight={t("account.detail.buttonEditAccount")}
          handleButtonLeft={() => (id && (user?.role == STORE_ROLES.StoreManager && user?.userId !== id) 
              ? history.push(`/change-password-other/${id}`) : history.push(`/change-password/${id}`))}
          handleButtonRight={() => history.push(`${EDIT_ACCOUNT}${item?.id}`)}
          isHideButtonRight={user?.role == STORE_ROLES.Staff}
          changeColorMainButton={user?.role == STORE_ROLES.Staff}
        />
      </div>
    </>
  );
};
export default AccountDetail;
