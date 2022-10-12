import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import { LoginModel } from "../../../types/models/login.model";
import styles from "./index.module.scss";
import { Alert, Form } from "react-bootstrap";
import Label from "components/commons/label";
import { MAX_LENGTH, MIN_LENGTH, REGEX } from "utils/constants";
import { ErrorsCode } from "utils/enums";
import { useState } from "react";
import { useLoadingContext } from "context/loading";

const Login = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useAuth();
  const history = useHistory();
  const [showMessage, setShowMessage] = useState(false);
  const [messageError, setMessageError] = useState<string>();
  const { showLoading, hideLoading } = useLoadingContext();

  const onSubmit = async (data: LoginModel) => {
    setShowMessage(false);
    try {
      showLoading();
      await signIn({
        username: data.username,
        password: data.password,
      });
      history.push("/");
      hideLoading();
    } catch (e: any) {
      hideLoading();
      switch (e.errorCode) {
        case ErrorsCode.InvalidUserNameOrPassword: {
          setShowMessage(true);
          setMessageError(t("login.invalidUsernameOrPassword"));
          break;
        }

        case ErrorsCode.Locked: {
          setShowMessage(true);
          setMessageError(t("login.accountLock"));
          break;
        }

        case ErrorsCode.Disable: {
          setShowMessage(true);
          setMessageError(t("login.accountDisabled"));
          break;
        }

        case ErrorsCode.CompanyStop: {
          setShowMessage(true);
          setMessageError(t("login.companyStop"));
          break;
        }

        case ErrorsCode.Unauthorized: {
          setShowMessage(true);
          setMessageError(t("login.unauthorized"));
          break;
        }

        default: {
          setShowMessage(true);
          setMessageError(t("validation.errorMessage"));
          break;
        }
      }
    }
  };
  return (
    <>
      <div className={styles.form_login}>
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
            <Form.Group className="mb-4">
              <Label text={t("login.labelUsername")}></Label>
              <Form.Control
                className={styles.input_text}
                type="text"
                {...register("username", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("login.labelUsername"),
                    }),
                  },
                  pattern: {
                    value: REGEX.EMAIL_PATTERN,
                    message: t("validation.formatEmail"),
                  },
                  maxLength: {
                    value: 256,
                    message: t("validation.maxLengthForEmail", {
                      max: 256,
                      field: t("login.labelUsername"),
                    }),
                  },
                })}
                placeholder={t("login.placeholderEmail")}
              />
              {errors.username &&
                ["required", "pattern", "maxLength"].includes(
                  errors.username.type
                ) && (
                  <span className={styles.validation_message}>
                    {errors.username.message}
                  </span>
                )}
            </Form.Group>
            <Form.Group className="mb-4">
              <Label text={t("login.labelPassword")}></Label>
              <Form.Control
                className={styles.input_text}
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("login.labelPassword"),
                    }),
                  },
                  pattern: {
                    value: REGEX.SPACE,
                    message: t("validation.notAllowSpace", {
                      field: t("login.labelPassword"),
                    }),
                  },
                  minLength: {
                    value: MIN_LENGTH,
                    message: t("validation.length", {
                      field: t("login.labelPassword"),
                      min: MIN_LENGTH,
                      max: MAX_LENGTH
                    }),
                  },
                  maxLength: {
                    value: MAX_LENGTH,
                    message: t("validation.length", {
                      field: t("login.labelPassword"),
                      min: MIN_LENGTH,
                      max: MAX_LENGTH
                    }),
                  },
                })}
                placeholder={t("login.placeholderPassword")}
              />
              {errors.password &&
                ["required", "minLength", "maxLength", "pattern"].includes(
                  errors.password.type
                ) && (
                  <span className={styles.validation_message}>
                    {errors.password.message}
                  </span>
                )}
            </Form.Group>
            <Form.Group className="mb-4">
              <div className={styles.forgot_pass}>
                <Link to="/store/forgot-password">{t("login.forgotPassword")}</Link>
              </div>
            </Form.Group>
          </div>
          <Form.Group className={styles.form_button}>
            <button className="btn_main">{t("login.buttonLogin")}</button>
          </Form.Group>
        </form>
      </div>
    </>
  );
};
export default Login;
