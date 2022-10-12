import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";

interface ConfirmProps {
  open: boolean;
  title?: string;
  subTitle?: string;
  textButton: string;
  textCancel: string;
  handleEvent: (e?: any) => void;
  handleCloseModal: () => void;
}

const ConfirmCustomModal: React.FC<ConfirmProps> = (props: ConfirmProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        open={props.open}
        onClose={() => {}}
        center
        showCloseIcon={false}
        classNames={{
          overlay: styles.custom_overlay,
          modal: styles.custom_modal,
        }}
      >
        <div className="text-center">
          <p className="title_modal">{props.title}</p>
          <p className="mt_4">{props.subTitle}</p>
        </div>
        <div className={styles.button_group}>
          <button className="btn_main" onClick={props.handleEvent}>
            {props.textButton}
          </button>
          <div className="mt_16">
            <button className="btn_white" onClick={props.handleCloseModal}>
              {props.textCancel}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ConfirmCustomModal;
