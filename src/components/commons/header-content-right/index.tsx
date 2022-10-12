import { FC } from "react";
import styles from "./index.module.scss";
import iconBack from "assets/images/icon_back.svg";

interface HeaderContentProps {
	title: string;
	isBtnLeft?: boolean;
	isBtnRight?: boolean;
	titleBtnRight?: string;
	onBtnLeft?: () => void;
	onBtnRight?: () => void;
}

const HeaderContentRight: FC<HeaderContentProps> = ({
	title,
	isBtnLeft,
	isBtnRight,
	titleBtnRight,
	onBtnLeft,
	onBtnRight,
}) => {
	return (
		<>
			<div className={styles.root}>
				<div className={styles.box_header_content}>
					{isBtnLeft && (
						<div>
							<button
								className={`${styles.btn_left_right} ${styles.btn_left}`}
								onClick={onBtnLeft}
							>
								<img src={iconBack} alt="iconBack" />
							</button>
						</div>
					)}
					<div className={styles.box_title}>
						<label className={`text_title ${styles.title}`}>{title}</label>
					</div>
					{isBtnRight && (
						<div>
							<button
								className={styles.btn_left_right}
								onClick={onBtnRight}
							>
								{titleBtnRight}
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default HeaderContentRight;
