import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { AccountEditModel } from "types/models/account/account-edit.model";
import { AccountDetailResult } from "types/results/account/account-detail.result";
import styles from "./index.module.scss";
import { useAuth } from "context/auth";
import Label from "components/commons/label";
import HeaderContent from "components/commons/header-content";
import AccountModal from "components/modals/account";
import { accountService } from "services/account.service";
import { REGEX } from "utils/constants";
import NotifyModal from "components/modals/notify";
import { AccountStatus, Role } from "utils/enums";
import { useLoadingContext } from "context/loading";

const EDIT_ACCOUNT_FIELDS = {
  username: "username",
  id: "id",
  fullName: "fullName",
  roleId: "roleId",
  roleName: "roleName",
  status: "status",
};

interface UpdateAccountParams {
  id: string;
}
const EditAccount: React.FC = (props: any) => {
  const params = useParams();
  const { id } = params as UpdateAccountParams;
  const { t } = useTranslation();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty, isSubmitted, isValid },
  } = useForm();
  const [userinfo, setUserInfo] = useState<AccountDetailResult>();
  const [status, setStatus] = useState(AccountStatus.Valid);
  const [roleName, setRoleName] = useState("");
  const [accountEdit, setAccountEdit] = useState<AccountEditModel>();
  const [openModal, setOpenModal] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const { showLoading, hideLoading } = useLoadingContext();
  const { user } = useAuth();

  const onSubmit = (data: any) => {
    const accountEdit = {
      id: id,
      email: userinfo?.email,
      fullName: data.fullName.trim(),
      roleName: roleName,
      status: status,
    } as AccountEditModel;
    setAccountEdit(accountEdit);
    setOpenModal(true);
  };

  const getUser = () => {
    accountService
      .getAccountDetail(id)
      .then((result) => {
        setUserInfo(result);
        setStatus(result.status);
        setRoleName(result.role);
        setValue("fullName", result.fullName);
        hideLoading();
      })
      .catch((err) => {
        hideLoading();
      });
  };

  const editAccount = async () => {
    try {
      showLoading();
      accountEdit &&
        (await accountService.editAccount(accountEdit).then((result) => {
          hideLoading();
          setOpenModal(false);
          setOpenNotifyModal(true);
        }));
    } catch (e: any) {
      hideLoading();
    }
  };

  const handleCloseNotifyModal = () => {
    setOpenNotifyModal(false);
    history.push(`/account/${id}`);
  };

  useEffect(() => {
    showLoading();
    getUser();
  }, []);

  return (
    <>
      <div className={styles.form_edit_user}>
        <HeaderContent
          title={t("account.edit.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        ></HeaderContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content_form}>
            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.emailAddress")}></Label>
              <div className={styles.mt_5}>
                <label className={styles.label_title} htmlFor="">
                  {userinfo?.email}
                </label>
              </div>
            </div>

            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.username")}></Label>
              <div className={styles.mt_5}>
                <input
                  type="text"
                  autoFocus
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("account." + EDIT_ACCOUNT_FIELDS.fullName),
                      }),
                    },
                    pattern: {
                      value: REGEX.SPACE,
                      message: t("validation.required", {
                        field: t("account." + EDIT_ACCOUNT_FIELDS.fullName),
                      }),
                    },
                    maxLength: {
                      value: 50,
                      message: t("validation.maxLength", {
                        max: 50,
                        field: t("account." + EDIT_ACCOUNT_FIELDS.fullName),
                      }),
                    },
                  })}
                  className={`form-controll ${styles.input_text}`}
                  placeholder={t("account.placeholderName")}
                  defaultValue={userinfo?.fullName}
                  onBlur={(e: any) => {
                    setValue(
                      "fullName",
                      getValues("fullName") && getValues("fullName").trim()
                    );
                  }}
                />
                {errors.fullName &&
                  ["required", "pattern", "maxLength"].includes(
                    errors.fullName.type
                  ) && (
                    <span className={styles.validation_message}>
                      {errors.fullName.message}
                    </span>
                  )}
              </div>
            </div>

            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.titleRole")}></Label>
              <div className={styles.mt_5}>
                <div className={`${userinfo?.id == user?.userId ? styles.enable_radio : ''}`}>
                  <div className={`form-group ${styles.form_input}`}>
                    <label className={styles.mr_24}>
                      <input
                        disabled = {userinfo?.id == user?.userId ? true : false}
                        type="radio"
                        name="roleName"
                        value="css"
                        checked={roleName === Role.StoreManager}
                        onChange={() => setRoleName(Role.StoreManager)}
                      />
                      <span className={styles.text_radio}>
                        {t("account.storeManager")}
                      </span>
                    </label>
                    <label>
                      <input
                        disabled = {userinfo?.id == user?.userId ? true : false}
                        type="radio"
                        name="roleName"
                        value="no"
                        checked={roleName === Role.Staff}
                        onChange={() => setRoleName(Role.Staff)}
                      />
                      <span className={styles.text_radio}>
                        {t("account.staff")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.accountLabel")}></Label>
              <div className={styles.mt_5}>
                <div className={`${userinfo?.id == user?.userId ? styles.enable_radio : ''}`}>
                  <div className={`form-group ${styles.form_input}`}>
                    <label className={styles.mr_32}>
                      <input
                        disabled = {userinfo?.id == user?.userId ? true : false}
                        type="radio"
                        name="status"
                        value="css"
                        checked={status == AccountStatus.Valid}
                        onChange={() => setStatus(AccountStatus.Valid)}
                      />
                      <span className={styles.text_radio}>
                        {t("account.valid")}
                      </span>
                    </label>
                    <label>
                      <input
                        disabled = {userinfo?.id == user?.userId ? true : false}
                        type="radio"
                        name="status"
                        value="no"
                        checked={status == AccountStatus.Invalid}
                        onChange={() => setStatus(AccountStatus.Invalid)}
                      />
                      <span className={styles.text_radio}>
                        {t("account.invalid")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.form_group} ${styles.form_button}`}>
            <button className={`btn_main`} disabled={isSubmitted ? (!isDirty || !isValid) : false}>
              {t("account.edit.buttonUpdate")}
            </button>
          </div>
        </form>
        <AccountModal
          open={openModal}
          handleCloseModal={() => [setOpenModal(false),
          reset({}, { keepValues: true, keepErrors: true, keepIsSubmitted: false })]}
          handleEventAccount={() => editAccount()}
          title={t("account.edit.titleModal")}
          subTitle={t("account.edit.titleSubModal")}
          isAdd={false}
          accountEdit={accountEdit}
          textButton={t("account.edit.updateAccount")}
        ></AccountModal>
        <NotifyModal
          open={openNotifyModal}
          message={t("account.edit.editSuccess")}
          textButton={t("close")}
          handleCloseModal={() => handleCloseNotifyModal()}
        />
      </div>
    </>
  );
};

export default EditAccount;
