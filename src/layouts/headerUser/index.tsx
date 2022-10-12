import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { tokenHelper } from "utils/store-token";
import { Dropdown } from "react-bootstrap";
import FlagIconFactory from "react-flag-icon-css";
import {
  FLAG_CODES,
  LANGUAGE_FLAG,
  LANGUAGE_USER,
  TRANSLATE_LIST,
} from "utils";
import Image from "components/commons/image";
import Config from "config";
import i18n from "config/i18n";
import styles from "./index.module.scss";
import { useHistory } from "react-router-dom";
import ImgOptimizeByWebp from "components/commons/img-webp";
import NoImage from "assets/images/no-image.png";

const FlagIcon = FlagIconFactory(React, { useCssModules: false });

const HeaderUser = (props: any) => {
  const { t } = useTranslation();
  const [countries] = useState<any[]>(LANGUAGE_FLAG);
  const compName = tokenHelper.getCompanyName();
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [toggleContents, setToggleContents] = useState<any>();
  const [logo, setLogo] = useState("");
  const history = useHistory();

  const onChangeLanguage = (eventKey: string | null) => {
    setSelectedCountry(eventKey);
    // set language for system
    let language = LANGUAGE_FLAG.filter((x) => x.code == eventKey)
      .map((y) => y.code)
      .shift();
    if (language == FLAG_CODES.ENG) {
      language = "en";
    }
    if (language == FLAG_CODES.VN) {
      language = "vi";
    }

    tokenHelper.setLanguageToStorage(LANGUAGE_USER, language);
    i18n.changeLanguage(tokenHelper.getLanguageFromStorage(LANGUAGE_USER));
  };

  useEffect(() => {
    setToggleContents(
      <>
        <FlagIcon
          code={
            props.lang == "vi"
              ? FLAG_CODES.VN
              : props.lang == "en"
              ? FLAG_CODES.ENG
              : props.lang
          }
          className={styles.flag_size}
        />
      </>
    );
  }, [props.lang]);

  useEffect(() => {
    setLogo(props.logo);
  }, [props.logo]);

  return (
    <div
      className={`${styles.box_login} ${
        props.isOrderHistory == undefined ? styles.padding_header : ""
      }`}
    >
      <div
        className={styles.logo}
        onClick={() =>
          history.push(
            `/user/trans?transId=${props.transId}&comId=${props.comId}`
          )
        }
      >
        <ImgOptimizeByWebp
          className={`img-fluid w-40 ${styles.logo_img}`}
          src={
            logo && logo !== undefined
              ? `${Config.API_URL.GET_IMAGE}${logo}`
              : ""
          }
          fallback={NoImage}
          type="image/webp"
          alt="tos-sciseed"
        />
      </div>
      <div className={styles.element_center}>
        <span id="compName" className="text_title">
          {compName ?? ""}
        </span>
      </div>
      {props.isOrderHistory === true ? (
        <div className={styles.btn_wrapper}>
          <button
            className={styles.btn_order_history}
            onClick={() =>
              history.push("/user/order-history")
            }
          >
            {t("user.orderHistory.orderHistoryBtn")}
          </button>
        </div>
      ) : props.isOrderHistory === false ? (
        <div>
          <Dropdown
            className={styles.country}
            onSelect={(eventKey) => {
              const { code, title } = countries.find(
                ({ code }) => eventKey === code
              );
              onChangeLanguage(eventKey);
              setToggleContents(
                <>
                  <FlagIcon code={code} className={styles.flag_size}/>
                </>
              );
            }}
          >
            <Dropdown.Toggle variant="" id="dropdown-flags">
              {toggleContents}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {countries.map(({ code, title }) => (
                <Dropdown.Item key={code} eventKey={code}>
                  <FlagIcon code={code} className={styles.icon_flag} /> {title}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <div className={styles.empty_box}></div>
      )}
    </div>
  );
};

export default HeaderUser;
