import HeaderContent from "components/commons/header-content";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { productService } from "services/product.service";
import styles from "./index.module.scss";
import IconAdd from "assets/images/icon_add.svg";
import IconClose from "assets/images/icon_close.svg";
import { useHistory } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ProductDetailResult } from "types/results/product/product-detail.result";
import { ProductEditModel } from "types/models/product/product-edit.model";
import { toast } from "react-toastify";
import {
  DISCOUNT_TYPE,
  DiscountTypeList,
  REGEX,
  OPTION_TYPE,
  PRODUCT,
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
import NotifyModal from "components/modals/notify";
import OptionItems from "../edit/option-item/";
import { ProductOptionGroupModel } from "types/models/product/edit/product-option-group.model";
import NumberFormat from "react-number-format";
import { tokenHelper } from "utils/store-token";
import { convertImageType, resizeFile, toBase64 } from "utils/resize-img";
import { useLoadingContext } from "context/loading";

interface ProductEditParams {
  id: number;
}

const EDIT_PRODUCT_FIELDS = {
  id: "id",
  categoryId: "categoryId",
  categoryName: "category",
  productName: "productName",
  isNotMultipleSelection: "isNotMultipleSelection",
  isSoldOut: "isSoldOut",
  isMenuPublic: "isMenuPublic",
  isDiscounted: "isDiscounted",
  price: "price",
  discount: "discount",
  discountType: "discountType",
  mainImage: "mainImage",
  subImage: "subImage",
  description: "description",
};

const EditProduct: React.FC = (props: any) => {
  const params = useParams();
  const { id } = params as ProductEditParams;
  const { t } = useTranslation();
  const history = useHistory();
  const [isSubmit, setIsSubmit] = useState(false);
  const { showLoading, hideLoading } = useLoadingContext();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isDirty, isSubmitted },
    setValue,
    getValues,
    clearErrors,
    setError,
    unregister,
  } = useForm<ProductEditModel>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const {
    fields: optionGroupFields,
    append: optionGroupAppend,
    remove: optionGroupRemove,
  } = useFieldArray({
    name: "listProductOptionGroup",
    control,
    keyName: "_id",
  });

  const [product, setProduct] = useState<ProductDetailResult>();
  const [categoryList, setCategoryList] = useState<CategoryResult[]>([]);
  const [productEdit, setProductEdit] = useState<ProductEditModel>(
    {} as ProductEditModel
  );
  const [openModal, setOpenModal] = useState(false);
  const [changeCategory, setChangeCategory] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);

  const [categoryId, setCategoryId] = useState(0);
  const [discountType, setDiscountType] = useState(0);

  const [mainImageProduct, setMainImageProduct] = useState<string>();
  const [subImageProduct, setSubImageProduct] = useState<string[]>([]);
  const [imageDeleteList, setiImageDeleteList] = useState<string[]>([]);
  const [isNotMultipleSelection, setIsNotMultipleSelection] = useState<
    boolean | undefined
  >(false);
  const [isSoldOut, setIsSoldOut] = useState<boolean | undefined>(false);
  const [isMenuPublic, setIsMenuPublic] = useState<boolean | undefined>(false);
  const [isDiscount, setIsDiscount] = useState<boolean>(false);

  const [mainImage, setMainImage] = useState<ImageType[]>([]);
  const [subImages, setSubImages] = useState<ImageType[]>([]);
  const maxImage = 9;
  const width = window.innerWidth;
  const [unitPrice, setUnitPrice] = useState<string>();

  const onChangeSubImages = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setSubImages(imageList);
  };

  const onChangeMainImage = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setMainImage(imageList);
  };

  const removeMainImage = () => {
    setMainImageProduct(undefined);
    let listDel = imageDeleteList;
    mainImageProduct && listDel.push(mainImageProduct);
    setiImageDeleteList(listDel);
  };

  const removeSubImage = (index: number, image: string) => {
    let subImageList = [...subImageProduct];
    subImageList.splice(index, 1);
    setSubImageProduct(subImageList);
    let listDel = imageDeleteList;
    listDel.push(image);
    setiImageDeleteList(listDel);
  };

  const getProductDetail = async (productId: number) => {
    productService
      .getProductDetail(productId)
      .then((result) => {
        hideLoading();
        result.listProductOptionGroup.map((item, index) => {
          return optionGroupAppend(item);
        });

        setProduct(result);
        setMainImageProduct(result.productImage);
        setSubImageProduct(result.productSubImages);
        setIsNotMultipleSelection(result.isNotMultipleSelection);
        setIsSoldOut(result.isSoldOut);
        setIsMenuPublic(result.isMenuPublic);
        setIsDiscount(result?.isDiscounted);
        setCategoryId(result.categoryId);
        setDiscountType(result.discountType);
        result.discountType == DISCOUNT_TYPE.Currency &&
          setValue("discountCurrency", result.discount);
        result.discountType == DISCOUNT_TYPE.Percent &&
          setValue("discountPercent", result.discount);

        setValue("categoryId", result.categoryId);
        setValue("productName", result.productName);
        setValue("price", result.price);
        setValue("description", result.description);
        //reset(result);
      })
      .catch((err) => {
        hideLoading();
      });
  };

  const IsDuplicatedGroupOptionName = (index: number, name: string) => {
    const listGroupOption = getValues("listProductOptionGroup");
    const filteredItems = listGroupOption
      .slice(0, index)
      .concat(listGroupOption.slice(index + 1, listGroupOption.length));

    const uniqueSeat = filteredItems.some(
      (x: ProductOptionGroupModel) =>
        x.name.trim().toLowerCase() == name.trim().toLowerCase()
    );

    if (uniqueSeat) {
      return false;
    } else {
      clearErrors(`listProductOptionGroup.${index}.name` as const);
      return true;
    }
  };

  const isOverPrice = () => {
    const price = getValues("price");
    const discountPercent = getValues("discountPercent") || 0;
    const discountCurrency = getValues("discountCurrency") || 0;
    let total = 0;

    const optionGroupItemList = getValues(`listProductOptionGroup`);
    for (let i = 0; i < optionGroupItemList.length; i++) {
      let optionItemList = optionGroupItemList[i].listProductOption;

      let sumOptionItemList = optionItemList.reduce(
        (prev: number, cur: any) => parseInt(cur.optionAmount) + prev,
        0
      );

      total += sumOptionItemList;
    }

    if (isDiscount) {
      if (discountType == DISCOUNT_TYPE.Percent) {
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

  const isDiscountGreaterThanPrice = () => {
    const price = getValues("price");
    const discountCurrency = Number(getValues("discountCurrency")) || 0;

    if (discountCurrency > price) {
      return false;
    } else {
      clearErrors("discountCurrency");
      return true;
    }
  };

  const handleSelectCouponType = (discountType: number) => {
    setDiscountType(discountType);
    setValue("discountPercent", undefined as never);
    setValue("discountCurrency", undefined as never);

    if (discountType == DISCOUNT_TYPE.Currency) {
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

  const getCategoryList = async () => {
    try {
      const result = await masterDataService.getListCategory(true);
      setCategoryList(result.filter((x) => x.id > 0));
      setChangeCategory(false);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const productModal = {
        id: id,
        categoryId: categoryId,
        categoryName:
          categoryList.find((x) => x.id === Number(data.categoryId))?.name ||
          "",
        productName: data.productName.trim(),
        isNotMultipleSelection: isNotMultipleSelection,
        isSoldOut: isSoldOut,
        isMenuPublic: isMenuPublic,
        isDiscounted: isDiscount,
        price: data.price,
        discount:
          discountType == DISCOUNT_TYPE.Percent
            ? data.discountPercent
            : data.discountCurrency,
        couponType: discountType,
        mainImage: mainImage,
        subImage: subImages,
        mainImageOld: mainImageProduct,
        subImageOld: subImageProduct,
        imageDeleteList: imageDeleteList,
        listProductOptionGroup: data.listProductOptionGroup,
        description: data.description,
      } as ProductEditModel;

      if (!isOverPrice()) {
        toast.error(t("product.error.overPrice"));
      } else {
        const isExistedProductName = await productService.isExistedProductName(
          productModal.id,
          productModal.productName
        );
        if (!isExistedProductName) {
          setProductEdit(productModal);
          setOpenEditModal(true);
        } else {
          toast.error(t("product.error.duplicateProductName"));
        }
      }
    } catch (error) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const handleEditProduct = async (model: ProductEditModel) => {
    try {
      showLoading();
      if (!isSubmit) {
        setIsSubmit(true);
        // resize file main image
        if (productEdit.mainImage && productEdit.mainImage?.length > 0) {
          try {
            const image = await resizeFile(productEdit.mainImage[0].file);

            const imageType = {
              dataURL: await toBase64(image as File),
              file: image,
            } as ImageType;

            productEdit.mainImage[0] = imageType;
          } catch (e) {
            toast.error("product.error.uploadFailure");
          }
        }

        //resize file sub image
        if (productEdit.subImage && productEdit.subImage?.length > 0) {
          try {
            const results: ImageType[] = await Promise.all(
              productEdit.subImage.map(async (item, index) => {
                const result = await resizeFile(item.file).then((v) =>
                  convertImageType(v as File)
                );
                return result;
              })
            );

            productEdit.subImage = results;
          } catch (err) {
            toast.error("product.error.uploadFailure");
          }
        }

        productEdit.mainFile = productEdit.mainImage?.map(
          (data) => data.file as File
        );
        productEdit.subFiles = productEdit.subImage?.map(
          (data) => data.file as File
        );

        const result =
          productEdit && (await productService.editProduct(productEdit));

        hideLoading();
        if (result) {
          setOpenNotify(true);
        }
        setIsSubmit(false);
      }
    } catch (error) {
      hideLoading();
      setIsSubmit(false);
      toast.error(t("validation.errorMessage"));
    }
  };

  const handleCloseNotify = () => {
    setOpenNotify(false);
    history.push(`/product/${id}`);
  };

  const handleAddGroupOption = () => {
    optionGroupAppend(new ProductOptionGroupModel());
    if (isSubmitted) {
      setError(`listProductOptionGroup.${optionGroupFields.length}.name`, {
        type: "required",
        message: t("validation.required", {
          field: t("product.settingOptional.groups.groupOptionName"),
        }),
      });
      setError(
        `listProductOptionGroup.${optionGroupFields.length}.listProductOption.0.name`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.optionItem.optionName"),
          }),
        }
      );
      setError(
        `listProductOptionGroup.${optionGroupFields.length}.listProductOption.0.optionAmount`,
        {
          type: "required",
          message: t("validation.required", {
            field: t("product.settingOptional.groups.optionItem.optionAmount"),
          }),
        }
      );
    }
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

  const onChangeDiscounted = (e: any) => {
    let checked = e.target.checked;
    setValue("discountPercent", undefined as never);
    setValue("discountCurrency", undefined as never);
    setIsDiscount(!isDiscount);

    if (!checked) {
      if (discountType == DISCOUNT_TYPE.Percent) {
        clearErrors("discountPercent");
        unregister("discountPercent");
      } else if (discountType == DISCOUNT_TYPE.Currency) {
        clearErrors("discountCurrency");
        unregister("discountCurrency");
      }
    } else {
      if (discountType == DISCOUNT_TYPE.Percent) {
        register("discountPercent");
        isSubmitted &&
          setError("discountPercent", {
            type: "required",
            message: t("product.error.couponPercentRequired"),
          });
      } else if (discountType == DISCOUNT_TYPE.Currency) {
        register("discountCurrency");
        isSubmitted &&
          setError("discountCurrency", {
            type: "required",
            message: t("product.error.couponCurrencyRequired"),
          });
      }
    }
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    };

    getCurrencyUnit();
    getProductDetail(id);
    getCategoryList();
  }, []);

  useEffect(() => {
    showLoading();
    getCategoryList();
  }, [changeCategory]);

  return (
    <>
      <div className={styles.form_edit_product}>
        <HeaderContent
          title={t("product.edit.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        ></HeaderContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content_form}>
            <div className={`form-group`}>
              <p className="text_title">{t("product.category")}</p>
              <div className={styles.mt_5}>
                <select
                  {...register("categoryId", {
                    required: {
                      value: true,
                      message: t("validation.required", {
                        field: t("product." + EDIT_PRODUCT_FIELDS.categoryName),
                      }),
                    },
                  })}
                  className={styles.filter}
                  onChange={(e: any) => setCategoryId(e.target.value)}
                  value={categoryId}
                  defaultValue={product?.categoryId}
                >
                  {categoryList != null &&
                    categoryList.map((item, i) => (
                      <option
                        key={i}
                        value={item.id}
                      >
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
              <div className={`form-group mt_8`}>
                <p className="text_title">{t("product.productName")}</p>
                <div className={styles.mt_5}>
                  <input
                    type="text"
                    autoFocus
                    {...register("productName", {
                      required: {
                        value: true,
                        message: t("validation.required", {
                          field: t(
                            "product." + EDIT_PRODUCT_FIELDS.productName
                          ),
                        }),
                      },
                      pattern: {
                        value: REGEX.SPACE,
                        message: t("validation.required", {
                          field: t(
                            "product." + EDIT_PRODUCT_FIELDS.productName
                          ),
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
                    defaultValue={product?.productName}
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
              <div className={`form-group mt_24`}>
                <p className="text_title">{t("product.description")}</p>
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
              <div className={`form-group mt_24`}>
                <p className="text_title mb_16">{t("product.productImage")}</p>
                <div className={styles.mt_5}>
                  <div className="main">
                    <ImageUploading
                      multiple
                      value={mainImage}
                      onChange={onChangeMainImage}
                      maxNumber={1}
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
                        // write your building UI
                        <div className="upload__image-wrapper">
                          {mainImageProduct ? (
                            <div className={styles.image}>
                              <Image
                                styleCustom={{ height: width - 24 }}
                                className={styles.image_main_item}
                                src={`${Config.API_URL.GET_IMAGE}${mainImageProduct}`}
                                alt="qrcode"
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
                          {subImageProduct.map((image, index) => {
                            return (
                              <div className={styles.image_sub} key={index}>
                                <Image
                                  className={styles.image_sub_item}
                                  src={`${Config.API_URL.GET_IMAGE}${image}`}
                                  alt="qrcode"
                                />
                                <div
                                  className={styles.icon_close_sub}
                                  onClick={() => removeSubImage(index, image)}
                                >
                                  <img src={IconClose} />
                                </div>
                              </div>
                            );
                          })}
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
                          {subImages.length <
                            maxImage - subImageProduct.length && (
                              <div className="mr_12">
                                <ButtonAddImage
                                  className={styles.btn_add_sub}
                                  handleClick={onImageUpload}
                                ></ButtonAddImage>
                              </div>
                            )}
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                </div>
              </div>
              <div className={`form-group mt_24`}>
                <p className="text_title">{t("product.price")}</p>
                <div className={styles.mt_5}>
                  <div className={styles.price_product}>
                    <div>
                      <Controller
                        control={control}
                        name="price"
                        rules={{
                          required: {
                            value: true,
                            message: t("validation.required", {
                              field: t("product." + EDIT_PRODUCT_FIELDS.price),
                            }),
                          },
                          max: {
                            value: 99999999999,
                            message: t("validation.maxLengthForNumber", {
                              max: 11,
                              field: t("product." + EDIT_PRODUCT_FIELDS.price),
                            }),
                          },
                          pattern: {
                            value: REGEX.POSITIVE_INTEGER,
                            message: t("validation.inValidNumber"),
                          },
                        }}
                        render={({ field }) => (
                          <NumberFormat
                            {...register("price")}
                            className={styles.input_text}
                            displayType="input"
                            placeholder="0"
                            thousandSeparator={true}
                            allowNegative={false}
                            value={field.value}
                            inputMode="decimal"
                            onValueChange={(val) => {
                              const { floatValue } = val;
                              setValue(`price`, floatValue as never);
                            }}
                          />
                        )}
                      />
                    </div>
                    <p className="text_small ml_8">
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
              <div className={`form-group mt_16`}>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      type="checkbox"
                      value="css"
                      checked={isNotMultipleSelection}
                      onChange={() =>
                        setIsNotMultipleSelection(!isNotMultipleSelection)
                      }
                    />
                    <span className={styles.text_checkbox}>
                      {t("product.notMultiple")}
                    </span>
                  </label>
                </div>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      type="checkbox"
                      name="a"
                      value="css"
                      checked={isSoldOut}
                      onChange={() => setIsSoldOut(!isSoldOut)}
                    />
                    <span className={styles.text_checkbox}>
                      {t("product.soldOut")}
                    </span>
                  </label>
                </div>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      type="checkbox"
                      name="a"
                      value="css"
                      checked={isMenuPublic}
                      onChange={() => setIsMenuPublic(!isMenuPublic)}
                    />
                    <span className={styles.text_checkbox}>
                      {t("product.menuRelease")}
                    </span>
                  </label>
                </div>
                <div className={styles.option_product}>
                  <label className={styles.mr_24}>
                    <input
                      type="checkbox"
                      name="a"
                      checked={isDiscount}
                      defaultChecked={product?.isDiscounted}
                      onChange={(e) => onChangeDiscounted(e)}
                    />
                    <span className={styles.text_checkbox}>
                      {t("product.productDiscount")}
                    </span>
                  </label>
                </div>
                <div>
                  <div className={styles.group_discount}>
                    <div className={styles.discount}>
                      {discountType === DISCOUNT_TYPE.Currency ? (
                        <Controller
                          control={control}
                          name="discountCurrency"
                          defaultValue={product?.discount}
                          rules={
                            isDiscount
                              ? {
                                required: {
                                  value: isDiscount,
                                  message: t("validation.required", {
                                    field: t("product.couponCurrency"),
                                  }),
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
                                pattern: {
                                  value: REGEX.POSITIVE_INTEGER,
                                  message: t("validation.inValidNumber"),
                                },
                                validate: isDiscountGreaterThanPrice,
                              }
                              : undefined
                          }
                          render={({ field }) => (
                            <NumberFormat
                              disabled={!isDiscount}
                              {...register("discountCurrency")}
                              className={styles.input_text}
                              displayType="input"
                              placeholder="0"
                              thousandSeparator={true}
                              allowNegative={false}
                              inputMode="decimal"
                              value={
                                field.value === undefined
                                  ? ""
                                  : field.value
                              }
                              onValueChange={(val) => {
                                const { floatValue } = val;
                                setValue(
                                  `discountCurrency`,
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
                          defaultValue={product?.discount}
                          rules={
                            isDiscount
                              ? {
                                required: {
                                  value: isDiscount,
                                  message: t("validation.required", {
                                    field: t("product.couponPercent"),
                                  }),
                                },
                                max: {
                                  value: 100,
                                  message: t(
                                    "product.error.greaterThan100Percent"
                                  ),
                                },
                                pattern: {
                                  value: REGEX.POSITIVE_DECIMAL,
                                  message: t("validation.inValidNumber"),
                                },
                              }
                              : undefined
                          }
                          render={({ field }) => (
                            <NumberFormat
                              disabled={!isDiscount}
                              {...register("discountPercent")}
                              className={styles.input_text}
                              displayType="input"
                              placeholder="0"
                              thousandSeparator={true}
                              allowNegative={false}
                              inputMode="decimal"
                              value={
                                field.value === undefined
                                  ? ""
                                  : field.value
                              }
                              onValueChange={(val) => {
                                const { floatValue } = val;
                                setValue(
                                  `discountPercent`,
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
                        disabled={!isDiscount}
                        onChange={(e) =>
                          handleSelectCouponType(Number(e.target.value))
                        }
                        className={styles.filter}
                        value={discountType}
                        defaultValue={product?.discountType}
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
                  {discountType === DISCOUNT_TYPE.Currency
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

              {/* setting group */}
              <div className={styles.setting_optional}>
                <p className="text_title mb_8">
                  {t("product.settingOptionalTitle")}
                </p>

                {/* option group */}
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
                        defaultValue={row.name}
                        {...register(
                          `listProductOptionGroup.${index}.name` as const,
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
                            `listProductOptionGroup.${index}.name`,
                            getValues(`listProductOptionGroup.${index}.name`) &&
                            getValues(
                              `listProductOptionGroup.${index}.name`
                            )?.trim()
                          );
                        }}
                      />
                      {errors?.listProductOptionGroup &&
                        [
                          "required",
                          "pattern",
                          "maxLength",
                          "validate",
                        ].includes(
                          errors?.listProductOptionGroup[index]?.name?.type ||
                          ""
                        ) && (
                          <span className={styles.validation_message}>
                            {errors?.listProductOptionGroup[index]?.name
                              ?.type !== "validate"
                              ? errors?.listProductOptionGroup[index]?.name
                                ?.message
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
                                `listProductOptionGroup.${index}.isRequired`
                              )}
                              type="radio"
                              value="true"
                              defaultChecked={row.isRequired === true}
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.required")}
                            </span>
                          </label>
                          <label>
                            <input
                              {...register(
                                `listProductOptionGroup.${index}.isRequired`
                              )}
                              type="radio"
                              value="false"
                              defaultChecked={row.isRequired === false}
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
                                `listProductOptionGroup.${index}.optionType`
                              )}
                              type="radio"
                              value={1}
                              defaultChecked={
                                row.optionType == OPTION_TYPE.PickOne
                              }
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.radioType")}
                            </span>
                          </label>
                          <label>
                            <input
                              {...register(
                                `listProductOptionGroup.${index}.optionType`
                              )}
                              type="radio"
                              value={2}
                              defaultChecked={
                                row.optionType === OPTION_TYPE.PickMultiple
                              }
                            />
                            <span className={styles.text_radio}>
                              {t("product.settingOptional.groups.checkboxType")}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* add options */}
                      <OptionItems
                        isDiscounted={isDiscount}
                        couponType={discountType}
                        nestIndex={index}
                        control={control}
                        reset={reset}
                        unitPrice={unitPrice}
                        {...{
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
              {t("product.edit.buttonUpdate")}
            </button>
          </div>
        </form>
        {openModal && (
          <AddCategoryModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            handleChange={() => setChangeCategory(true)}
          />
        )}
        {openEditModal && (
          <ProductModal
            open={openEditModal}
            productEdit={productEdit}
            isAdd={false}
            title={t("product.edit.confirm.title")}
            textButton={t("product.edit.confirm.buttonEdit")}
            handleEventProduct={handleEditProduct}
            handleCloseModal={() => setOpenEditModal(false)}
            unitPrice={unitPrice}
          ></ProductModal>
        )}
        {openNotify && (
          <NotifyModal
            open={openNotify}
            message={t("product.edit.confirm.notifySuccess")}
            title={t("product.edit.confirm.titleSuccess")}
            textButton={t("close")}
            handleCloseModal={handleCloseNotify}
          ></NotifyModal>
        )}
      </div>
    </>
  );
};

export default EditProduct;
