import HeaderContent from "components/commons/header-content";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { settingService } from "services/setting.service";
import { useForm } from "react-hook-form";
import { SettingSeatModel } from "types/models/setting/setting-seat.model";
import { toast } from "react-toastify";
import { useLoadingContext } from "context/loading";

const SeatSetting = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isEnableSeat, setIsEnableSeat] = useState<boolean>(false);
  const { showLoading, hideLoading } = useLoadingContext();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getSeat = () => {
    settingService.getSeat().then((result) => {
      hideLoading();
      setIsEnableSeat(result.isEnableSeat);
    }).catch((e) => {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    })
  };

  const onSubmit = () => {
    showLoading();
    const seatModel = {
      isEnableSeat: isEnableSeat,
    } as SettingSeatModel;

    settingService.setSeat(seatModel).then(() => {
      hideLoading();
      toast.success(t("storeSetting.seat.settingSeatSuccess"));
    }).catch((e) => {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    })
  };

  useEffect(() => {
    showLoading();
    getSeat();
  }, []);

  return (
    <>
      <div className={styles.content}>
        <HeaderContent
          title={t("storeSetting.seat.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
          <div className={styles.seat}>
            <label>{t("storeSetting.seat.setSeat")}</label>
            <label className={`switch`}>
              <input
                type="checkbox"
                checked={isEnableSeat}
                onChange={() => setIsEnableSeat(!isEnableSeat)}
              />
              <span className={`slider round`}></span>
            </label>
          </div>
        </div>
          <div className={styles.form_button}>
            <button type="submit" className={`btn_main`}>
              {t("storeSetting.seat.setting")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SeatSetting;
