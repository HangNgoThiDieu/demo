import { FC, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { REGEX } from "utils/constants";
import { masterDataService } from "services/master-data.service";
import { toast } from "react-toastify";
import { CategoryModel } from "types/models/category/category.model";
import { MasterDataStatusResponse } from "utils/enums";
import styles from "./index.module.scss";

interface AddCategoryProps {
  open: boolean;
  handleClose: () => void;
  handleChange: () => void;
}

const CATEGPRY_FIELDS = {
  categoryName: "categoryName",
};

const AddCategoryModal: FC<AddCategoryProps> = (props: AddCategoryProps) => {
  const { t } = useTranslation();
  const [isSubmited, setIsSubmited] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
    reset
  } = useForm<CategoryModel>();

  const onSubmit = (data: any) => { 
    if (!isSubmited) {
      setIsSubmited(true);
      masterDataService
      .addCategory(data)
      .then((result) => {
        setIsSubmited(false);
        props.handleClose();
        props.handleChange();
        toast.success(t('product.modalAddCategory.success'));
        reset();
      })
      .catch((e) => {
        setIsSubmited(false);
        if (e.errorCode == MasterDataStatusResponse.DuplicatedName) {
          toast.error(t('product.error.duplicateCategoryName'));
        }
        else {
          toast.error(t('validation.errorMessage'));
        }
      });
    }
  };

  const onClose = () => {
    props.handleClose();
  };

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
      <p className={styles.title}>
        {t("product.modalAddCategory.title")}
      </p>
      <div className={styles.content_modal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content_form}>
            <div className={`form-group ${styles.form_input}`}>
              <p className="text_title">
                {t("product.modalAddCategory.categoryLabel")}
              </p>
              <div className={styles.mt_5}>
                <input
                  type="text"
                  autoFocus
                  {...register("name", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t('product.modalAddCategory.categoryLabel'),
                      })
                    },
                    pattern: {
                      value: REGEX.SPACE,
                      message: t("validation.required", {
                        field: t('product.modalAddCategory.categoryLabel'),
                      })
                    },
                    maxLength: { 
                      value: 50,
                      message: t('validation.maxLength', {
                        field: t('product.modalAddCategory.categoryLabel'),
                        max: 50
                      })
                    }
                  })}
                  className={`mt_16 ${styles.input_text}`}
                  placeholder={t("product.modalAddCategory.placeholder")}
                  onBlur={(e: any) => {
                    setValue(
                      "name",
                      getValues("name") && getValues("name").trim()
                    );
                    clearErrors();
                  }}
                />
                {errors.name && ["required", "pattern", "maxLength"].includes(errors.name.type) && (
                  <span className={styles.validation_message}>
                  {errors.name.message}
                </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.button_group}>
            <button
              className="btn_main"
            >
              {t("product.modalAddCategory.buttonAdd")}
            </button>
            <div className="mt_16">
              <button
                type="button"
                className="btn_white"
                onClick={() => onClose()}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
