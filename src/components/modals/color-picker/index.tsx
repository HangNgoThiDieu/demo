import React from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "react-responsive-modal";
import styles from "./index.module.scss";

interface ColorPalettesProps {
  open: boolean;
  onClose: () => void;
  handleColorChange: any;
  colorValue: any;
  setColorValue: any;
}

const ColorPalettesModal: React.FC<ColorPalettesProps> = (
  props: ColorPalettesProps
) => {
  const { t } = useTranslation();

  const override_palette = {
    width: "100%",
  };

  const { handleSubmit } = useForm({});

  const onSubmit = () => {
    props.handleColorChange(props.colorValue);
    props.onClose();
  };

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="title_modal mb_24">
              {t("storeSetting.design.colorPalettes.title")}
            </p>
            <div className={`${styles.color_palette} mb_36`}>
              <HexColorPicker
                color={props.colorValue}
                onChange={props.setColorValue}
                style={override_palette}
              />
              <HexColorInput
                color={props.colorValue}
                onChange={props.setColorValue}
                prefixed
                className={`${styles.input_text} mt_8`}
              />
            </div>
            <div className={styles.button_group}>
              <button type="submit" className="btn_main">
                {t("storeSetting.design.colorPalettes.save")}
              </button>
              <div className="mt_16">
                <button
                  type="button"
                  className="btn_white"
                  onClick={props.onClose}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ColorPalettesModal;
