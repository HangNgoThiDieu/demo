import { FC } from "react";
import styles from "./index.module.scss";

interface GroupsButtonBottomProps {
  textButtonLeft: string;
  textButtonRight: string;
  handleButtonLeft: () => void;
  handleButtonRight: () => void;
  isDisable?: boolean;
  isHideButtonRight?: boolean | false;
  changeColorMainButton?: boolean | false;
  elementRef?: any;
}

const GroupsButtonBottom: FC<GroupsButtonBottomProps> = (
  props: GroupsButtonBottomProps
) => {
  return (
    <>
      <div className={`${styles.form_button}`} ref={props.elementRef}>
        <button
          className={`${props.changeColorMainButton ? "btn_main" : "btn_white"} 
                      mr_4 ${styles.btn}`}
          onClick={() => props.handleButtonLeft()}
        >
          {props.textButtonLeft}
        </button>
        {!props.isHideButtonRight && <button
          className={`btn_main ml_4 ${styles.btn}`}
          onClick={() => props.handleButtonRight()}
          disabled={props.isDisable || false}
        >
          {props.textButtonRight}
        </button>}
      </div>
    </>
  );
};

export default GroupsButtonBottom;
