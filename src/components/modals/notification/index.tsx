import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-datepicker/dist/react-datepicker.css";
import "react-responsive-modal/styles.css";
import { useForm, Controller } from "react-hook-form";
import {
  NotificationStatusList,
  NOTIFICATION_STATUS,
  REGEX,
} from "utils/constants";
import DatePicker from "react-datepicker";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { NotificationDetailResult } from "types/results/notification/notification-detail.result";

interface NotificationProps {
  open: boolean;
  title?: string;
  isAdd: boolean;
  textButton: string;
  textCancel: string;
  notificationResult?: NotificationDetailResult;
  handleEvent: (data: any) => void;
  handleCloseModal: () => void;
}

const NotificationModal: React.FC<NotificationProps> = (
  props: NotificationProps
) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isValid, isDirty },
    reset,
    control,
    getValues,
    setValue
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const validation = () => {
    let validation = true;
    let startDate = getValues("startDate");
    let endDate = getValues("endDate");

    if (startDate > endDate) {
      validation = false;
    }

    return validation;
  };

  useEffect(() => {
    if (props.isAdd) {
      reset(props.notificationResult, {keepErrors: false, keepIsSubmitted: false});
    } else {
      setValue("title",props.notificationResult?.title);
      setValue("content",props.notificationResult?.content);
      setValue("startDate",props.notificationResult?.startDate);
      setValue("endDate",props.notificationResult?.endDate);
      setValue("status", props.notificationResult?.status);
    }
  }, [props.open == true]);

  return (
    <>
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
        <div className="text-center">
          <span className="title_modal">{props.title}</span>
        </div>
        <form onSubmit={handleSubmit(props.handleEvent)} autoComplete="off">
          <div className="form-group mt_24">
            <span className="text_bold">{t("notification.title")}</span>
            <div className="mt_4">
              <input
                {...register("title", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("notification.title"),
                    }),
                  },
                  pattern: {
                    value: REGEX.SPACE,
                    message: t("validation.required", {
                      field: t("notification.title"),
                    }),
                  },
                  maxLength: {
                    value: 100,
                    message: t("validation.maxLength", {
                      max: 100,
                      field: t("notification.title"),
                    }),
                  },
                })}
                type="text"
                className={styles.input}
                defaultValue={props.notificationResult?.title}
                autoComplete="off"
              />
              {errors.title &&
                ["required", "pattern", "maxLength"].includes(
                  errors.title.type
                ) && (
                  <span className="validation_message">
                    {errors.title.message}
                  </span>
                )}
            </div>
          </div>
          <div className="form-group mt_16">
            <span className="text_bold">{t("notification.content")}</span>
            <div className="mt_4">
              <textarea
                rows={2}
                {...register("content", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("notification.content"),
                    }),
                  },
                  pattern: {
                    value: REGEX.SPACE,
                    message: t("validation.required", {
                      field: t("notification.content"),
                    }),
                  },
                  maxLength: {
                    value: 1000,
                    message: t("validation.maxLength", {
                      max: 1000,
                      field: t("notification.content"),
                    }),
                  },
                })}
                className={styles.input}
                defaultValue={props.notificationResult?.content}
                autoComplete="off"
              />
              {errors.content &&
                ["required", "pattern", "maxLength"].includes(
                  errors.content.type
                ) && (
                  <span className="validation_message">
                    {errors.content.message}
                  </span>
                )}
            </div>
          </div>
          <div className="form-group mt_12">
            <span className="text_bold">{t("notification.startDate")}</span>
            <div className="mt_4">
              <div className={styles.date}>
                <Controller
                  control={control}
                  name={"startDate"}
                  defaultValue={props.notificationResult?.startDate}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                      locale={t("lang")}
                      timeInputLabel={t("timeInputLabel")}
                      dateFormat={t("dateFormat")}
                      // showTimeInput
                      placeholderText={t("datePlaceHolder")}
                      minDate={new Date()}
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("notification.startDate"),
                      }),
                    },
                    // validate: validation
                  }}
                />
              </div>
              {errors.startDate &&
                ["required", "validate"].includes(errors.startDate.type) && (
                  <p className="validation_message">
                    {errors.startDate.type !== "validate"
                      ? t("validation.required", {
                          field: t("notification.startDate"),
                        })
                      : t("validation.endDateGreaterStartDate")}
                    {}
                  </p>
                )}
            </div>
          </div>
          <div className="form-group mt_16">
            <span className="text_bold">{t("notification.endDate")}</span>
            <div className="mt_4">
              <div className={styles.date}>
                <Controller
                  control={control}
                  name={"endDate"}
                  defaultValue={props.notificationResult?.endDate}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                      locale={t("lang")}
                      timeInputLabel={t("timeInputLabel")}
                      dateFormat={t("dateFormat")}
                      // showTimeInput
                      placeholderText={t("datePlaceHolder")}
                      minDate={new Date()}
                    />
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("notification.endDate"),
                      }),
                    },
                    validate: validation,
                  }}
                />
              </div>
              {errors.endDate &&
                ["required", "validate"].includes(errors.endDate.type) && (
                  <p className="validation_message">
                    {errors.endDate.type !== "validate"
                      ? t("validation.required", {
                          field: t("notification.endDate"),
                        })
                      : t("validation.endDateGreaterStartDate")}
                    {}
                  </p>
                )}
            </div>
          </div>
          <div className="form-group mt_24">
            <span className="text_bold">{t("notification.public")}</span>
            <div className="mt_4">
              {NotificationStatusList.map((item, index) => (
                <label key={index} className="mr_32">
                  <input
                    {...register("status")}
                    value={item.key}
                    type="radio"
                    defaultChecked={
                      props.isAdd
                        ? index == 0
                        : props.notificationResult?.status == item.key
                    }
                  />
                  <span className={styles.text_radio}>
                    {item.key === NOTIFICATION_STATUS.Public
                      ? t("notification.public")
                      : t("notification.private")}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className={`${styles.button_group} mt_36`}>
            <button type="submit" className="btn_main" disabled={Array.isArray(errors) || Object.values(errors).toString() != ""}>
              {props.textButton}
            </button>
            <div className="mt_16">
              <button
                type="button"
                className="btn_white"
                onClick={props.handleCloseModal}
              >
                {props.textCancel}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default NotificationModal;
