import { FC } from "react";
import styles from "./index.module.scss";
import iconBack from "assets/images/icon_back.svg";

interface HeaderContentProps {
	title?: string;
	isBtnLeft?: boolean;
	onBtnLeft?: () => void;
	onBtnRight?: () => void;
	titleStyle?: any;
}

const HeaderContent: FC<HeaderContentProps> = ({
	title,
	isBtnLeft,
	onBtnLeft,
	onBtnRight,
	titleStyle
}) => {
	return (
		<>
			<div className={styles.root}>
				<div className={styles.box_header_content}>
					{isBtnLeft && (
						<div>
							<button
								className={`${styles.btn} ${styles.btn_left}`}
								onClick={onBtnLeft}
							>
								<img className={styles.icon_back} src={iconBack} alt="iconBack" />
							</button>
						</div>
					)}
					<div className={`${styles.box_title} ${titleStyle}`}>
						<label className={`text_title ${styles.title}`}>{title}</label>
					</div>
				</div>
			</div>
		</>
	);
};

export default HeaderContent;
