import React from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { SeatItemResult } from "types/results/orders/seat-items.result";
import styles from "./index.module.scss";

interface SeatsProps {
  open: boolean;
  title: string;
  seats: SeatItemResult[];
  handleEvent: () => void;
  handleCloseModal: () => void;
  textButton: string;
  textCancel: string;
  setSeatId: any;
}

const SeatList: React.FC<SeatsProps> = (props: SeatsProps) => {
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
          <label className={`${styles.pre_line_text} title_modal`}>{props.title}</label>
        </div>
        <div className={styles.confirm_content}>
          {props.seats &&
            props.seats.length > 0 &&
            props.seats.map((seat, index) => (
              <label key={index} className={styles.seat_item}>
                <input
                  type="radio"
                  name="seatName"
                  value={seat.id}
                  defaultChecked={seat.id === undefined}
                  onChange={(e: any) => props.setSeatId(e.target.value)}
                />
                <span className={`${styles.text_radio} text_16`}>
                  {seat.name}
                </span>
              </label>
            ))}
        </div>
        <div className={styles.button_group}>
          <button className="btn_main" onClick={() => props.handleEvent()}>
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

export default SeatList;
