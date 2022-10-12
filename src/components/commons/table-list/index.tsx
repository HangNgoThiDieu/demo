import iconDelete from "assets/images/icon_delete.svg";
import iconEdit from "assets/images/icon_edit.svg";
import { useTranslation } from "react-i18next";
import { TableSettingResult } from "types/results/table/table-setting.result";
import NoData from "../no-data";
import styles from "./index.module.scss";

interface TableProps {
  data?: TableSettingResult[];
  isEnableSeat: boolean;
  openDelete: (id: number, name: string) => void;
  openEdit: (id: number, name: string, listSeat: any[]) => void;
}

const TableList: React.FC<TableProps> = ({ data, openDelete, openEdit, isEnableSeat }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className={styles.wrapper}>
        {data && data.length > 0 && (
          data.map((item, i) => (
            <div key={i} className={styles.content_list}>
              <div className={styles.display_content}>
                <div className={`${styles.item_name} "mr_21"`}>
                  <label className={`${styles.table_name} text_title break_word`}>
                    {item.name}
                  </label>
                  {isEnableSeat && (
                    <>
                      {item.listSeat && item.listSeat.length > 0 
                        && <label className="mt_4 text_bold_14">
                            {t("tableSetting.seat")}
                          </label>
                      }
                      <div>
                        {item.listSeat &&
                          item.listSeat.length > 0 &&
                          item.listSeat.map((seat, indexSeat) => (
                            <label key={indexSeat}>
                              {indexSeat > 0 && <label>&nbsp;/&nbsp;</label>}
                              {seat.name}
                            </label>
                          ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="mr_12">
                  <div
                    onClick={() => openDelete(item.id, item.name)}
                    className={`${styles.div_icon_delete} image_delete mt_12 mb_8`}
                  >
                    <img
                      className={styles.image_delete}
                      src={iconDelete}
                      alt="iconDelete"
                    ></img>
                  </div>
                  <div
                    onClick={() => openEdit(item.id, item.name, item.listSeat)}
                    className="item_edit"
                  >
                    <img
                      className={styles.image_edit}
                      src={iconEdit}
                      alt="iconEdit"
                    ></img>
                  </div>
                </div>
              </div>
              <div className={styles.line}></div>
            </div>
          ))
        )}
        {data && data.length < 1 && <NoData />}
      </div>
    </>
  );
};
export default TableList;
