import HeaderContent from "components/commons/header-content";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { productService } from "services/product.service";
import styles from "./index.module.scss";
import IconAdd from "assets/images/icon_add.svg";
import IconClose from "assets/images/icon_close.svg";
import { useHistory } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  DISCOUNT_TYPE,
  DiscountTypeList,
  REGEX,
  CURRENCY_UNITS,
  MAX_SIZE_IMAGE,
} from "utils/constants";
import { masterDataService } from "services/master-data.service";
import { CategoryResult } from "types/results/master-data/category.result";
import ImageUploading, { ImageType } from "react-images-uploading";
import ButtonAddImage from "components/commons/button-add-image";
import Image from "components/commons/image";
import Config from "config";
import AddCategoryModal from "components/modals/add-category";
import ProductModal from "components/modals/product";
import { ProductAddModel } from "types/models/product/product-add.model";
import { OptionGroupsModel } from "types/models/product/add/option-groups.model";
import NotifyModal from "components/modals/notify";
import OptionItems from "../add/option-item/";
import { ProductStatusResponse } from "utils/enums";
import NumberFormat from "react-number-format";
import { tokenHelper } from "utils/store-token";
import { convertImageType, resizeFile, toBase64 } from "utils/resize-img";
import { useLoadingContext } from "context/loading";

const ADD_PRODUCT_FIELDS = {
  categoryId: "categoryId",
  categoryName: "category",
  productName: "productName",
  isMultipleSelection: "isMultipleSelection",
  isSoldOut: "isSoldOut",
  isMenuPublic: "isMenuPublic",
  isDiscounted: "isDiscounted",
  price: "price",
  couponType: "couponType",
  mainImage: "mainImage",
  subImage: "subImage",
  discountValue: "discountValue",
  couponCurrency: "couponCurrency",
  couponDiscount: "couponDiscount",
  description: "description",
};

const AddProduct = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();

  const [categoryList, setCategoryList] = useState<CategoryResult[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [productAdd, setProductAdd] = useState<ProductAddModel>(
    {} as ProductAddModel
  );
  const [mainImageProduct, setMainImageProduct] = useState<string>();
  const [isNotMultipleSelection, setIsNotMultipleSelection] =
    useState<boolean>(false);
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false);
  const [isMenuPublic, setIsMenuPublic] = useState<boolean>(false);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
  const [mainImage, setMainImage] = useState<any[]>([]);
  const [subImages, setSubImages] = useState<any[]>([]);
  const maxImage = 9;
  const [isSubmit, setIsSubmit] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [couponType, setCouponType] = useState(DISCOUNT_TYPE.Percent);
  const width = window.innerWidth;
  const [unitPrice, setUnitPrice] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitted },
    setValue,
    control,
    getValues,
    clearErrors,
    setError,
    unregister,
  } = useForm<ProductAddModel>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    fields: optionGroupFields,
    append: optionGroupAppend,
    remove: optionGroupRemove,
  } = useFieldArray({
    name: "optionGroupItemList",
    control,
    keyName: "_id",
  });

  const isOverPrice = () => {
    const price = getValues("price");
    const discountPercent = getValues("discountPercent") || 0;
    const discountCurrency = getValues("discountCurrency") || 0;
    let total = 0;

    const optionGroupItemList = getValues(`optionGroupItemList`);
    for (let i = 0; i < optionGroupItemList.length; i++) {
      let optionItemList = optionGroupItemList[i].optionItemList;

      let sumOptionItemList = optionItemList.reduce(
        (prev: number, cur: any) => parseInt(cur.optionAmount) + prev,
        0
      );

      total += sumOptionItemList;
    }

    if (isDiscounted) {
      if (couponType == DISCOUNT_TYPE.Percent) {
        const paymentPrice = price - (discountPercent * price) / 100;

        return total + paymentPrice >= 0;
      } else {
        const paymentPrice = price - discountCurrency;
        return total + paymentPrice >= 0;
      }
    } else {
      return (total + price) >= 0;
    }
  };

  const IsDuplicatedGroupOptionName = (index: number, name: string) => {
    const listGroupOption = getValues("optionGroupItemList");
    const filteredItems = listGroupOption
      .slice(0, index)
      .concat(listGroupOption.slice(index + 1, listGroupOption.length));

    const uniqueSeat = filteredItems.some(
      (x: OptionGroupsModel) =>
        x.optionGroupName.trim().toLowerCase() == name.trim().toLowerCase()
    );

    if (uniqueSeat) {
      return false;
    } else {
      clearErrors(`optionGroupItemList.${index}.optionGroupName` as const);
      return true;
    }
  };

  const handleAddGroupOption = () => {
    optionGroupAppend(new OptionGroupsModel());
    if (isSubmitted) {
      setError(
        `optionGroupItemList.${optionGroupFields.length}.optionGroupName`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.groupOptionName"),
          }),
        }
      );
      setError(
        `optionGroupItemList.${optionGroupFields.length}.optionItemList.0.optionName`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.optionItem.optionName"),
          }),
        }
      );
      setError(
        `optionGroupItemList.${optionGroupFields.length}.optionItemList.0.optionAmount`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.optionItem.optionAmount"),
          }),
        }
      );
    }
  };

  const isDiscountGreaterThanPrice = () => {
    const price = getValues("price");
    const discountCurrency = Number(getValues("discountCurrency")) || 0;

    if (discountCurrency > price) {
      return false;
    } else {
      return true;
    }
  };

  const handleSelectCouponType = (couponType: number) => {
    setCouponType(couponType);

    setValue("discountPercent", undefined as never);
    setValue("discountCurrency", undefined as never);
    if (couponType == DISCOUNT_TYPE.Currency) {
      clearErrors("discountPercent");
      isSubmitted &&
        setError(
          "discountCurrency",
          {
            type: "required",
            message: t("product.error.couponCurrencyRequired"),
          },
          { shouldFocus: true }
        );
    } else {
      clearErrors("discountCurrency");
      isSubmitted &&
        setError(
          "discountPercent",
          {
            type: "required",
            message: t("product.error.couponPercentRequired"),
          },
          { shouldFocus: true }
        );
    }
  };

  const onChangeSubImages = (imageList: any, addUpdateIndex: any) => {
    setSubImages(imageList);
  };

  const onChangeMainImage = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setMainImage(imageList);
  };

  const removeMainImage = () => {
    setMainImageProduct(undefined);
  };

  const handleErrorUploadImages = (error: any) => {
    if (error.maxFileSize) {
      toast.error(t("product.error.maxFileSize"));
    }
    if(error.maxNumber)
    {
      toast.error(t("product.error.maxNumber"));
    }
  };

  const handleCloseNotify = () => {
    setOpenAddModal(false);
    setOpenNotify(false);
    history.push("/products");
  };

  const handleAddProduct = async () => {
    try {
      showLoading();
      if (!isSubmit) {
        setIsSubmit(true);
        // resize file main image
        if (productAdd.mainImage && productAdd.mainImage?.length > 0) {
          try {
            const image = await resizeFile(productAdd.mainImage[0].file);

            const imageType = {
              dataURL: await toBase64(image as File),
              file: image,
            } as ImageType;

            productAdd.mainImage[0] = imageType;
          } catch (e) {
            toast.error("product.error.uploadFailure");
          }
        }

        //resize file sub image
        if (productAdd.subImage && productAdd.subImage?.length > 0) {
          try {
            const results: ImageType[] = await Promise.all(
              productAdd.subImage.map(async (item, index) => {
                const result = await resizeFile(item.file).then((v) =>
                  convertImageType(v as File)
                );
                return result;
              })
            );

            productAdd.subImage = results;
          } catch (err) {
            toast.error("product.error.uploadFailure");
          }
        }

        productAdd.mainFile = productAdd.mainImage?.map((f) => f.file as File);
        productAdd.subFiles = productAdd.subImage?.map((f) => f.file as File);

        const res = await productService.addProduct(productAdd);
        if (res) {
          hideLoading();
          setOpenAddModal(false);
          setOpenNotify(true);
        } else {
          hideLoading();
          setIsSubmit(false);
          toast.error(t("product.add.failure"));
        }
      }
    } catch (err: any) {
      hideLoading();
      setIsSubmit(false);
      if (err.errorCode == ProductStatusResponse.DuplicatedName) {
        toast.error(t("product.error.duplicateProductName"));
      } else {
        toast.error(t("product.add.failure"));
      }
    }
  };

  const onSubmit = async (data: ProductAddModel) => {
    try {
      data.categoryName =
        categoryList.find((x) => x.id === Number(data.categoryId))?.name || "";
      data.mainImage = mainImage;
      data.subImage = subImages;
      data.isNotMultipleSelection = isNotMultipleSelection;
      data.isSoldOut = isSoldOut;
      data.isMenuPublic = isMenuPublic;
      data.isDiscounted = isDiscounted;
      data.discountValue = data.isDiscounted
        ? (couponType == DISCOUNT_TYPE.Percent
          ? data.discountPercent
          : Number(data.discountCurrency))
        : 0;
      data.couponType = couponType;
      data.optionGroupItemList = data.optionGroupItemList;

      if (!isOverPrice()) {
        toast.error(t("product.error.overPrice"));
      } else {
        const isExistedProductName = await productService.isExistedProductName(
          0,
          data.productName
        );
        if (!isExistedProductName) {
          setProductAdd(data);
          setOpenAddModal(true);
        } else {
          toast.error(t("product.error.duplicateProductName"));
        }
      }
    } catch (err) {
      toast.error(t("product.add.failure"));
    }
  };

  const onChangeDiscounted = (e: any) => {
    let checked = e.target.checked;

    setValue("discountPercent", undefined as never);
    setValue("discountCurrency", undefined as never);
    setIsDiscounted(!isDiscounted);

    if (!checked) {
      if (couponType == DISCOUNT_TYPE.Percent) {
        clearErrors("discountPercent");
        unregister("discountPercent");
      } else if (couponType == DISCOUNT_TYPE.Currency) {
        clearErrors("discountCurrency");
        unregister("discountCurrency");
      }
    } else {
      if (couponType == DISCOUNT_TYPE.Percent) {
        register("discountPercent");
        isSubmitted &&
          setError(
            "discountPercent",
            {
              type: "required",
              message: t("product.error.couponPercentRequired"),
            },
            { shouldFocus: true }
          );
      } else if (couponType == DISCOUNT_TYPE.Currency) {
        register("discountCurrency");
        isSubmitted &&
          setError(
            "discountCurrency",
            {
              type: "required",
              message: t("product.error.couponCurrencyRequired"),
            },
            { shouldFocus: true }
          );
      }
    }
  };

  const getCategoryList = async () => {
    try {
      showLoading();
      let result = await masterDataService.getListCategory(true);
      if (result.length > 0) {
        result = result.filter((c) => c.id > 0);
        setCategoryList(result);
        setAddCategory(false);
        setValue("categoryId", Number(result[0]?.id));
        hideLoading();
      }
    } catch (e) {
      hideLoading();
    }
  };

  useEffect(() => {
    getCategoryList();
  }, [addCategory]);

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    };

    getCurrencyUnit();
  }, []);

  return (
    <>
      <div className={styles.form_product}>
        <HeaderContent
          title={t("product.add.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        ></HeaderContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className={styles.content_form}>
            {/* category dropdown */}
            <div className={`form-group`}>
              <p className="text_title mb_4">{t("product.category")}</p>
              <div className={styles.mt_5}>
                <select
                  {...register("categoryId", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("product." + ADD_PRODUCT_FIELDS.categoryName),
                      }),
                    },
                  })}
                  className={styles.filter}
                >
                  {categoryList != null &&
                    categoryList.map((item, i) => (
                      <option key={i} value={item.id}>
                        {t(item.name)}
                      </option>
                    ))}
                </select>
                {errors.categoryId && errors.categoryId.type === "required" && (
                  <span className={styles.validation_message}>
                    {errors.categoryId.message}
                  </span>
                )}
              </div>
              <div className={styles.add_category}>
                <button
                  type="button"
                  className={`btn_add_category ${styles.btn_add_category}`}
                  onClick={() => setOpenModal(true)}
                >
                  <img src={IconAdd} className="mr_4" />
                  {t("product.addCategory")}
                </button>
              </div>
            </div>

            <div>
              {/* product name */}
              <div className={`form-group mt_8`}>
                <p className="text_title mb_4">{t("product.productName")}</p>
                <div className={styles.mt_5}>
                  <input
                    type="text"
                    autoFocus
                    {...register("productName", {
                      required: {
                        value: true,
                        message: t("validation.required", {
                          field: t("product." + ADD_PRODUCT_FIELDS.productName),
                        }),
                      },
                      pattern: {
                        value: REGEX.SPACE,
                        message: t("validation.required", {
                          field: t("product." + ADD_PRODUCT_FIELDS.productName),
                        }),
                      },
                      maxLength: {
                        value: 50,
                        message: t("validation.maxLength", {
                          max: 50,
                          field: t("product.productName"),
                        }),
                      },
                    })}
                    className={styles.input_text}
                    placeholder={t("product.placeholderProductName")}
                    onBlur={(e: any) => {
                      setValue(
                        "productName",
                        getValues("productName") &&
                        getValues("productName").trim()
                      );
                    }}
                  />
                  {errors.productName &&
                    ["required", "pattern", "maxLength"].includes(
                      errors.productName.type
                    ) && (
                      <span className={styles.validation_message}>
                        {errors.productName.message}
                      </span>
                    )}
                </div>
              </div>

              {/* description product */}
              <div className={`form-group mt_8`}>
                <p className="text_title mb_4">{t("product.description")}</p>
                <div className={styles.mt_5}>
                  <textarea
                    rows={4}
                    {...register("description", {
                      maxLength: {
                        value: 1000,
                        message: t("validation.maxLength", {
                          max: 1000,
                          field: t("product.description"),
                        }),
                      },
                    })}
                    className={styles.input_text}
                    placeholder={t("product.placeholderdescription")}
                    onBlur={(e: any) => {
                      setValue(
                        "description",
                        getValues("description") &&
                        getValues("description")?.trim()
                      );
                    }}
                  />
                  {errors.description &&
                    ["pattern", "maxLength"].includes(
                      errors.description.type
                    ) && (
                      <span className={styles.validation_message}>
                        {errors.description.message}
                      </span>
                    )}
                </div>
              </div>

              {/* images product */}
              <div className={`form-group mt_24`}>
                <p className="text_title mb_4">{t("product.productImage")}</p>
                <div className={styles.mt_5}>
                  {/* main image */}
                  <div className="main">
                    <ImageUploading
                      value={mainImage}
                      onChange={onChangeMainImage}
                      maxNumber={1}
                      dataURLKey="data_url"
                      maxFileSize={MAX_SIZE_IMAGE}
                      onError={(er) => handleErrorUploadImages(er)}
                    >
                      {({ imageList, onImageUpload, onImageRemove }) => (
                        // write your building UI
                        <div className="upload__image-wrapper">
                          {mainImageProduct ? (
                            <div className={styles.image}>
                              <Image
                                className={styles.image_main_item}
                                src={`${Config.API_URL.GET_IMAGE}${mainImageProduct}`}
                                alt="product"
                              />
                              <div
                                className={styles.icon_close}
                                onClick={() => removeMainImage()}
                              >
                                <img src={IconClose} />
                              </div>
                            </div>
                          ) : (
                            mainImage.length < 1 && (
                              <ButtonAddImage
                                className={styles.btn_add_main}
                                handleClick={onImageUpload}
                              ></ButtonAddImage>
                            )
                          )}

                          {imageList.map((image, index) => (
                            <div key={index} className={styles.image_main_div}>
                              <img
                                style={{ height: width - 24 }}
                                src={image["data_url"]}
                                alt=""
                                className={styles.image_main_item}
                              />
                              <div
                                className={styles.icon_close}
                                onClick={() => onImageRemove(index)}
                              >
                                <img src={IconClose} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ImageUploading>
                  </div>

                  {/* sub images */}
                  <div className="sub mt_12">
                  <p>{t("product.noteSubImages")}</p>
                    <ImageUploading
                      multiple
                      value={subImages}
                      onChange={onChangeSubImages}
                      maxNumber={maxImage}
                      dataURLKey="data_url"
                      maxFileSize={MAX_SIZE_IMAGE}
                      onError={(er) => handleErrorUploadImages(er)}
                    >
                      {({
                        imageList,
                        onImageUpload,
                        onImageRemove,
                        isDragging,
                        dragProps,
                      }) => (
                        <div className={styles.image_sub_list}>
                          {imageList.map((image, index) => (
                            <div key={index} className={styles.image_sub_div}>
                              <img
                                src={image["data_url"]}
                                alt=""
                                className={styles.image_sub_item}
                              />

                              <div
                                className={styles.icon_close_sub}
                                onClick={() => onImageRemove(index)}
                              >
                                <img src={IconClose} />
                              </div>
                            </div>
                          ))}
                          {subImages.length < maxImage && (
                            <ButtonAddImage
                              className={styles.btn_add_sub}
                              handleClick={onImageUpload}
                            ></ButtonAddImage>
                          )}
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                </div>
              </div>

              {/* price */}
              <div className={`form-group mt_24`}>
                <p className="text_title mb_4">{t("product.price")}</p>
                <div className={styles.mt_5}>
                  <div className={styles.price_product}>
                    <NumberFormat
                      displayType="input"
                      {...register("price", {
                        required: {
                          value: true,
                          message: t("validation.required", {
                            field: t("product." + ADD_PRODUCT_FIELDS.price),
                          }),
                        },
                        pattern: {
                          value: REGEX.POSITIVE_INTEGER,
                          message: t("validation.inValidNumber"),
                        },
                        max: {
                          value: 99999999999,
                          message: t("validation.maxLengthForNumber", {
                            max: 11,
                            field: t("product.price"),
                          }),
                        },
                      })}
                      className={styles.input_text}
                      placeholder={"0"}
                      thousandSeparator={true}
                      allowNegative={false}
                      inputMode="decimal"
                      onValueChange={(val) => {
                        const { floatValue } = val;
                        setValue("price", floatValue as never);
                      }}
                    />
                    <p className="text_16">
                      {t("unitPrice", { unitPrice: unitPrice })}
                      {t("tax")}
                    </p>
                  </div>

                  {errors.price &&
                    ["required", "pattern", "max"].includes(
                      errors.price.type
                    ) && (
                      <span className={styles.validation_message}>
                        {errors.price.message}
                      </span>
                    )}
                </div>
              </div>

              {/* selection */}
              <div className={`form-group mt_16`}>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      {...register("isNotMultipleSelection")}
                      type="checkbox"
                      value="css"
                      checked={isNotMultipleSelection}
                      onChange={() =>
                        setIsNotMultipleSelection(!isNotMultipleSelection)
                      }
                    />
                    <span className="text_16">{t("product.notMultiple")}</span>
                  </label>
                </div>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      {...register("isSoldOut")}
                      type="checkbox"
                      name="a"
                      value="css"
                      checked={isSoldOut}
                      onChange={() => setIsSoldOut(!isSoldOut)}
                    />
                    <span className="text_16">{t("product.soldOut")}</span>
                  </label>
                </div>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      {...register("isMenuPublic")}
                      type="checkbox"
                      name="a"
                      value="css"
                      checked={isMenuPublic}
                      onChange={() => setIsMenuPublic(!isMenuPublic)}
                    />
                    <span className="text_16">{t("product.menuRelease")}</span>
                  </label>
                </div>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      {...register("isDiscounted")}
                      type="checkbox"
                      name="a"
                      value="css"
                      defaultChecked={isDiscounted}
                      onChange={(e) => onChangeDiscounted(e)}
                    />
                    <span className="text_16">
                      {t("product.productDiscount")}
                    </span>
                  </label>
                </div>
                <div>
                  <div className={styles.group_discount}>
                    <div className={styles.discount}>
                      {couponType === DISCOUNT_TYPE.Currency ? (
                        <Controller
                          control={control}
                          name="discountCurrency"
                          rules={
                            isDiscounted
                              ? {
                                required: {
                                  value: isDiscounted,
                                  message: t(
                                    "product.error.couponCurrencyRequired"
                                  ),
                                },
                                pattern: {
                                  value: REGEX.POSITIVE_INTEGER,
                                  message: t("validation.inValidNumber"),
                                },
                                max: {
                                  value: 99999999999,
                                  message: t(
                                    "validation.maxLengthForNumber",
                                    {
                                      max: 11,
                                      field: t("product.couponCurrency"),
                                    }
                                  ),
                                },
                                validate: isDiscountGreaterThanPrice,
                              }
                              : undefined
                          }
                          render={({ field }) => (
                            <NumberFormat
                              disabled={!isDiscounted}
                              displayType="input"
                              {...register("discountCurrency")}
                              className={styles.input_text}
                              placeholder={"0"}
                              thousandSeparator={true}
                              allowNegative={false}
                              inputMode="decimal"
                              value={
                                field.value === undefined ? "" : field.value
                              }
                              onValueChange={(val) => {
                                const { floatValue } = val;
                                setValue(
                                  "discountCurrency",
                                  floatValue as never
                                );
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          control={control}
                          name="discountPercent"
                          rules={
                            isDiscounted
                              ? {
                                required: {
                                  value: isDiscounted,
                                  message: t(
                                    "product.error.couponPercentRequired"
                                  ),
                                },
                                pattern: {
                                  value: REGEX.POSITIVE_DECIMAL,
                                  message: t("validation.inValidNumber"),
                                },
                                max: {
                                  value: 100,
                                  message: t(
                                    "product.error.greaterThan100Percent"
                                  ),
                                },
                              }
                              : undefined
                          }
                          render={({ field }) => (
                            <NumberFormat
                              disabled={!isDiscounted}
                              displayType="input"
                              {...register("discountPercent")}
                              className={styles.input_text}
                              placeholder={"0"}
                              thousandSeparator={true}
                              allowNegative={false}
                              inputMode="decimal"
                              value={
                                field.value === undefined ? "" : field.value
                              }
                              onValueChange={(val) => {
                                const { floatValue } = val;
                                setValue(
                                  "discountPercent",
                                  floatValue as never
                                );
                              }}
                            />
                          )}
                        />
                      )}
                    </div>
                    <div className={styles.type_discount}>
                      <select
                        disabled={!isDiscounted}
                        onChange={(e) =>
                          handleSelectCouponType(Number(e.target.value))
                        }
                        className={styles.filter}
                      >
                        {DiscountTypeList != null &&
                          DiscountTypeList.map((item, i) => (
                            <option key={i} value={item.key}>
                              {t(item.value, { unitPrice: unitPrice })}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  {couponType === DISCOUNT_TYPE.Currency
                    ? errors.discountCurrency &&
                    ["required", "pattern", "maxLength", "validate"].includes(
                      errors.discountCurrency.type
                    ) && (
                      <span className={styles.validation_message}>
                        {errors.discountCurrency.type !== "validate"
                          ? errors.discountCurrency.message
                          : t("product.error.greaterThanPrice")}
                      </span>
                    )
                    : errors.discountPercent &&
                    ["required", "pattern", "max"].includes(
                      errors.discountPercent.type
                    ) && (
                      <span className={styles.validation_message}>
                        {errors.discountPercent.message}
                      </span>
                    )}
                </div>
              </div>

              {/* setting optional */}
              <div className={styles.setting_optional}>
                <p className="text_title mb_8">
                  {t("product.settingOptionalTitle")}
                </p>

                {/* option groups */}
                {optionGroupFields.map((row, index) => {
                  return (
                    <div
                      key={row._id}
                      className={`${styles.option_groups} ${index > 0 ? styles.separate : ""
                        }`}
                    >
                      <p className="mb_4">
                        {t("product.settingOptional.groups.groupNameTitle")}
                      </p>
                      <input
                        type="text"
                        className={styles.input_text}
                        placeholder={t(
                          "product.settingOptional.groups.placeholderGroupOptionName"
                        )}
                        {...register(
                          `optionGroupItemList.${index}.optionGroupName` as const,
                          {
                            required: {
                              value: true,
                              message: t("validation.required", {
                                field: t(
                                  "product.settingOptional.groups.groupOptionName"
                                ),
                              }),
                            },
                            maxLength: {
                              value: 256,
                              message: t("validation.maxLength", {
                                max: 256,
                                field: t(
                                  "product.settingOptional.groups.groupOptionName"
                                ),
                              }),
                            },
                            pattern: {
                              value: REGEX.SPACE,
                              message: t("validation.required", {
                                field: t(
                                  "product.settingOptional.groups.groupOptionName"
                                ),
                              }),
                            },
                            validate: (v) =>
                              IsDuplicatedGroupOptionName(index, v),
                          }
                        )}
                        onBlur={(e: any) => {
                          setValue(
                            `optionGroupItemList.${index}.optionGroupName`,
                            getValues(
                              `optionGroupItemList.${index}.optionGroupName`
                            ) &&
                            getValues(
                              `optionGroupItemList.${index}.optionGroupName`
                            )?.trim()
                          );
                        }}
                      />
                      {errors?.optionGroupItemList &&
                        [
                          "required",
                          "pattern",
                          "maxLength",
                          "validate",
                        ].includes(
                          errors?.optionGroupItemList[index]?.optionGroupName
                            ?.type || ""
                        ) && (
                          <span className={styles.validation_message}>
                            {errors?.optionGroupItemList[index]?.optionGroupName
                              ?.type !== "validate"
                              ? errors?.optionGroupItemList[index]
                                ?.optionGroupName?.message
                              : t(
                                "product.settingOptional.groups.errors.duplicatedGroupOptionName"
                              )}
                          </span>
                        )}

                      {/* is required */}
                      <div className={styles.is_required}>
                        <p>
                          {t("product.settingOptional.groups.isRequiredTitle")}
                        </p>
                        <div className={`form-group ${styles.radio_required}`}>
                          <label className="mr_32">
                            <input
                              {...register(
                                `optionGroupItemList.${index}.isRequired`
                              )}
                              type="radio"
                              value="true"
                              defaultChecked={true}
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.required")}
                            </span>
                          </label>
                          <label>
                            <input
                              {...register(
                                `optionGroupItemList.${index}.isRequired`
                              )}
                              type="radio"
                              value="false"
                              defaultChecked={false}
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.optional")}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* optional type */}
                      <div className={styles.option_type}>
                        <p>
                          {t("product.settingOptional.groups.optionTypeTitle")}
                        </p>
                        <div className={`form-group ${styles.radio_required}`}>
                          <label className="mr_32">
                            <input
                              {...register(
                                `optionGroupItemList.${index}.optionType`
                              )}
                              type="radio"
                              value={1}
                              defaultChecked={true}
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.radioType")}
                            </span>
                          </label>
                          <label>
                            <input
                              {...register(
                                `optionGroupItemList.${index}.optionType`
                              )}
                              type="radio"
                              value={2}
                              defaultChecked={false}
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.checkboxType")}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* add options */}
                      <OptionItems
                        isDiscounted={isDiscounted}
                        couponType={couponType}
                        nestIndex={index}
                        unitPrice={unitPrice}
                        {...{
                          control,
                          register,
                          errors,
                          setValue,
                          getValues,
                          clearErrors,
                          isSubmitted,
                          setError,
                        }}
                      />

                      <button
                        className={`btn_white ${styles.button_remove_opt}`}
                        onClick={() => optionGroupRemove(index)}
                      >
                        {t("product.settingOptional.removeOptionButton")}
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  className={`btn_sub ${styles.button_add_group}`}
                  onClick={() => handleAddGroupOption()}
                >
                  {t("product.settingOptional.addGroupOptionButton")}
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.form_group} ${styles.form_button}`}>
            <button
              type="submit"
              className={`btn_main`}
              disabled={Array.isArray(errors) || Object.values(errors).toString() != ""}
            >
              {t("product.add.buttonAdd")}
            </button>
          </div>
        </form>
        {openModal && (
          <AddCategoryModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            handleChange={() => setAddCategory(true)}
          />
        )}
        {openAddModal && (
          <ProductModal
            open={openAddModal}
            productAdd={productAdd}
            isAdd={true}
            title={t("product.add.confirm.title")}
            textButton={t("product.add.confirm.buttonAdd")}
            handleEventProduct={handleAddProduct}
            handleCloseModal={() => [
              setOpenAddModal(false),
              setIsSubmit(false),
            ]}
            unitPrice={unitPrice}
          ></ProductModal>
        )}
        {openNotify && (
          <NotifyModal
            open={openNotify}
            message={t("product.add.success", {
              field: productAdd.productName,
            })}
            title={t("product.add.titleSuccess")}
            textButton={t("close")}
            handleCloseModal={handleCloseNotify}
          ></NotifyModal>
        )}
      </div>
    </>
  );
};

export default AddProduct;
