import HeaderContent from "components/commons/header-content";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Label from "components/commons/label";
import styles from "./index.module.scss";
import { useForm } from "react-hook-form";
import { ChangePasswordModel } from "types/models/change-password/change-password.model";
import { AccountDetailResult } from "types/results/account/account-detail.result";
import { accountService } from "services/account.service";
import { LOGOUT, REGEX } from "utils";
import NotifyModal from "components/modals/notify";
import { useAuth } from "context/auth";
import { UsersStatusResponse } from "utils/enums";
import { Alert } from "react-bootstrap";
import { ChangePasswordForStaffModel } from "types/models/change-password-staff/change-password-staff.model";
import { useLoadingContext } from "context/loading";

interface AccountDetailParams {
  userId: string;
}

const ChangePasswordForStaff = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<ChangePasswordModel>({ mode: "onSubmit" });

  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams();
  const { userId } = params as AccountDetailParams;
  const [userDetail, setUserDetail] = useState<AccountDetailResult>();
  const [openNotify, setOpenNotify] = useState(false);
  const { user, signOut } = useAuth();
  const [showMessage, setShowMessage] = useState(false);
  const [messageError, setMessageError] = useState<string>();
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const { showLoading, hideLoading } = useLoadingContext();

  const getUser = () => {
    accountService
      .getAccountDetail(userId)
      .then((result) => {
        hideLoading();
        setUserDetail(result);
      })
      .catch((err) => {
        hideLoading();
      });
  };

  const onSubmit = (data: ChangePasswordForStaffModel) => {
    setShowMessage(false);
    data.userId = userId;
    showLoading();
    accountService
      .changePasswordForStaff(data)
      .then(() => {
        hideLoading();
        setOpenNotify(true);
      })
      .catch((err: any) => {
        hideLoading();
        switch (err.errorCode) {
          case UsersStatusResponse.NotFound:
            setShowMessage(true);
            setMessageError(
              t("password.changePassword.validation.userNotFound")
            );
            break;
          case UsersStatusResponse.NotMatchPassword:
            setShowMessage(true);
            setMessageError(t("password.resetPassword.validation.notMatchPassword"));
            break;
          case UsersStatusResponse.Failed:
            setShowMessage(true);
            setMessageError(t("password.changePassword.failure"));
            break;
          default:
            setShowMessage(true);
            setMessageError(t("password.changePassword.failure"));
            break;
        }
      });
  };

  const closeModal = async () => {
    if (user?.userId == userId) {
      await signOut();
      history.push(`${LOGOUT}`);
    } else {
      history.push("/account");
    }
  };

  const getHeight = () => {
    if (elementRef && elementRef.current && elementRef.current.clientHeight) {
      setHeightBtn(elementRef?.current?.clientHeight + 1);
    }
  }

  useEffect(() => {
    showLoading();
    getHeight();
    getUser();
  }, []);

  return (
    <>
      <div className={styles.content_account}>
        <HeaderContent
          title={t("password.changePassword.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        />
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className={styles.main_content}>
            {showMessage && (
              <Alert
                variant="danger"
                onClose={() => setShowMessage(false)}
                dismissible
              >
                <p>{messageError}</p>
              </Alert>
            )}
            <ul>
              <li>
                <Label text={t("password.changePassword.email")} />
                <p>{userDetail?.email}</p>
              </li>
              <li>
                <Label text={t("password.changePassword.fullName")} />
                <p>{userDetail?.fullName}</p>
              </li>
              <li>
                <Label text={t("password.changePassword.newPassword")} />
                <input
                  autoComplete="new-password"
                  type="password"
                  placeholder="・・・・・・"
                  {...register("newPassword", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("password.changePassword.newPassword"),
                      }),
                    },
                    pattern: {
                      value: REGEX.REGEX_PASSWORD,
                      message: t(
                        "password.changePassword.validation.invalidPassword",
                        {
                          field: t("password.changePassword.newPassword"),
                        }
                      ),
                    },
                    minLength: {
                      value: 8,
                      message: t(
                        "password.changePassword.validation.maxMinLenght",
                        {
                          field: t("password.changePassword.newPassword"),
                          max: 16,
                          min: 8,
                        }
                      ),
                    },
                    maxLength: {
                      value: 16,
                      message: t(
                        "password.changePassword.validation.maxMinLenght",
                        {
                          field: t("password.changePassword.newPassword"),
                          max: 16,
                          min: 8,
                        }
                      ),
                    },
                  })}
                  className={styles.input_text}
                />
                {errors.newPassword &&
                  ["required", "minLength", "maxLength", "pattern"].includes(
                    errors.newPassword.type
                  ) && (
                    <p className="validation_message">
                      {errors.newPassword.message}
                    </p>
                  )}
              </li>
              <li>
                <Label text={t("password.changePassword.confirmNewPassword")} />
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="・・・・・・"
                  {...register("confirmNewPassword", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("password.changePassword.confirmNewPassword"),
                      }),
                    },
                    validate: (value) =>
                      value === watch("newPassword") ||
                      `${t(
                        "password.changePassword.validation.notMatchPassword"
                      )}`,
                  })}
                  className={styles.input_text}
                />
                {errors.confirmNewPassword &&
                  ["required", "validate", "pattern"].includes(
                    errors.confirmNewPassword.type
                  ) && (
                    <p className="validation_message">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
              </li>
            </ul>
          </div>
          <div style={{ height: heightBtn }}></div>
          <div className={styles.form_button} ref={elementRef}>
            <button
              type="submit"
              className={`btn_main`}
              disabled={isSubmitted ? !isDirty || !isValid : false}
            >
              {t("password.changePassword.buttonChange")}
            </button>
          </div>
        </form>
        <NotifyModal
          open={openNotify}
          message={t("password.changePassword.successTitle")}
          title={""}
          textButton={t("close")}
          handleCloseModal={closeModal}
        ></NotifyModal>
      </div>
    </>
  );
};
export default ChangePasswordForStaff;
