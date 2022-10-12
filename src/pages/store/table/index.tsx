import HeaderContent from "components/commons/header-content";
import Select from "components/commons/select";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { tableService } from "../../../services/table.service";
import styles from "./index.module.scss";
import iconTime from "assets/images/icon_time.svg";
import { ListTableResult } from "types/results/table/list-table.result";
import { FilterListTableModel } from "types/models/filter-list-table.model";
import { toBrowserTime } from "utils/datetime";
import { useHistory } from "react-router-dom";
import NoData from "components/commons/no-data";
import { toast } from "react-toastify";
import { TransactionStatus } from "utils/enums";
import { TABLE, TransactionStatusList } from "utils/constants";
import { useLoadingContext } from "context/loading";

const Table = () => {
  const { t } = useTranslation();
  const [listTable, setListTable] = useState<ListTableResult[]>();
  const [btnLeft] = useState(true);
  const [filterTransactionStatus, setFilterTransactionStatus] =
    useState<FilterListTableModel>({});
  const [totalTable, setTotalTable] = useState<number>();
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();

  const getListTable = async () => {
    try {
      const result = await tableService.getListTable(filterTransactionStatus);
      setListTable(result);
      setTotalTable(result.length);
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    }
  };

  const getTextButtonStatus = (status: number) => {
    switch (status) {
      case TransactionStatus.BeforeOrdering:
        return t("beforeOrdering");

      case TransactionStatus.Seated:
        return t("seated");

      case TransactionStatus.CompletedPayment:
        return t("completed");

      default:
        return "";
    }
  };

  const getClassButtonStatus = (status: number) => {
    switch (status) {
      case TransactionStatus.BeforeOrdering:
        return "btn_custom_sub";

      case TransactionStatus.Seated:
        return "btn_custom_main";

      case TransactionStatus.CompletedPayment:
        return "btn_custom_white";

      default:
        return "";
    }
  };

  const handleChange = (e: any) => {
    setFilterTransactionStatus({
      ...filterTransactionStatus,
      transactionStatus: e.target.value,
    });
  };

  const moveToTableDetail = (id: number) => {
    history.push(`${TABLE}${id}`);
  };

  useEffect(() => {
    showLoading();
    getListTable();
  }, [filterTransactionStatus]);

  return (
    <>
      <div className={styles.wrapper}>
        <HeaderContent
          title={t("table.title")}
          isBtnLeft={btnLeft}
          onBtnLeft={() => history.push("/")}
        ></HeaderContent>
        <div className={styles.content_wrapper}>
          <div className={styles.content}>
            <div className="pb_16">
              <Select
                data={TransactionStatusList}
                onChange={handleChange}
              ></Select>
            </div>
            <label className={styles.number_table}>
              {t("table.numberOfTable")}: {totalTable}
            </label>
          </div>
          <div>
            {listTable && listTable.length > 0 && (
              listTable.map((item, index) => (
                <div
                  className={styles.list_table}
                  key={index}
                  onClick={() => moveToTableDetail(item.tableOrderId)}
                >
                  <div className={styles.table_item}>
                    <div className={styles.part_left}>
                      <p className="text_title break_word">
                        {item.tableName}
                      </p>
                      <div>
                        {item.transactionStartDate && (
                          <div className={styles.time}>
                            <img src={iconTime}></img>
                            <label className={`text_small ${styles.label_time}`}>
                              {t("table.timeIn") +
                                " : " +
                                toBrowserTime(
                                  item.transactionStartDate,
                                  t("datetimeFormatStringHM")
                                )}
                            </label>
                          </div>
                        )}
                        <div className={`${styles.time} ${styles.time_out}`}>
                          {item.transactionEndDate && (
                            <div>
                              <img src={iconTime}></img>
                              <label className={`text_small ${styles.label_time}`}>
                                {t("table.timeOut") +
                                  " : " +
                                  toBrowserTime(
                                    item.transactionEndDate,
                                    t("datetimeFormatStringHM")
                                  )}
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`${getClassButtonStatus(item.status)}`}
                    >
                      {getTextButtonStatus(item.status)}
                    </button>
                  </div>
                  <div className={styles.line}></div>
                </div>
              ))
            )}
            {listTable && listTable.length < 1 && <NoData />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
