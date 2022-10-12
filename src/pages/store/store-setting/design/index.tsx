import HeaderContent from "components/commons/header-content";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import ImageUploading, { ImageType } from "react-images-uploading";
import { toast } from "react-toastify";
import Image from "components/commons/image";
import Config from "config";
import ButtonAddImage from "components/commons/button-add-image";
import IconClose from "assets/images/icon_close.svg";
import ColorPalettesModal from "components/modals/color-picker";
import { settingService } from "services/setting.service";
import { COLORS, COLOR_TYPE, CURRENCY_UNITS, MAX_SIZE_IMAGE } from "utils";
import { DesignStoreSettingModel } from "types/models/store-setting/design/design-setting.model";
import { useForm } from "react-hook-form";
import { DesignStoreSettingResult } from "types/results/store-setting/design/design-settting.result";
import { useHistory } from "react-router-dom";
import DesignPreviewModal from "components/modals/design-preview";
import { tokenHelper } from "utils/store-token";
import { ColorsResult } from "types/results/colors.result";
import { useAuth } from "context/auth";
import { useStoreContext } from "layouts/admin";
import { resizeFile, toBase64 } from "utils/resize-img";
import { useLoadingContext } from "context/loading";

const DesignSetting = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [image, setImage] = useState<ImageType[]>([]);
  const [defaultImage, setDefaultImage] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [mainColor, setMainColor] = useState<string>("");
  const [subColor, setSubColor] = useState<string>("");
  const [accentColor, setAccentColor] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("");
  const [colorType, setColorType] = useState<number>(COLOR_TYPE.MainColor);
  const [colorValue, setColorValue] = useState<string>("");
  const [design, setDesign] = useState<DesignStoreSettingResult>(
    {} as DesignStoreSettingResult
  );
  const [hasDeleteImg, setHasDeleteImg] = useState<boolean>(false);
  const [openDesignPreview, setOpenDesignPreview] = useState(false);
  const [designModel, setDesignModel] = useState<DesignStoreSettingModel>(
    {} as DesignStoreSettingModel
  );
  const { setter } = useAuth();
  const { logoSetter } = useStoreContext();
  const [unitPrice, setUnitPrice] = useState<string>();
  const width = window.innerWidth;
  const { showLoading, hideLoading } = useLoadingContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DesignStoreSettingModel>({});

  const onChangeImage = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setImage(imageList);
  };

  const handleErrorUploadImages = (error: any) => {
    if (error.maxFileSize) {
      toast.error(t("storeSetting.design.errors.maxFileSize"));
    }
  };

  const removeImage = () => {
    setDefaultImage(undefined);
    setHasDeleteImg(true);
  };

  const getDesign = async () => {
    try {
      const result = await settingService.getDesignStoreSetting();
      setDesign(result);
      setDefaultImage(result.fileName);
      setMainColor(result.mainColor);
      setSubColor(result.subColor);
      setAccentColor(result.accentColor);
      setTextColor(result.textColor);

      reset(result);
      hideLoading();
    } catch (err) {
      hideLoading();
    }
  };

  const onSubmit = (data: DesignStoreSettingModel) => {
    setOpenDesignPreview(true);
    data.settingId = design.id;
    data.file = image.map((f) => f.file as File);
    data.mainColor = mainColor;
    data.subColor = subColor;
    data.accentColor = accentColor;
    data.textColor = textColor;
    data.hasDeleteImg = hasDeleteImg;
    setDesignModel(data);
  };

  const handleEventDesign = async () => {
    try {
      showLoading();
      //resize file image
      if (designModel.file && designModel.file?.length > 0) {
        try {
          const image = await resizeFile(designModel.file[0]) as File;
          designModel.file[0] = image;
        } catch (e) {
          toast.error("product.error.uploadFailure");
        }
      }

      const result = await settingService
      .setDesign(designModel);

      if (result) {
        tokenHelper.removeColor();
        const colorsResult: ColorsResult = {
          mainColor: mainColor,
          subColor: subColor,
          textColor: textColor,
          accentColor: accentColor,
        };
        tokenHelper.setColorsToStorage(COLORS, colorsResult);

        setOpenDesignPreview(false);
        toast.success(t("storeSetting.designPreview.settingDesignSuccess"));
        setter(colorsResult);
        logoSetter(image && image.map((image, index) => (image["data_url"])));
        hideLoading();
      }
    }
    catch (err) {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    }
  };

  const handlePickColor = (type: number, value: string) => {
    setIsOpen(true);
    setColorType(type);
    setColorValue(value);
  };

  const closePreview = () => {
    setOpenDesignPreview(false);
  };

  useEffect(() => {
    showLoading();
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
    getDesign();
  }, []);

  return (
    <div className={styles.content}>
      <HeaderContent
        title={t("storeSetting.design.title")}
        isBtnLeft
        onBtnLeft={() => history.goBack()}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div className={styles.logo_image}>
            <label className="text_title mb_8">
              {t("storeSetting.design.labelImage")}
            </label>
            <div className={styles.logo_img}>
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
                  <div className={`upload__image-wrapper`}>
                    {defaultImage ? (
                      <div className={styles.image}>
                        <Image
                          styleCustom={{height: width / 1.5 }}
                          className={styles.image_main_item}
                          src={`${Config.API_URL.GET_IMAGE}${defaultImage}`}
                          alt="logo-company"
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
                          className={styles.btn_add_main}
                          handleClick={onImageUpload}
                        ></ButtonAddImage>
                      )
                    )}

                    {imageList.map((image, index) => (
                      <div key={index} className={styles.image_main_div}>
                        <img
                          style={{height: width / 1.5}}
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
            <div className={`${styles.setting} mt_32`}>
              <label className="text_title mb_8">
                {t("storeSetting.design.labelColors")}
              </label>
              <div className={styles.colors}>
                <div className={`${styles.color_item} mb_16`}>
                  <p>{t("storeSetting.design.mainColor")}</p>
                  <div
                    onClick={() =>
                      handlePickColor(COLOR_TYPE.MainColor, mainColor)
                    }
                    className={styles.color_box}
                    style={{ backgroundColor: `${mainColor}` }}
                  ></div>
                </div>
                <div className={`${styles.color_item} mb_16`}>
                  <p>{t("storeSetting.design.subColor")}</p>
                  <div
                    onClick={() =>
                      handlePickColor(COLOR_TYPE.SubColor, subColor)
                    }
                    className={styles.color_box}
                    style={{ backgroundColor: `${subColor}` }}
                  ></div>
                </div>
                <div className={`${styles.color_item} mb_16`}>
                  <p>{t("storeSetting.design.attentionColor")}</p>
                  <div
                    onClick={() =>
                      handlePickColor(COLOR_TYPE.AccentColor, accentColor)
                    }
                    className={styles.color_box}
                    style={{ backgroundColor: `${accentColor}` }}
                  ></div>
                </div>
                <div className={styles.color_item}>
                  <p>{t("storeSetting.design.textColor")}</p>
                  <div
                    onClick={() =>
                      handlePickColor(COLOR_TYPE.TextColor, textColor)
                    }
                    className={styles.color_box}
                    style={{ backgroundColor: `${textColor}` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.form_group} ${styles.form_button}`}>
          <button type="submit" className={`btn_main`}>
            {t("storeSetting.design.btnSetting")}
          </button>
        </div>
      </form>
      {isOpen && <ColorPalettesModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        colorValue={colorValue}
        setColorValue={setColorValue}
        handleColorChange={
          colorType == COLOR_TYPE.MainColor
            ? setMainColor
            : colorType == COLOR_TYPE.SubColor
            ? setSubColor
            : colorType == COLOR_TYPE.AccentColor
            ? setAccentColor
            : setTextColor
        }
      />}
      {openDesignPreview && <DesignPreviewModal
        open={openDesignPreview}
        title={t("storeSetting.designPreview.title")}
        textButton={t("storeSetting.designPreview.buttonSetting")}
        textCancel={t("close")}
        handleEventDesign={handleEventDesign}
        handleCloseModal={closePreview}
        mainColor={mainColor}
        subColor={subColor}
        accentColor={accentColor}
        textColor={textColor}
        logoOld={defaultImage}
        logoNew={image}
        unitPrice={unitPrice}
      ></DesignPreviewModal>}
    </div>
  );
};

export default DesignSetting;
