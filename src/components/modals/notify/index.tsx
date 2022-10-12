import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";

interface NotifyProps {
    open: boolean;
    title?: string;
    message: string;
    moreMessage?: string;
    textButton: string;
    handleCloseModal: (e?: any) => void;
}

const NotifyModal: React.FC<NotifyProps> = (props: NotifyProps) => {
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
         {props.title && (
          <label className="title_modal">{props.title}</label>
         )}
          <p>{props.message}</p>
          {props.moreMessage && <p>{props.moreMessage}</p>}
        </div>
      <div className={styles.button_group}>
        <div className="mt_16">
          <button
            className="btn_white"
            onClick={props.handleCloseModal}
          >{props.textButton}</button>
        </div>
      </div>
      </Modal>
    </>
  );
};
export default NotifyModal;
