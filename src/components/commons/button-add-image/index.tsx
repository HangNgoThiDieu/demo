import styles from "./index.module.scss";
import IconPlusWhite from "assets/images/icon_plus_white.svg";

import { FC } from "react";
interface ButtonProps {
	className?: any;
	handleClick?: () => void;
	styleCustom?: any;
}

const ButtonAddImage: FC<ButtonProps> = (props:  ButtonProps) => {
	return (
		<>
			<button
				style={props.styleCustom}
				className={`${props.className} ${styles.btn_add_image}`}
				type="button"
				onClick={props.handleClick}
			>
				<img className={styles.icon_plus} src={IconPlusWhite} />
			</button>
		</>
	);
};

export default ButtonAddImage;
