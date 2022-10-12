import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeaderContent from "components/commons/header-content";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import { revenueAnalysisService } from "services/revenue-analysis.service";
import { TableAnalysisResult } from "types/results/revenue/table-analysis.result";
import { toBrowserTime } from "utils/datetime";
import { Table } from "react-bootstrap";
import { FilterTableAnalysisModel } from "types/models/revenue/filter-table-analysis.model";
import { AnalysisType } from "utils/enums";
import { LOCALE, OPTION_CURRENCY } from "utils";
import moment from "moment";

const TableAnalysis = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const startDateDefault = new Date();
  startDateDefault.setDate(startDateDefault.getDate() - 30);
  const [analysisType, setAnalysisType] = useState<number>(
    AnalysisType.Product
  );
  const [startDate, setStartDate] = useState<Date>(startDateDefault);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startComparisonDate, setStartComparisonDate] = useState<Date | null>(
    null
  );
  const [endComparisonDate, setEndComparisonDate] = useState<Date | null>(null);

  const [compareWith, setCompareWith] = useState(false);
  const [tableAnalysisList, setTableAnalysisList] =
    useState<TableAnalysisResult[]>();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showMessageCompare, setShowMessageCompare] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>();
  const [disableExport, setDisableExport] = useState<boolean>(true);

  useEffect(() => {
    getTableAnalysis(false);
  }, [analysisType]);

  const validation = () => {
    let validation = false;
    if (startDate > endDate) {
      setShowMessage(true);
      validation = true;
    } else {
      setShowMessage(false);
    }
    if (compareWith) {
      if (
        startComparisonDate == null ||
        endComparisonDate == null ||
        startComparisonDate > endComparisonDate
      ) {
        setShowMessageCompare(true);
        validation = true;
      } else {
        setShowMessageCompare(false);
      }
    }
    return validation;
  };

  const getTableAnalysis = async (isClear: boolean) => {
    try {
      if (validation()) {
        return;
      }
      const filter = {
        analysisType: analysisType,
        startTime: !isClear ? moment(startDate).format('yyyy/MM/DD') : moment(startDateDefault).format('yyyy/MM/DD'),
        endTime: !isClear ? moment(endDate).format('yyyy/MM/DD') : moment(new Date()).format('yyyy/MM/DD'),
        isCompare: !isClear ? compareWith : false,
        startTimeCompare: startComparisonDate != null ? moment(startComparisonDate).format('yyyy/MM/DD') : startComparisonDate,
        endTimeCompare: endComparisonDate != null ? moment(endComparisonDate).format('yyyy/MM/DD') : endComparisonDate,
      } as FilterTableAnalysisModel;
      revenueAnalysisService
        .getTableAnalysis(filter)
        .then((result) => {
          result.length > 0
            ? setDisableExport(false)
            : setDisableExport(true);
          result.map((item, index) => {
            item.index = index + 1;
          });
          setTableAnalysisList(result);
          let filename =
            startDate &&
            endDate &&
            moment(startDate).format(t("dateFormatString")) +
                " - " +
                moment(endDate).format(t("dateFormatString"))
             + 
              (compareWith ? (
                startComparisonDate &&
                endComparisonDate && (t("revenue.tableAnalysis.compare") +
                  moment(startComparisonDate).format(t("dateFormatString")) +
                      " - " +
                      moment(endComparisonDate).format(t("dateFormatString"))
                  ))
                 : "");
          setFilename(filename);
        })
        .catch((e) => {
          toast.error(t("errorMessage"));
        });
    } catch (e: any) {}
  };

  const clearDate = () => {
    setStartDate(startDateDefault);
    setEndDate(new Date());
    setCompareWith(false);
    setStartComparisonDate(null);
    setEndComparisonDate(null);
    getTableAnalysis(true);
  };
  return (
    <>
      <HeaderContent
        title={t("revenue.tableAnalysis.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.goBack()}
      />
      <div className={styles.content}>
        <div className={styles.tab_header}>
          <div
            className={`${styles.tab_item}  ${
              analysisType == AnalysisType.Product
                ? `border_category_active`
                : null
            }`}
            onClick={() => setAnalysisType(AnalysisType.Product)}
          >
            <p
              className={`${styles.text_tab}  ${
                analysisType == AnalysisType.Product
                  ? `text_category_active`
                  : null
              }`}
            >
              {t("revenue.tableAnalysis.tabProduct")}
            </p>
          </div>
          <div
            className={`${styles.tab_item}  ${
              analysisType == AnalysisType.Category
                ? `border_category_active`
                : null
            }`}
            onClick={() => setAnalysisType(AnalysisType.Category)}
          >
            <p
              className={`${styles.text_tab}  ${
                analysisType == AnalysisType.Category
                  ? `text_category_active`
                  : null
              }`}
            >
              {t("revenue.tableAnalysis.tabCategory")}
            </p>
          </div>
        </div>
        <div>
          <div className={styles.condition_group}>
            <div>
              <div>
                <p className="text_title">
                  {t("revenue.tableAnalysis.period")}
                </p>
                <div className={styles.date_group}>
                  <div className={`${styles.date} text_color_date`}>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        date && setStartDate(date);
                        setShowMessage(false);
                      }}
                      locale={t("lang")}
                      dateFormat={t("dateFormat")}
                      maxDate={new Date("2999-12-31")}
                    />
                  </div>
                  <span className={styles.symbol}>〜</span>
                  <div className={`${styles.date} text_color_date`}>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        date && setEndDate(date);
                        setShowMessage(false);
                      }}
                      locale={t("lang")}
                      dateFormat={t("dateFormat")}
                      maxDate={new Date("2999-12-31")}
                    />
                  </div>
                </div>
                {showMessage && (
                  <p className={styles.validation_message}>
                    {t("validation.endDateGreaterStartDate")}
                  </p>
                )}
              </div>
              <div className="mt_24 mb_24">
                <label>
                  <input
                    type="checkbox"
                    name="option_item1"
                    value="css"
                    checked={compareWith}
                    onChange={() => setCompareWith(!compareWith)}
                  />
                  <span className={styles.text_radio}>
                    {t("revenue.tableAnalysis.comparison")}
                  </span>
                </label>
              </div>
              {compareWith && (
                <div>
                  <p className="text_title">
                    {t("revenue.tableAnalysis.compareWith")}
                  </p>
                  <div className={styles.date_group}>
                    <div className={`${styles.date} text_color_date`}>
                      <DatePicker
                        selected={startComparisonDate}
                        onChange={(date) => {
                          setStartComparisonDate(date);
                          setShowMessageCompare(false);
                        }}
                        locale={t("lang")}
                        dateFormat={t("dateFormat")}
                        maxDate={new Date("2999-12-31")}
                        placeholderText={t("datePlaceHolder")}
                      />
                    </div>
                    <span className={styles.symbol}>〜</span>
                    <div className={`${styles.date} text_color_date`}>
                      <DatePicker
                        selected={endComparisonDate}
                        onChange={(date) => {
                          setEndComparisonDate(date);
                          setShowMessageCompare(false);
                        }}
                        locale={t("lang")}
                        dateFormat={t("dateFormat")}
                        maxDate={new Date("2999-12-31")}
                        placeholderText={t("datePlaceHolder")}
                      />
                    </div>
                  </div>
                  {showMessageCompare && (
                    <p className={styles.validation_message}>
                      {startComparisonDate == null || endComparisonDate == null
                        ? t("validation.required", {
                            field: t("revenue.tableAnalysis.compareWith"),
                          })
                        : t("validation.endDateGreaterStartDate")}
                    </p>
                  )}
                </div>
              )}
              <div className={styles.group_button}>
                <button
                  className={`btn_white mr_4`}
                  onClick={() => clearDate()}
                >
                  {t("revenue.tableAnalysis.clear")}
                </button>
                <button
                  className={`btn_sub ml_4`}
                  onClick={() => getTableAnalysis(false)}
                >
                  {t("revenue.tableAnalysis.apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.table_group}>
          <p className="text_title ml_12">{t("revenue.tableAnalysis.table")}</p>
          <div className={styles.table_analysis}>
            {tableAnalysisList?.length == 0 ? (
              <p className={styles.no_data}>
                {t("revenue.tableAnalysis.noData")}
              </p>
            ) : (
              <Table responsive="sm" bordered hover borderless>
                <thead className={styles.header}>
                  <tr>
                    <th className={styles.col_index}>
                      {t("revenue.tableAnalysis.index")}
                    </th>
                    <th className={styles.col_name}>
                      {analysisType == AnalysisType.Product
                        ? t("revenue.tableAnalysis.nameProduct")
                        : t("revenue.tableAnalysis.nameCategory")}
                    </th>
                    <th className={styles.col}>
                      {t("revenue.tableAnalysis.sales")}
                    </th>
                    <th className={styles.col}>
                      {t("revenue.tableAnalysis.amountIncreaseOrDecrease")}
                    </th>
                    <th className={styles.col}>
                      {t("revenue.tableAnalysis.growthRate")}
                    </th>
                  </tr>
                </thead>
                <tbody className={styles.table_body}>
                  {tableAnalysisList &&
                    tableAnalysisList.map((item, index, e) => (
                      <tr key={index}>
                        <td className={styles.col_index}>{item.index}</td>
                        <td className={styles.product_name}>{item.name}</td>
                        <td className={styles.col_money}>
                          {item.sales.toLocaleString(LOCALE, OPTION_CURRENCY)}
                        </td>
                        <td
                          className={`${styles.col_money} ${
                            item.amountIncreaseOrDecrease < 0 && styles.price
                          }`}
                        >
                          {item.amountIncreaseOrDecrease.toLocaleString(
                            LOCALE,
                            OPTION_CURRENCY
                          )}
                        </td>
                        <td
                          className={`${styles.col_money} ${
                            item.growthRate && item.growthRate < 0 && styles.price
                          }`}
                        >
                          {item.growthRate !== null
                            ? item.growthRate?.toLocaleString(
                                LOCALE,
                                OPTION_CURRENCY
                              ) + "%"
                            : "ー"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
        <div className={`${styles.form_group} ${styles.form_button}`}>
          {tableAnalysisList && (
            <CSVLink
              data={tableAnalysisList}
              filename={filename}
              target="_blank"
              headers={[
                { label: t("revenue.tableAnalysis.index"), key: "index" },
                {
                  label:
                    analysisType == AnalysisType.Product
                      ? t("revenue.tableAnalysis.nameProduct")
                      : t("revenue.tableAnalysis.nameCategory"),
                  key: "name",
                },
                { label: t("revenue.tableAnalysis.sales"), key: "sales" },
                {
                  label: t("revenue.tableAnalysis.amountIncreaseOrDecrease"),
                  key: "amountIncreaseOrDecrease",
                },
                {
                  label: t("revenue.tableAnalysis.growthRate"),
                  key: "growthRate",
                },
              ]}
            >
              <button
                className={`btn_main ${
                  disableExport && styles.btn_disable_export
                }`}
                disabled={disableExport}
              >
                {t("revenue.tableAnalysis.exportCSV")}
              </button>
            </CSVLink>
          )}
        </div>
      </div>
    </>
  );
};
export default TableAnalysis;
