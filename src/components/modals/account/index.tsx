import { FC, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { AccountEditModel } from "types/models/account/account-edit.model";
import { useTranslation } from "react-i18next";
import { AccountAddModel } from "types/models/account/account-add.model";
import styles from "./index.module.scss";
import { Role } from "utils/enums";

interface AccountProps {
  open: boolean;
  title: string;
  subTitle: string;
  textButton: string;
  isAdd: boolean;
  accountAdd?: AccountAddModel;
  accountEdit?: AccountEditModel;
  handleEventAccount: () => void;
  handleCloseModal: () => void;
}

const AccountModal: FC<AccountProps> = (props: AccountProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={props.open}
      onClose={() => {}}
      center
      showCloseIcon={false}
      classNames={{
        overlay: styles.custom_overlay,
        modal: styles.custom_modal,
      }}
    >
      <p className={styles.title}>{props.title}</p>
      <p className={styles.sub_title}>{props.subTitle}</p>
      <div className={styles.content_modal}>
        <div className={styles.field_group}>
          <p className={styles.field_title}>
            {t("account.emailAddress")}
          </p>
          <p className={styles.field_content}>
            {props.isAdd ? props.accountAdd?.email : props.accountEdit?.email}
          </p>
        </div>
        <div className={styles.field_group}>
          <p className={styles.field_title}>{t("account.username")}</p>
          <p className={styles.field_content}>
            {props.isAdd
              ? props.accountAdd?.fullName
              : props.accountEdit?.fullName}
          </p>
        </div>
        <div className={styles.field_group}>
          <p className={styles.field_title}>{t("account.titleRole")}</p>
          <p className={styles.field_content}>
            {(props.isAdd
              ? props.accountAdd?.roleName
              : props.accountEdit?.roleName) == Role.Staff
              ? t("account.staff")
              : t("account.storeManager")}
          </p>
        </div>
        <div>
          <p className={styles.field_title}>
            {t("account.accountLabel")}
          </p>
          <p className={styles.field_content}>
            {(props.isAdd
              ? props.accountAdd?.status
              : props.accountEdit?.status) == 1
              ? t("account.invalid")
              : t("account.valid")}
          </p>
        </div>
      </div>
      <div className={styles.button_group}>
        <button onClick={props.handleEventAccount} className={`btn_main`}>
          {props.textButton}
        </button>

        <div className={styles.mt_16}>
          <button onClick={props.handleCloseModal} className={`btn_white`}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AccountModal;
