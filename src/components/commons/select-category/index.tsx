import { FC } from "react";
import { useTranslation } from "react-i18next";
import { CategoryResult } from "types/results/master-data/category.result";
import styles from "./index.module.scss";

interface SelectProps {
  data: CategoryResult[];
  categorySelected?: string;
  onChange: (e: any) => void;
  disabled?: boolean;
}

const SelectCategory: FC<SelectProps> = ({data, categorySelected, onChange, disabled}) => {
	const { t } = useTranslation();

	return (
    <>
      <select
      disabled={disabled}
      onChange={onChange}  
      className={styles.filter}>
        {data != null &&
          data.map((item, i) => (
            <option key={i} value={item.id} selected={categorySelected == item.name}>{item.id === 0 ? t("all") : item.name}</option>
          ))}
      </select>
    </>
  );
};

export default SelectCategory;