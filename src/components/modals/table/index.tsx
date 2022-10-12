import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";
import iconDelete from "assets/images/icon_delete.svg";
import { TableEditModel } from "types/models/table-setting/table-edit.model";
import { useFieldArray, useForm } from "react-hook-form";
import { REGEX } from "utils/constants";
import { useEffect } from "react";
import { TableAddModel } from "types/models/table-setting/table-add.model";
import { SeatItemModel } from "types/models/table-setting/seat-item.model";

interface TableProps {
  open: boolean;
  tableEdit?: TableEditModel;
  tableAdd?: TableAddModel;
  isAdd: boolean;
  title: string;
  textButton: string;
  isEnableSeat: boolean;
  handleEventTable: (data: any) => void;
  handleCloseModal: () => void;
}

const TableModal: React.FC<TableProps> = (props: TableProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitted},
    reset,
    control,
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    fields: seatAddFields,
    append: seatAddAppend,
    remove: seatAddRemove,
  } = useFieldArray({
    name: "listSeat",
    control,
    keyName: "_id",
  });

  const {
    fields: seatEditFields,
    append: seatEditAppend,
    remove: seatEditRemove,
  } = useFieldArray({
    name: "listSeat",
    control,
    keyName: "_id",
  });

  const handleAddSeatItem = (isAdd: boolean) => {
    isAdd
      ? seatAddAppend(new SeatItemModel())
      : seatEditAppend(new SeatItemModel());
  };

  const handleDeleteSeat = (index: any, isAdd: boolean) => {
    isAdd ? seatAddRemove(index) : seatEditRemove(index);
  };

  const IsDuplicatedSeat = (index: number, name: string) => {
    const listSeat = getValues("listSeat");
    const filteredItems = listSeat
      .slice(0, index)
      .concat(listSeat.slice(index + 1, listSeat.length));

    const uniqueSeat = filteredItems.some(
      (x: SeatItemModel) =>
        x.name.trim().toLowerCase() == name.trim().toLowerCase()
    );

    if (uniqueSeat) {
      return false;
    } else {
      clearErrors(`listSeat.${index}.name` as const);
      return true;
    }
  };

  useEffect(() => {
    if (props.isAdd) {
      reset(props.tableAdd);
    } else {
      setValue("id", props.tableEdit?.id);
      setValue("name", props.tableEdit?.name);
      seatEditFields.length > 0 && seatEditRemove();
      props.tableEdit?.listSeat.map((item, index) => {
        return seatEditAppend(item);
      })
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
          <label className="title_modal">{props.title}</label>
        </div>
        <form
          onSubmit={handleSubmit(props.handleEventTable)}
          autoComplete="off"
        >
          <div className="form-group mt_24">
            <label className="text_bold_14">
              {t("tableSetting.tableName")}
            </label>
            <div className="mt_4">
              <input
                type="text"
                autoComplete="off"
                {...register("name", {
                  required: {
                    value: true,
                    message: t("validation.required", {
                      field: t("tableSetting.tableName"),
                    }),
                  },
                  pattern: {
                    value: REGEX.SPACE,
                    message: t("validation.required", {
                      field: t("tableSetting.tableName"),
                    }),
                  },
                  maxLength: {
                    value: 50,
                    message: t("validation.maxLength", {
                      max: 50,
                      field: t("tableSetting.tableName"),
                    }),
                  },
                })}
                className={styles.input}
                defaultValue={
                  props.isAdd
                    ? props.tableAdd?.name
                    : props.tableEdit?.name.trim()
                }
              />
              {errors.name &&
                ["required", "pattern", "maxLength"].includes(
                  errors.name.type
                ) && (
                  <span className={styles.validation_message}>
                    {errors.name.message}
                  </span>
                )}
            </div>
          </div>
          {props.isEnableSeat && (
            <div className="form-group mt_24">
            
            {props.isAdd
              ? seatAddFields.map((row, index) => {
                  return (
                    <>
                      <label className="text_bold_14">
                      {t("tableSetting.chairName")}
                      </label>
                      <div
                        key={row._id}
                        className={`${styles.group_chair} mt_4  mb_12`}
                      >
                        <div className={`${styles.flex_column} mr_12`}>
                          <input
                            className={`${styles.input} mr_12`}
                            type="text"
                            placeholder=""
                            autoComplete="off"
                            {...register(`listSeat.${index}.name` as const, {
                              required: {
                                value: true,
                                message: t("validation.required", {
                                  field: t("tableSetting.chairName"),
                                }),
                              },
                              maxLength: {
                                value: 50,
                                message: t("validation.maxLength", {
                                  max: 50,
                                  field: t("tableSetting.chairName"),
                                }),
                              },
                              pattern: {
                                value: REGEX.SPACE,
                                message: t("validation.required", {
                                  field: t("tableSetting.chairName"),
                                }),
                              },
                              validate: (v) => IsDuplicatedSeat(index, v),
                            })}
                          />
                          {errors?.listSeat &&
                            ["required", "pattern", "maxLength", "validate"].includes(
                              errors?.listSeat[index]?.name.type || ""
                            ) && (
                              <span className="validation_message">
                                {errors?.listSeat[index]?.name.type !== "validate"
                                  ? errors?.listSeat[index]?.name?.message
                                  : t("tableSetting.error.duplicatedSeatName")}
                              </span>
                            )}
                        </div>
                        <div
                          key={row._id}
                          className="item_delete mt-none w-40 h-40"
                          onClick={() => handleDeleteSeat(index, true)}
                        >
                          <img
                            className="image_delete"
                            src={iconDelete}
                            alt="iconDelete"
                          ></img>
                        </div>
                      </div>
                    </>
                  );
                })
              : seatEditFields.map((row, index) => {
                  return (
                    <>
                      <label className="text_bold_14">
                        {t("tableSetting.chairName")}
                      </label>
                      <div
                        key={row._id}
                        className={`${styles.group_chair} mt_4 mb_12`}
                      >
                        <div className={`${styles.flex_column} mr_12`}>
                          <input
                            className={`${styles.input}`}
                            type="text"
                            placeholder=""
                            autoComplete="off"
                            {...register(`listSeat.${index}.name` as const, {
                              required: {
                                value: true,
                                message: t("validation.required", {
                                  field: t("tableSetting.chairName"),
                                }),
                              },
                              maxLength: {
                                value: 50,
                                message: t("validation.maxLength", {
                                  max: 50,
                                  field: t("tableSetting.chairName"),
                                }),
                              },
                              pattern: {
                                value: REGEX.SPACE,
                                message: t("validation.required", {
                                  field: t("tableSetting.chairName"),
                                }),
                              },
                              validate: (v) => IsDuplicatedSeat(index, v),
                            })}
                          />
                          {errors?.listSeat &&
                            [
                              "required",
                              "pattern",
                              "maxLength",
                              "validate",
                            ].includes(
                              errors?.listSeat[index]?.name.type || ""
                            ) && (
                              <span className="validation_message">
                                {errors?.listSeat[index]?.name.type !== "validate"
                                  ? errors?.listSeat[index]?.name?.message
                                  : t("tableSetting.error.duplicatedSeatName")}
                              </span>
                            )}
                        </div>
                        <div
                          className="item_delete mt-none w-40 h-40"
                          onClick={() => handleDeleteSeat(index, false)}
                        >
                          <img
                            className="image_delete"
                            src={iconDelete}
                            alt="iconDelete"
                          ></img>
                        </div>
                      </div>
                    </>
                    );
                })
            } 
            </div>
          )}
          {props.isEnableSeat && (
            <div className="mt_24">
              <button
                type="button"
                className={`text_title btn_sub`}
                onClick={() => handleAddSeatItem(props.isAdd)}
              >
                {t("tableSetting.add.buttonAddChair")}
              </button>
            </div>
          )}

          <div className={`${styles.button_group} mt_24`}>
            <button
              type="button"
              onClick={props.handleCloseModal}
              className="btn_white mr_4"
            >
              {t("cancel")}
            </button>
            <button type="submit" className="btn_main ml_4" disabled={Array.isArray(errors) || Object.values(errors).toString() != ""}>
              {props.textButton}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default TableModal;
