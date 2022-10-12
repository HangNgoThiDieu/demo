import HeaderContent from "components/commons/header-content";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styles from "./index.module.scss";
import icon_sorry from "assets/images/icon_sorry.svg";
import icon_face from "assets/images/icon_face.svg";

const Forbidden = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <div className={styles.wrapper}>
        <div className={`${styles.image}`}>
          <img className="mr_5" src={icon_sorry} alt="sorry" />
          <img src={icon_face} alt="face" />
        </div>
        <div className="mt_32">
          <p className="text_sub">{t("errorPage.403.title")}</p>
          <p className="text_sub">{t("errorPage.403.subTitle")}</p>
        </div>
        <p className="mt_24 text_16">{t("errorPage.403.content")}</p>
        <p className={styles.error_number}>{t("errorPage.403.error")}</p>
        <button className={`btn_main ${styles.btn_return}`} onClick={() => window.location.href ="/"}>{t("returnTop")}</button>
      </div>
    </>
  );
};

export default Forbidden;
