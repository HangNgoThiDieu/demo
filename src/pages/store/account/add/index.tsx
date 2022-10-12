import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AccountAddModel } from "types/models/account/account-add.model";
import styles from "./index.module.scss";
import Label from "components/commons/label";
import HeaderContent from "components/commons/header-content";
import AccountModal from "components/modals/account";
import { accountService } from "services/account.service";
import { REGEX } from "utils/constants";
import { toast } from "react-toastify";
import NotifyModal from "components/modals/notify";
import { useHistory } from "react-router-dom";
import { AccountStatus, Role, UsersStatusResponse } from "utils/enums";
import { Alert } from "react-bootstrap";
import { useLoadingContext } from "context/loading";

const ADD_ACCOUNT_FIELDS = {
  email: "email",
  username: "username",
  id: "id",
  fullName: "fullName",
  roleId: "roleId",
  roleName: "roleName",
  status: "status",
};

const AddAccount: React.FC = (props: any) => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isValid, isDirty, isSubmitted },
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [status, setStatus] = useState<number>(AccountStatus.Valid);
  const [roleName, setRoleName] = useState(Role.StoreManager);
  const [accountAdd, setAccountAdd] = useState<AccountAddModel>();
  const [openModal, setOpenModal] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageError, setMessageError] = useState<string>();
  const { showLoading, hideLoading } = useLoadingContext();

  const onSubmit = async (data: any) => {
    try {
      const accountAdd = {
        email: data.email,
        fullName: data.fullName,
        roleName: roleName,
        status: status,
      } as AccountAddModel;

      const isExistedEmail = await accountService.checkExistedEmail(
        accountAdd.email
      );
      if (isExistedEmail) {
        reset(
          {},
          { keepIsSubmitted: false, keepErrors: true, keepValues: true }
        );
        setShowMessage(true);
        setMessageError(t("validation.existedEmail"));
      } else {
        setAccountAdd(accountAdd);
        setOpenModal(true);
      }
    } catch (e: any) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const addAccount = () => {
    try {
      showLoading();
      accountAdd &&
        accountService
          .addAccount(accountAdd)
          .then((result) => {
            hideLoading();
            setOpenModal(false);
            setOpenNotifyModal(true);
          })
          .catch((e) => {
            hideLoading();
            switch (e.errorCode) {
              case UsersStatusResponse.ExistedEmail:
                toast.error(t("validation.existedEmail"));
                break;

              default:
                toast.error(t("validation.errorMessage"));
                break;
            }
          });
    } catch (e: any) {}
  };

  const handleCloseNotifyModal = () => {
    setOpenNotifyModal(false);
    history.push("/account");
  };

  return (
    <>
      <div className={styles.form_edit_user}>
        <HeaderContent
          title={t("account.add.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        ></HeaderContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content_form}>
            {showMessage && (
              <Alert
                variant="danger"
                onClose={() => setShowMessage(false)}
                dismissible
              >
                <p>{messageError}</p>
              </Alert>
            )}
            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.emailAddress")}></Label>
              <div className={styles.mt_5}>
                <input
                  type="text"
                  autoFocus
                  {...register("email", {
                    required: true,
                    pattern: REGEX.EMAIL_PATTERN,
                    maxLength: 256,
                  })}
                  className={styles.input_text}
                  placeholder={t("account.placeholderEmail")}
                  onBlur={(e: any) => {
                    setValue(
                      "email",
                      getValues("email") && getValues("email").trim()
                    );
                  }}
                />
                {errors.email && errors.email.type === "required" && (
                  <span className={styles.validation_message}>
                    {t("validation.required", {
                      field: t(ADD_ACCOUNT_FIELDS.email),
                    })}
                  </span>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <span className={styles.validation_message}>
                    {t("validation.formatEmail")}
                  </span>
                )}
                {errors.email && errors.email.type === "maxLength" && (
                  <span className={styles.validation_message}>
                    {t("validation.maxLength", {
                      max: 256,
                      field: t(ADD_ACCOUNT_FIELDS.email),
                    })}
                  </span>
                )}
              </div>
            </div>

            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.username")}></Label>
              <div className={styles.mt_5}>
                <input
                  type="text"
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("account." + ADD_ACCOUNT_FIELDS.fullName),
                      }),
                    },
                    pattern: {
                      value: REGEX.SPACE,
                      message: t("validation.required", {
                        field: t("account." + ADD_ACCOUNT_FIELDS.fullName),
                      }),
                    },
                    maxLength: {
                      value: 50,
                      message: t("validation.maxLength", {
                        max: 50,
                        field: t("account." + ADD_ACCOUNT_FIELDS.fullName),
                      }),
                    },
                  })}
                  className={styles.input_text}
                  placeholder={t("account.placeholderName")}
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
                <div className={`form-group ${styles.form_input}`}>
                  <label className={styles.mr_24}>
                    <input
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
            <div className={`form-group ${styles.form_input}`}>
              <Label text={t("account.accountLabel")}></Label>
              <div className={styles.mt_5}>
                <div className={`form-group ${styles.form_input}`}>
                  <label className={styles.mr_32}>
                    <input
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
          <div className={`${styles.form_group} ${styles.form_button}`}>
            <button
              type="submit"
              className={`btn_main`}
              disabled={isSubmitted ? !isDirty || !isValid : false}
            >
              {t("account.add.buttonAdd")}
            </button>
          </div>
        </form>
        <AccountModal
          open={openModal}
          handleCloseModal={() => [
            setOpenModal(false),
            reset(
              {},
              { keepValues: true, keepErrors: true, keepIsSubmitted: false }
            ),
          ]}
          handleEventAccount={() => addAccount()}
          title={t("account.add.titleModal")}
          subTitle={t("account.add.titleSubModal")}
          isAdd={true}
          accountAdd={accountAdd}
          textButton={t("account.add.addAccount")}
        ></AccountModal>
        <NotifyModal
          open={openNotifyModal}
          message={t("account.add.addSuccess")}
          textButton={t("close")}
          handleCloseModal={() => handleCloseNotifyModal()}
        />
      </div>
    </>
  );
};

export default AddAccount;
