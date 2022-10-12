import Label from "components/commons/label";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ResetPasswordModel } from "types/models/reset-password/reset-password.model";
import { REGEX } from "utils/constants";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { tokenService } from "services/token.service";
import { accountService } from "services/account.service";
import { AccountStatusResponse, UsersStatusResponse } from "utils/enums";
import NotifyModal from "components/modals/notify";
import { useAuth } from "context/auth";
import { useLoadingContext } from "context/loading";

const ResetPassword = (props: any) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [openNotify, setOpenNotify] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showLoading, hideLoading } = useLoadingContext();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let email_url: string = query.get("email")!;
  var token_url: string = query.get("token")!;
  var name_url: string = query.get("name")!;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<ResetPasswordModel>({ mode: "onSubmit" });

  const onSubmit = async (data: ResetPasswordModel) => {
    if (email_url == null || token_url == null) {
      toast.error(t("password.resetPassword.validation.emailNotFound"));
      return;
    }
    data.email = email_url;
    data.token = token_url;

    try {
      showLoading();
      const rs = await accountService.resetPassword(data);
      hideLoading();
      setOpenNotify(true);
    }
    catch (err: any) {
      hideLoading();
      switch (err.errorCode) {
        case UsersStatusResponse.NotFound:
          toast.error(t("password.resetPassword.validation.emailNotFound"));
          break;
        case UsersStatusResponse.NotMatchPassword:
          toast.error(t("password.resetPassword.validation.notMatchPassword"));
          break;
        case UsersStatusResponse.Failed:
          if (props.isSetPW) {
            toast.error(t("password.resetPassword.setPWFailure"));
          }
          else {
            toast.error(t("password.resetPassword.failure"));
          }
          break;
        default:
          toast.error(t("password.resetPassword.failure"));
          break;
      }
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        await tokenService.validateEmailToken({email: email_url, token: token_url});
      }
      catch(error: any) {
        switch (error.errorCode) {
          case AccountStatusResponse.Disable:
            toast.error(t("password.resetPassword.validation.userInvalid"));
            history.push("/login");
            break;
          default:
            if (props.isSetPW) {
              toast.error(t("password.resetPassword.validation.urlSetPWIsInvalid"));
            }
            else {
              toast.error(t("password.resetPassword.validation.urlResetPWIsInvalid"));
            }
            history.push("/login");
            break;
        }
      }
    }

    validateToken();
  
  },[]);

  return (
    <>
      <div className={`${styles.reset_content}`}>
        <p className={`text_title ${styles.title_reset}`}>
          {props.isSetPW ? t("password.resetPassword.titleSetPW") : t("password.resetPassword.title")}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className={styles.content}>
            <div className="form-group mb_32">
              <Label text={t("password.resetPassword.email")}></Label>
              <p className="mt_5">{name_url}</p>
            </div>
            <div className="form-group mb_32">
              <Label text={t("password.resetPassword.newPassword")}></Label>
              <input
                className={`${styles.input_text} mt_5`}
                autoComplete="new-password"
                type="password"
                placeholder="・・・・・・"
                {...register("newPassword", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("password.resetPassword.newPassword"),
                    }),
                  },
                  pattern: {
                    value: REGEX.REGEX_PASSWORD,
                    message: t(
                      "password.resetPassword.validation.invalidPassword",
                      {
                        field: t("password.resetPassword.newPassword"),
                      }
                    ),
                  },
                  minLength: {
                    value: 8,
                    message: t(
                      "password.resetPassword.validation.maxMinLenght",
                      {
                        field: t("password.resetPassword.newPassword"),
                        max: 16,
                        min: 8,
                      }
                    ),
                  },
                  maxLength: {
                    value: 16,
                    message: t(
                      "password.resetPassword.validation.maxMinLenght",
                      {
                        field: t("password.resetPassword.newPassword"),
                        max: 16,
                        min: 8,
                      }
                    ),
                  },
                })}
              />
              {errors.newPassword &&
                ["required", "minLength", "maxLength", "pattern"].includes(
                  errors.newPassword.type
                ) && (
                  <p className="validation_message">
                    {errors.newPassword.message}
                  </p>
                )}
            </div>
            <div className="form-group">
              <Label text={t("password.resetPassword.confirmNewPassword")}></Label>
              <input
                className={`${styles.input_text} mt_5`}
                type="password"
                autoComplete="new-password"
                placeholder="・・・・・・"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("password.resetPassword.confirmNewPassword"),
                    }),
                  },
                  validate: (value) =>
                    value === watch("newPassword") ||
                    `${t(
                      "password.resetPassword.validation.notMatchPassword"
                    )}`,
                })}
              />
              {errors.confirmPassword &&
                ["required", "validate"].includes(
                  errors.confirmPassword.type
                ) && (
                  <p className="validation_message">
                    {errors.confirmPassword.message}
                  </p>
                )}
            </div>
          </div>
          <div className={`${styles.form_group} ${styles.form_button}`}>
            <button type="submit" className={`btn_main`} disabled={isSubmitted ? (!isDirty || !isValid) : false}>
              {t("password.resetPassword.save")}
            </button>
          </div>
        </form>
        <NotifyModal
          open={openNotify}
          message={props.isSetPW ? t("password.resetPassword.successTitleSetPW") :  t("password.resetPassword.successTitle")}
          moreMessage={props.isSetPW ? t("password.resetPassword.successSetPW") : t("password.resetPassword.success")}
          title={""}
          textButton={t("close")}
          handleCloseModal={() => isAuthenticated ? history.push('/account') : history.push('/login')}
        ></NotifyModal>
      </div>
    </>
  );
};

export default ResetPassword;
