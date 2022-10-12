import HeaderContent from 'components/commons/header-content';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "./index.module.scss";
import IconClose from "assets/images/icon_close.svg";
import ButtonAddImage from 'components/commons/button-add-image';
import ImageUploading, { ImageType } from "react-images-uploading";
import Image from "components/commons/image";
import Config from 'config';
import { toast } from 'react-toastify';
import { NotificationEditUserModel } from 'types/models/notification/notification-edit-user.model';
import { Controller, useForm } from 'react-hook-form';
import { MAX_SIZE_IMAGE, REGEX } from 'utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { notificationService } from 'services/notification.service';
import NotifyModal from 'components/modals/notify';
import { useHistory, useParams } from 'react-router';
import moment from 'moment';
import { useLoadingContext } from "context/loading";
import { resizeFile } from "utils/resize-img";

interface NotificationUserParams {
  notificationId: number;
}

const EditNotificationUser = () => {
  const { t } = useTranslation();

  const params = useParams();
  const { notificationId } = params as NotificationUserParams;
  
  const [image, setImage] = useState<ImageType[]>([]);
  const [defaultImage, setDefaultImage] = useState<string>();
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const width = window.innerWidth;
  const [isSubmit, setIsSubmit] = useState(false);
  const history = useHistory();
  const [openNotify, setOpenNotify] = useState(false);
  const [hasDeleteImg, setHasDeleteImg] = useState<boolean>(false);
  const { showLoading, hideLoading } = useLoadingContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitted },
    setValue,
    control,
    getValues,
    setError,
    clearErrors
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onChangeImage = async (imageList: any, addUpdateIndex: any) => {
    // data for submit
    // resize file image
    if (imageList && imageList.length > 0) {
      try {
        const image = await resizeFile(imageList[0].file) as File;
        imageList[0].file = image;
      } catch (e) {
        toast.error("product.error.uploadFailure");
      }
    }
    setImage(imageList);
  };

  const removeImage = () => {
    setDefaultImage(undefined);
    setHasDeleteImg(true);
  };

  const handleErrorUploadImages = (error: any) => {
    if (error.maxFileSize) {
      toast.error(t("product.error.maxFileSize"));
    }
  };

  const validationDate = () => {
    let validation = true;
    let startDate = getValues("startDate");
    let endDate = getValues("endDate");
    if (endDate != undefined) {
      if (startDate > endDate) {
        validation = false;
        setError("endDate", { type: "validate" });
      } else {
        clearErrors("endDate");
      }
    }
    return validation;
  };

  const formatInput = (event: any) => {
    const attribute = event.target.getAttribute('name');
    setValue(attribute, event.target.value.trim());
  }

  const handleCloseNotify = () => {
    setOpenNotify(false);
    history.push("/notifications");
  };

  const onSubmit = async (data: any) => {
    try {
      showLoading();
      if (!isSubmit) {
        setIsSubmit(true);
        const model = {
          id: notificationId,
          title: data.title,
          label: data.label,
          content: data.content,
          file: image.map((f) => f.file as File),
          startDate: moment(data.startDate).format("yyyy/MM/DD"),
          endDate: moment(data.endDate).format("yyyy/MM/DD"),
          hasDeleteImg: hasDeleteImg
        } as NotificationEditUserModel;
        
        await notificationService.editNotificationUser(model);
        hideLoading();
        setOpenNotify(true);
        setIsSubmit(false);
      }
    }
    catch (err) {
      hideLoading();
      setIsSubmit(false);
      toast.error(t("notificationUser.edit.failure"));
    }
  }

  useEffect(() => {
    const getHeight = () => {
      if (elementRef && elementRef.current && elementRef.current.clientHeight) {
        setHeightBtn(elementRef?.current?.clientHeight + 28);
      }
    }
    
    getHeight();
  }, []);

  useEffect(() => {
    showLoading();
    const getNotificationUserById = async () => {
      try {
        const result = await notificationService.getNotificationUserById(notificationId);
        setValue("title",result.title);
        setDefaultImage(result.fileName);
        setValue("label", result.label);
        setValue("content", result.content);
        setValue("startDate",result.startDate);
        setValue("endDate",result.endDate);
        hideLoading();
      }
      catch (err) {
        hideLoading();
      }
    }

    getNotificationUserById();
  }, [notificationId]);

  return (
    <div className={styles.add_notification}>
      <HeaderContent
        title={t("notificationUser.edit.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.push("/notifications")}
      />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={styles.form_add}>
          {/* title */}
          <div className="form-group">
            <p className="text_title mb_4">{t("notificationUser.edit.notificationTitle")}</p>
            <input
              type="text"
              autoFocus
              className={styles.input_text}
              placeholder={t("notificationUser.edit.placeholderTitle")}
              autoComplete="off"
              {...register("title", {
                required: {
                  value: true,
                  message: t("validation.required", {
                    field: t("notificationUser.edit.notificationTitle"),
                  }),
                },
                pattern: {
                  value: REGEX.SPACE,
                  message: t("validation.required", {
                    field: t("notificationUser.edit.notificationTitle"),
                  }),
                },
                maxLength: {
                  value: 200,
                  message: t("validation.maxLength", {
                    max: 200,
                    field: t("notificationUser.edit.notificationTitle"),
                  }),
                },
              })}
              onBlur={formatInput}
            />
            {errors.title && 
            ["required", "pattern", "maxLength"].includes(errors.title.type) && (
              <span className="validation_message">
                {errors.title.message}
              </span>
            )}
          </div>
          {/* label */}
          <div className="form-group mt_24">
            <p className="text_title mb_4">{t("notificationUser.edit.label")}</p>
            <input
              type="text"
              className={styles.input_text}
              placeholder={t("notificationUser.edit.placeholderLabel")}
              autoComplete="off"
              {...register("label", {
                required: {
                  value: true,
                  message: t("validation.required", {
                    field: t("notificationUser.edit.label"),
                  }),
                },
                pattern: {
                  value: REGEX.SPACE,
                  message: t("validation.required", {
                    field: t("notificationUser.edit.label"),
                  }),
                },
                maxLength: {
                  value: 200,
                  message: t("validation.maxLength", {
                    max: 200,
                    field: t("notificationUser.edit.label"),
                  }),
                },
              })}
              onBlur={formatInput}
            />
            {errors.label && ["maxLength", "pattern", "required"].includes(errors.label.type) && (
              <span className="validation_message">
                {errors.label.message}
              </span>
            )}
          </div>
          {/* startDate */}
          <div className="form-group mt_24">
            <p className="text_title mb_4">{t("notificationUser.edit.startDate")}</p>
            <Controller
              control={control}
              name="startDate"
              rules={{
                required: {
                  value: true,
                  message: t("validation.required", {
                    field: t("notificationUser.edit.startDate"),
                  }),
                },
                validate: validationDate
              }}
              render={({ field }) => (
                <DatePicker
                  {...register("startDate")}
                  selected={field.value ? new Date(field.value) : undefined}
                  onChange={field.onChange}
                  //showTimeInput
                  locale={t("lang")}
                  timeInputLabel={t("timeInputLabel")}
                  dateFormat={t("dateFormat")}
                  className={styles.input_text}
                  placeholderText={t("notificationUser.edit.placeholderDate")}
                  minDate={new Date()}
                />
              )}
            />
            {errors.startDate &&
              ["required"].includes(errors.startDate.type) && (
                <p className="validation_message">
                  {errors.startDate.message}
                </p>
              )}
          </div>
          {/* endDate */}
          <div className="form-group mt_24">
            <p className="text_title mb_4">{t("notificationUser.edit.endDate")}</p>
            <Controller
              control={control}
              name="endDate"
              rules={{
                required: {
                  value: true,
                  message: t("validation.required", {
                    field: t("notificationUser.edit.endDate"),
                  }),
                },
                validate: validationDate,
              }}
              render={({ field }) => (
                <DatePicker
                  {...register("endDate")}
                  selected={field.value ? new Date(field.value) : undefined}
                  onChange={field.onChange}
                  //showTimeInput
                  locale={t("lang")}
                  timeInputLabel={t("timeInputLabel")}
                  dateFormat={t("dateFormat")}
                  className={styles.input_text}
                  placeholderText={t("notificationUser.edit.placeholderDate")}
                  minDate={new Date()}
                />
              )}
            />
            {errors.endDate &&
              ["required", "validate"].includes(errors.endDate.type) && (
                <p className="validation_message">
                  {errors.endDate.type !== "validate"
                    ? errors.endDate.message
                    : (!(errors.startDate &&
                      ["required"].includes(errors.startDate.type))) && t("validation.endDateGreaterStartDate")}
                </p>
              )}
          </div>
          {/* content */}
          <div className="form-group mt_24">
            <p className="text_title mb_4">{t("notificationUser.edit.content")}</p>
            <textarea
              rows={2}
              className={styles.input_text}
              placeholder={t("notificationUser.edit.placeholderContent")}
              autoComplete="off"
              {...register("content", {
                // pattern: {
                //   value: REGEX.SPACE,
                //   message: t("validation.required", {
                //     field: t("notificationUser.edit.content"),
                //   }),
                // },
                maxLength: {
                  value: 1000,
                  message: t("validation.maxLength", {
                    max: 1000,
                    field: t("notificationUser.edit.content"),
                  }),
                },
              })}
              onBlur={formatInput}
            />
            {errors.content &&
              ["pattern", "maxLength"].includes(
                errors.content.type
              ) && (
                <span className="validation_message">
                  {errors.content.message}
                </span>
              )}
          </div>
          {/* image */}
          <div className="form-group mt_24">
            <p className="text_title mb_4">{t("notificationUser.edit.image")}</p>
            <ImageUploading
              value={image}
              onChange={onChangeImage}
              maxNumber={1}
              dataURLKey="data_url"
              maxFileSize={MAX_SIZE_IMAGE}
              onError={(er) => handleErrorUploadImages(er)}
            >
              {({ imageList, onImageUpload, onImageRemove }) => (
                // write your building UI
                <div className={`upload__image-wrapper ${styles.img_wrapper}`}>
                  {defaultImage ? (
                    <div className={styles.image}>
                      <Image
                        styleCustom={{height: width / 2}}
                        className={styles.image_main_item}
                        src={`${Config.API_URL.GET_IMAGE}${defaultImage}`}
                        alt="product"
                      />
                      <div
                        className={styles.icon_close}
                        onClick={() => removeImage()}
                      >
                        <img src={IconClose} />
                      </div>
                    </div>
                  ) : (
                    image.length < 1 && (
                      <ButtonAddImage
                        styleCustom={{height: width / 2}}
                        className={styles.btn_add_main}
                        handleClick={onImageUpload}
                      ></ButtonAddImage>
                    )
                  )}

                  {imageList.map((image, index) => (
                    <div key={index} className={styles.image_main_div}>
                      <img
                        style={{height: width / 2}}
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
        </div>
        <div style={{ height: heightBtn }}></div>
        <div className={`${styles.form_button}`} ref={elementRef}>
          <button type="submit" className={`btn_main`} 
          disabled={Array.isArray(errors) || Object.values(errors).toString() != ""}>
            {t("notificationUser.edit.btnEdit")}
          </button>
        </div>
      </form>
      <NotifyModal
        open={openNotify}
        message={t("notificationUser.edit.successMessage")}
        title={""}
        textButton={t("close")}
        handleCloseModal={handleCloseNotify}
      ></NotifyModal>
    </div>
  )
}

export default EditNotificationUser;