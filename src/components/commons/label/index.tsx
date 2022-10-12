import styles from "./index.module.scss";
import IconLabel from "assets/images/icon_label.svg";

const Label: React.FC<{ text: string }> = (props) => {
	return (
		<div className={styles.div_label}>
			<img src={IconLabel} />
			<label className={styles.text_label}>{props.text}</label>
		</div>
	);
};

export default Label;
