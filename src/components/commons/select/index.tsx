import { FC } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

interface SelectProps {
  data: any[];
  onChange: (e: any) => void;
  disabled?: boolean;
}

const Select: FC<SelectProps> = ({data, onChange, disabled}) => {
	const { t } = useTranslation();
	
	return (
    <>
      <select
      disabled={disabled}
      onChange={onChange}  
      className={styles.filter}>
        {data != null &&
          data.map((item, i) => (
            <option key={i} value={item.key}>{t(item.value)}</option>
          ))}
      </select>
    </>
  );
};

export default Select;