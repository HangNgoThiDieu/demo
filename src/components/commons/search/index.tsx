import Form from "react-bootstrap/Form";
import IconSearch from "assets/images/icon_search.svg";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";

const Search: React.FC<{ name: string; onChange: any; handleSearchIcon: any }> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="row d-flex justify-content-center ">
        <div className="col-md-6">
          <div className="card">
            <div className={styles.input_box}>
              <input
                type="text"
                name={props.name}
                className={styles.input_text}
                placeholder={t("account.placeholderName")}
                onChange={props.onChange}
                autoComplete="off"
              />
              <img src={IconSearch} className={styles.icon_search} alt="" onClick={props.handleSearchIcon} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Search;
