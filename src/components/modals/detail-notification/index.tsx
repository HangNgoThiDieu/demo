import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";

interface NotificationDetailProps {
  open: boolean;
  title: string;
  content: string;
  handleCloseModal: (e?: any) => void;
  textButton: string;
  date: string;
}

const NotificationDetailModal: React.FC<NotificationDetailProps> = (
  props: NotificationDetailProps
) => {
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
        <div className="">
          <p className="mb_12">{props.date}</p>
          <p className="title_modal mb_8 break_word">{props.title}</p>
          <pre>
            <p className="text_16 break_word">{props.content}</p>
          </pre>
        </div>
        <div className={styles.button_group}>
          <div className="mt_16">
            <button className="btn_white" onClick={props.handleCloseModal}>
              {props.textButton}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NotificationDetailModal;
