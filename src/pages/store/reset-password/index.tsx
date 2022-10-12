import HeaderContent from "components/commons/header-content";
import Label from "components/commons/label";
import ConfirmForgotPasswordModal from "components/modals/confirm-forgot-password";
import NotifyModal from "components/modals/notify";
import { useLoadingContext } from "context/loading";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { accountService } from "services/account.service";
import { ForgotPasswordModel } from "types/models/reset-password/forgot-password.model";
import { REGEX } from "utils/constants";
import { UsersStatusResponse } from "utils/enums";
import styles from "./index.module.scss";

const ForgotPassword = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [isConfirm, setIsConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [notifyModal, setNotifyModal] = useState(false);
  const [data, setData] = useState<ForgotPasswordModel>(
    {} as ForgotPasswordModel
  );
  const { showLoading, hideLoading } = useLoadingContext();

  const {
    register,
    formState: { errors, isDirty, isValid, isSubmitted, isSubmitSuccessful,submitCount },
    handleSubmit,
    setValue,
    reset
  } = useForm<ForgotPasswordModel>();

  const onSubmit = async (data: ForgotPasswordModel) => {
    if (data) {
      try {
        const isExistEmail = await accountService.checkExistedEmail(data.email);
        if (isExistEmail) {
          setEmail(data.email);
          setData(data);
          setIsConfirm(true);
        }
        else {
          toast.error(t("password.forgotPassword.validation.emailNotFound"));
        }
      }
      catch (err) {
        toast.error(t("validation.errorMessage"));
      }
    }
  };

  const handleSubmitEmail = async () => {
		setIsConfirm(false);
    try {
      showLoading();
      await accountService.forgotPassword(data);
      setNotifyModal(true);
      hideLoading();
    } catch (err: any) {
      hideLoading();
			switch (err.errorCode) {
				case UsersStatusResponse.NotFound:
					toast.error(t("password.forgotPassword.validation.emailNotFound"));
          break;
				case UsersStatusResponse.InValid:
					toast.error(t("password.forgotPassword.validation.userInvalid"));
          break;
				default:
					toast.error(t("validation.errorMessage"));
          break;
			}
		}
  };

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name');
    setValue(attribute, event.target.value.trim());
  }

  return (
    <div className={styles.forgot_content}>
      <HeaderContent
        title={t("password.forgotPassword.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.goBack()}
      />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={styles.content}>
          <div className="form-group mt_48">
            <Label text={t("password.forgotPassword.email")}></Label>
            <input
              className={`${styles.input_text} mt_5`}
              type="text"
              placeholder={t("password.forgotPassword.email")}
              {...register("email", {
                required: {
                  value: true,
                  message: t("validation.required", {
                    field: t("password.forgotPassword.email"),
                  }),
                },
                maxLength: {
                  value: 256,
                  message: t("validation.maxLengthForEmail", {
                    max: 256,
                    field: t("password.forgotPassword.email"),
                  }),
                },
                pattern: {
                  value: REGEX.EMAIL_PATTERN,
                  message: t("validation.formatEmail"),
                },
                validate: (value) => { return !!value.trim()}
              })}
              onBlur={formatInput}
            />
            {errors.email &&
              ["required", "maxLength", "pattern"].includes(
                errors.email.type
              ) && <p className="validation_message">{errors.email.message}</p>}
          </div>
        </div>
        <div className={`${styles.form_group} ${styles.form_button}`}>
          <button type="submit" className={`btn_main`} disabled={isSubmitted ? (!isDirty || !isValid) : false}>
            {t("password.forgotPassword.btnForgot")}
          </button>
        </div>
      </form>
      <ConfirmForgotPasswordModal
        title={t("password.forgotPassword.modal.title")}
        subTitle={t("password.forgotPassword.modal.subTitle")}
        open={isConfirm}
        textButton={t("password.forgotPassword.modal.btnForgot")}
        textCancel={t("cancel")}
        handleEvent={() => handleSubmitEmail()}
        handleCloseModal={() => [setIsConfirm(false), reset({}, {keepValues: true})]}
        labelEmail={t("password.forgotPassword.modal.email")}
        email={email}
      />
      <NotifyModal
        open={notifyModal}
        message={t("password.forgotPassword.successTitle")}
        moreMessage={t("password.forgotPassword.success")}
        textButton={t("close")}
        handleCloseModal={() => history.push("/login")}
      ></NotifyModal>
    </div>
  );
};

export default ForgotPassword;
