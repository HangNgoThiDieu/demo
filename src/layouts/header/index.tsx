import { FC } from "react";
import { useAuth } from "context/auth";
import styles from "./index.module.scss";
import menu from "assets/images/menu.svg";
import { useHistory } from "react-router-dom";
import Image from "components/commons/image";
import Config from "config";
import ImgOptimizeByWebp from "components/commons/img-webp";
import NoImage from "assets/images/no-image.png";

interface HeaderProps {
  title: string;
  onOpen: () => void;
  logo?: string;
  handle?: () => void;
  isMenu?: boolean;
}

const Header: FC<HeaderProps> = ({ title, onOpen, logo, handle, isMenu = false }) => {
  const { isAuthenticated } = useAuth();
  const history = useHistory();

  return (
    <>
      {!isAuthenticated ? (
        <div className={styles.root}>
          <div className={styles.box}>
            <p className="text_title">{title}</p>
          </div>
        </div>
      ) : (
        <div className={styles.root}>
          <div className={styles.box_login}>
            <div className={styles.logo} onClick={() => history.push(``)}>
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
            <span className={`${styles.public_title} text_title`} onClick={handle}>{title}</span>
            {isMenu && 
            <div className={styles.div_menu} onClick={onOpen}>
              <img className={styles.menu_icon} src={menu} alt="Menu" />
            </div>}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
