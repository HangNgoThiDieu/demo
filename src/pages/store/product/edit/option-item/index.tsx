import { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styles from "../index.module.scss";
import ICON_TRASH from "assets/images/icon_trash.svg";
import IconAdd from "assets/images/icon_add.svg";
import { ProductOptionModel } from "types/models/product/edit/product-option.model";
import { DISCOUNT_TYPE, REGEX } from "utils/constants";
import NumberFormat from "react-number-format";
import { InputNumber } from "antd";
const locale = "en-us";

export default ({
  isDiscounted,
  couponType,
  nestIndex,
  control,
  register,
  errors,
  setValue,
  getValues,
  clearErrors,
  reset,
  isSubmitted,
  setError,
  unitPrice
}: {
  isDiscounted: boolean;
  couponType: number;
  nestIndex: number;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  clearErrors: any;
  reset: any;
  isSubmitted: boolean;
  setError: any;
  unitPrice?: string;
}) => {
  const { t } = useTranslation();
  const [countItem, setCountItem] = useState(1);

  const {
    fields: optionItemFields,
    remove: optionItemRemove,
    append: optionItemAppend,
  } = useFieldArray({
    control,
    name: `listProductOptionGroup.${nestIndex}.listProductOption`,
    //keyName: "_id",
  });

  const handleAddOptionItem = () => {
    optionItemAppend(new ProductOptionModel());
    setCountItem(countItem + 1);
    if (isSubmitted) {
      setError(
        `listProductOptionGroup.${nestIndex}.listProductOption.${countItem}.name`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.optionItem.optionName"),
          }),
        }
      );
      setError(
        `listProductOptionGroup.${nestIndex}.listProductOption.${countItem}.optionAmount`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.optionItem.optionAmount"),
          }),
        }
      );
    }
  };

  const IsDuplicatedOptionName = (k: number, name: string) => {
    const listGroupOption = getValues(
      `listProductOptionGroup.${nestIndex}.listProductOption`
    );
    const filteredItems = listGroupOption
      .slice(0, k)
      .concat(listGroupOption.slice(k + 1, listGroupOption.length));

    const uniqueSeat = filteredItems.some(
      (x: ProductOptionModel) =>
        x.name.trim().toLowerCase() == name.trim().toLowerCase()
    );

    if (uniqueSeat) {
      return false;
    } else {
      clearErrors(
        `listProductOptionGroup.${nestIndex}.listProductOption.${k}.name` as const
      );
      return true;
    }
  };

  useEffect(() => {

    const option = getValues(
      `listProductOptionGroup.${nestIndex}.listProductOption`
    );
    if (option.length > 1) {
      setCountItem(option.length);
    }
  }, []);

  const currencyFormatter = (value: any, callback?: any, isZero?: boolean) => {
    if (value === 0 && isZero) {
      return value;
    }
    if (value === 0 || value === "" || value === undefined) {
      return "";
    }
    let isNegative = false;
    console.log(value);
    if (value?.toString().startsWith("-")) {
      isNegative = true;
    }

    value += '';
    let newVal = value.replace(/[^0-9.]/g, '');
    if (isNegative) {
      newVal = (-1) * newVal;
    }

    let val = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "JPY"
    }).format(newVal);

    val = val.replace("¥", "");
    console.log("after", val);
    if (callback) {
      callback(val);
      return;
    }

    return val;
  };

  const numeralParseInt = (str: any) => {
    try {
      const zero = "０";
      const zeroCharCode = zero.charCodeAt(0);
      const digits = new Array(str.length);

      for (let i = 0; i < str.length; i++) {
        digits[i] = str.charCodeAt(i);
        if (zeroCharCode <= digits[i] && digits[i] < zeroCharCode + 10) {
          digits[i] -= zeroCharCode - "0".charCodeAt(0);
        }
      }
      return String.fromCharCode.apply(null, digits);
    }
    catch (e) {
      console.log(e);
    }
  }

  const handleChange = (nestIndex: number, k: number, el: any, callback: any) => {
    const val = currencyFormatter(el);

    setValue(`optionGroupItemList.${nestIndex}.optionItemList.${k}.optionAmount`, val as never)

    callback(val);
  };



  const currencyParser = (val: any) => {
    try {
      // for when the input gets clears
      val = numeralParseInt(val);

      return val;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={styles.add_options}>
        <p className="mb_4">
          {t("product.settingOptional.groups.optionTitle")}
        </p>
        {optionItemFields.map((row, k) => {
          return (
            <div>
              {k > 0 ? <div className={styles.separate_child}></div> : null}
              <div key={row.id} className={styles.option_item}>
                <input type="hidden" name="optionId" value={row.id}
                  {...register(
                    `listProductOptionGroup.${nestIndex}.listProductOption.${k}.Id` as const)} />
                <input
                  className={styles.input_text}
                  type="text"
                  placeholder=""
                  {...register(
                    `listProductOptionGroup.${nestIndex}.listProductOption.${k}.name` as const,
                    {
                      required: {
                        value: true,
                        message: t("validation.required", {
                          field: t(
                            "product.settingOptional.groups.optionItem.optionName"
                          ),
                        }),
                      },
                      maxLength: {
                        value: 256,
                        message: t("validation.maxLength", {
                          max: 256,
                          field: t(
                            "product.settingOptional.groups.optionItem.optionName"
                          ),
                        }),
                      },
                      pattern: {
                        value: REGEX.SPACE,
                        message: t("validation.required", {
                          field: t(
                            "product.settingOptional.groups.optionItem.optionName"
                          ),
                        }),
                      },
                      validate: (v: any) => IsDuplicatedOptionName(k, v),
                    }
                  )}
                  onBlur={(e: any) => {
                    setValue(
                      `listProductOptionGroup.${nestIndex}.listProductOption.${k}.name`,
                      getValues(`listProductOptionGroup.${nestIndex}.listProductOption.${k}.name`)
                      && getValues(`listProductOptionGroup.${nestIndex}.listProductOption.${k}.name`)?.trim()
                    );
                  }}
                />
                {errors?.listProductOptionGroup &&
                  errors?.listProductOptionGroup[nestIndex]
                    ?.listProductOption &&
                  ["required", "pattern", "maxLength", "validate"].includes(
                    errors?.listProductOptionGroup[nestIndex]
                      ?.listProductOption[k]?.name?.type || ""
                  ) && (
                    <span className={styles.validation_message}>
                      {errors?.listProductOptionGroup[nestIndex]
                        ?.listProductOption[k]?.name?.type !== "validate"
                        ? errors?.listProductOptionGroup[nestIndex]
                          ?.listProductOption[k]?.name?.message
                        : t(
                          "product.settingOptional.groups.errors.duplicatedOptionName"
                        )}
                    </span>
                  )}
                <div className={styles.option_amount}>
                  <div className={styles.flex_column_message}>
                    <div className={styles.flex_row_message}>
                      <Controller
                        name={
                          `listProductOptionGroup.${nestIndex}.listProductOption.${k}.optionAmount` as const
                        }
                        control={control}
                        render={({ field }) => {
                          return (
                            <InputNumber
                              {...register(`listProductOptionGroup.${nestIndex}.listProductOption.${k}.optionAmount` as const, {
                                required: {
                                  value: true,
                                  message: t("validation.required", {
                                    field: t(
                                      "product.settingOptional.groups.optionItem.optionAmount"
                                    ),
                                  }),
                                },
                                max: {
                                  value: 99999999999,
                                  message: t("validation.maxLengthForNumber", {
                                    max: 11,
                                    field: t(
                                      "product.settingOptional.groups.optionItem.optionAmount"
                                    ),
                                  }),
                                },
                                pattern: {
                                  value: REGEX.POSITIVE_INTEGER,
                                  message: t("validation.inValidNumber"),
                                },
                              })}
                              placeholder="0"
                              className={`${styles.input_number} flex_1`}
                              parser={(txt: any) => currencyParser(txt)}
                              value={field.value === 0 ? "" : field.value}
                              onChange={(el) => handleChange(nestIndex, k, el, field.onChange)}
                              onBlur={(value) => currencyFormatter(value.target.value, field.onChange, true)}
                            />
                          )
                        }}
                      />
                      <div className={styles.price_product}>
                        <p className="text_small ml_8">
                          {t("unitPrice", { unitPrice: unitPrice })}
                          {t("tax")}
                        </p>
                      </div>
                    </div>
                    {errors?.listProductOptionGroup &&
                      errors?.listProductOptionGroup[nestIndex]
                        ?.listProductOption &&
                      ["required", "pattern", "max"].includes(
                        errors?.listProductOptionGroup[nestIndex]
                          ?.listProductOption[k]?.optionAmount?.type || ""
                      ) && (
                        <span className={styles.validation_message}>
                          {
                            errors?.listProductOptionGroup[nestIndex]
                              ?.listProductOption[k]?.optionAmount?.message
                          }
                        </span>
                      )}
                  </div>
                  <div
                    className={`${errors?.listProductOptionGroup &&
                      errors?.listProductOptionGroup[nestIndex]
                        ?.listProductOption &&
                      errors?.listProductOptionGroup[nestIndex]
                        ?.listProductOption[k]?.optionAmount?.message !==
                      undefined
                      ? styles.flex_row_has_message
                      : styles.flex_row
                      }`}
                  >
                    {countItem > 1 && (
                      <button
                        className={`btn_sub ${styles.button_trash}`}
                        onClick={() => [
                          optionItemRemove(k),
                          setCountItem(optionItemFields.length - 1),
                        ]}
                      >
                        <img className="" src={ICON_TRASH} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.add_option_item}>
        <button
          type="button"
          className={`btn_add_category ${styles.btn_add_category}`}
          onClick={() => handleAddOptionItem()}
        >
          <img src={IconAdd} className="mr_4" />
          {t("product.settingOptional.addOptionButton")}
        </button>
      </div>
    </>
  );
};