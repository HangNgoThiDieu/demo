import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";

interface ConfirmProps {
  id?: number;
  name?: string;
  open: boolean;
  title?: string;
  subTitle?: string;
  textButton: string;
  textCancel: string;
  labelEmail?: string;
  email?: string;
  handleEvent: (id?: number, name?: string) => void;
  handleCloseModal: () => void;
}

const ConfirmForgotPasswordModal: React.FC<ConfirmProps> = (
  props: ConfirmProps
) => {
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
				<div className="text-center mb_16">
					<p className="title_modal">{props.title}</p>
					<p>{props.subTitle}</p>
				</div>
        <div className={styles.confirm_content}>
					<p className="text_title">{props.labelEmail}</p>
					<p className="text_16">{props.email}</p>
				</div>
        <div className={styles.button_group}>
          <button
            className="btn_main"
            onClick={() => props.handleEvent(props.id, props.name)}
          >
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
export default ConfirmForgotPasswordModal;
