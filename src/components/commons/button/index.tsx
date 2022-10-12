import styles from "./index.module.scss";
import { FC } from "react";
interface ButtonProps {
	text: string;
	className: string;
	handleClick?: () => void;
}

const Button: FC<ButtonProps> = (props:  ButtonProps) => {
	return (
		<>
			<button
				type="submit"
				className={styles[props.className]}
				onClick={props.handleClick}
			>
				{props.text}
			</button>
		</>
	);
};

export default Button;
