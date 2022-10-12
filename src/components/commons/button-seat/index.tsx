import styles from "./index.module.scss";

const ButtonSeat: React.FC<{
	textLeft: string;
	textRight: string;
	classNameLeft?: string,
	classNameRight?: string,
	onRightPress: () => void;
	onLeftPress: () => void;
}>
	= (props) => {
		return (
			<div className={styles.group_button}>
				<button type="button" onClick={props.onLeftPress} className={`${props.classNameLeft} ${styles.btn_white} mr_8`}>{props.textLeft}</button>
				<button type="submit" onClick={props.onRightPress} className={`${props.classNameRight} ${styles.btn_main}`}>{props.textRight}</button>
			</div>
		);
	};

export default ButtonSeat;
