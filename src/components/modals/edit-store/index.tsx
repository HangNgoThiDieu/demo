import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import styles from "./index.module.scss";
import "react-responsive-modal/styles.css";
import { EditStoreModel } from "types/models/store-setting/edit-store.models";
import { useForm } from "react-hook-form";
import { LANGUAGE_LIST, REGEX } from "utils";
import { useEffect } from "react";
import { convertTimeToString } from "utils/datetime";

interface StoreProps {
  open: boolean;
  title?: string;
  textButton: string;
  textCancel: string;
  storeModel?: EditStoreModel;
  handleEvent: (data: EditStoreModel) => void;
  handleCloseModal: (e?: any) => void;
  handleChangeLanguage: (e: any) => void;
}

const StoreModal: React.FC<StoreProps> = (props: StoreProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isDirty, isValid, isSubmitted },
    reset,
    clearErrors,
  } = useForm();

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
          <label className="title_modal">{props.title}</label>
        </div>
        <form onSubmit={handleSubmit(props.handleEvent)} autoComplete="off">
          {/* store name */}
          <div className="form-group mt_24">
            <span className="text_bold">
              {t("storeSetting.edit.storeName")}
            </span>
            <div className="mt_4">
              <input
                {...register("storeName", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("storeSetting.edit.storeName"),
                    }),
                  },
                  pattern: {
                    value: REGEX.SPACE,
                    message: t("validation.required", {
                      field: t("storeSetting.edit.storeName"),
                    }),
                  },
                  maxLength: {
                    value: 256,
                    message: t("validation.maxLength", {
                      max: 256,
                      field: t("storeSetting.edit.storeName"),
                    }),
                  },
                })}
                type="text"
                className={styles.input}
                defaultValue={props.storeModel?.storeName}
                onBlur={(e: any) => {
                  setValue(
                    "storeName",
                    getValues("storeName") && getValues("storeName").trim()
                  );
                }}
              />
              {errors.storeName &&
                ["required", "pattern", "maxLength"].includes(
                  errors.storeName.type
                ) && (
                  <span className="validation_message">
                    {errors.storeName.message}
                  </span>
                )}
            </div>
          </div>

          {/* address */}
          <div className="form-group mt_24">
            <span className="text_bold">{t("storeSetting.edit.address")}</span>
            <div className="mt_4">
              <input
                {...register("address", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("storeSetting.edit.address"),
                    }),
                  },
                  pattern: {
                    value: REGEX.SPACE,
                    message: t("validation.required", {
                      field: t("storeSetting.edit.address"),
                    }),
                  },
                  maxLength: {
                    value: 256,
                    message: t("validation.maxLength", {
                      max: 256,
                      field: t("storeSetting.edit.address"),
                    }),
                  },
                })}
                type="text"
                className={styles.input}
                defaultValue={props.storeModel?.address}
                onBlur={(e: any) => {
                  setValue(
                    "address",
                    getValues("address") && getValues("address").trim()
                  );
                }}
              />
              {errors.address &&
                ["required", "pattern", "maxLength"].includes(
                  errors.address.type
                ) && (
                  <span className="validation_message">
                    {errors.address.message}
                  </span>
                )}
            </div>
          </div>

          {/* phone number */}
          <div className="form-group mt_24">
            <span className="text_bold">
              {t("storeSetting.edit.phoneNumber")}
            </span>
            <div className="mt_4">
              <input
                {...register("phoneNumber", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("storeSetting.edit.phoneNumber"),
                    }),
                  },
                  pattern: {
                    value: REGEX.REGEX_PHONE_NUMBER,
                    message: t("validation.formatPhoneNumber", {
                      field: t("storeSetting.edit.phoneNumber"),
                    }),
                  },
                  maxLength: {
                    value: 20,
                    message: t("validation.maxLength", {
                      max: 20,
                      field: t("storeSetting.edit.phoneNumber"),
                    }),
                  },
                })}
                type="text"
                className={styles.input}
                defaultValue={props.storeModel?.phoneNumber}
                placeholder={t("storeSetting.edit.phoneNumberPlaceholder")}
                onBlur={(e: any) => {
                  setValue(
                    "phoneNumber",
                    getValues("phoneNumber") && getValues("phoneNumber").trim()
                  );
                }}
              />
              {errors.phoneNumber &&
                ["required", "pattern", "maxLength"].includes(
                  errors.phoneNumber.type
                ) && (
                  <span className="validation_message">
                    {errors.phoneNumber.message}
                  </span>
                )}
            </div>
          </div>

          {/* email */}
          <div className="form-group mt_24">
            <span className="text_bold">{t("storeSetting.edit.email")}</span>
            <div className="mt_4">
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("storeSetting.edit.email"),
                    }),
                  },
                  pattern: {
                    value: REGEX.EMAIL_PATTERN,
                    message: t("validation.formatEmail"),
                  },
                  maxLength: {
                    value: 256,
                    message: t("validation.maxLength", {
                      max: 256,
                      field: t("storeSetting.edit.email"),
                    }),
                  },
                })}
                type="text"
                className={styles.input}
                defaultValue={props.storeModel?.email}
                onBlur={(e: any) => {
                  setValue(
                    "email",
                    getValues("email") && getValues("email").trim()
                  );
                }}
              />
              {errors.email &&
                ["required", "pattern", "maxLength"].includes(
                  errors.email.type
                ) && (
                  <span className="validation_message">
                    {errors.email.message}
                  </span>
                )}
            </div>
          </div>

          {/* language */}
          <div className="form-group mt_24">
            <span className="text_bold">{t("storeSetting.edit.language")}</span>
            <div className="mt_4">
              <select
                // {...register("language")}
                className={styles.filter}
                onChange={(e: any) =>
                  props.handleChangeLanguage(e.target.value)
                }
                defaultValue={props.storeModel?.language}
              >
                {LANGUAGE_LIST.map((item, i) => (
                  <option key={i} value={item.key}>
                    {t(item.value)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* currency */}
          <div className="form-group mt_24">
            <span className="text_bold">{t("storeSetting.edit.currency")}</span>
            <div className="mt_4">
              <input
                {...register("currencyUnit")}
                type="text"
                className={styles.input}
                defaultValue={props.storeModel?.currencyUnit}
              />
            </div>
          </div>

          {/* working time */}
          
          <div className="mt_36">
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
export default StoreModal;
