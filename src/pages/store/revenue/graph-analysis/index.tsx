import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeaderContent from "components/commons/header-content";
import styles from "./index.module.scss";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CURRENCY_UNITS, LOCALE, OPTION_CURRENCY } from "utils/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { FilterGraphAnalysisModel } from "types/models/revenue/filter-graph-analysis.model";
import { revenueAnalysisService } from "services/revenue-analysis.service";
import { GraphAnalysisResult } from "types/results/revenue/graph-analysis.result";
import { toBrowserTime } from "utils/datetime";
import { AnalysisType } from "utils/enums";
import { tokenHelper } from "utils/store-token";
import moment from "moment";

const GraphAnalysis = () => {
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
  const [graphAnalysisList, setGraphAnalysisList] =
    useState<GraphAnalysisResult[]>();
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showMessageCompare, setShowMessageCompare] = useState<boolean>(false);
  const [dateStr, setDateStr] = useState<string>();
  const [dateComparisonStr, setDateComparitioStr] = useState<string>();
  const [unitPrice, setUnitPrice] = useState<string>();

  useEffect(() => {
    getGraphAnalysis(false);
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
  const getGraphAnalysis = async (isClear: boolean) => {
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
      } as FilterGraphAnalysisModel;
      revenueAnalysisService
        .getGraphAnalysis(filter)
        .then((result) => {
          setShowComparison(compareWith);
          startDate &&
            endDate &&
            setDateStr(
              moment(startDate).format(t("dateFormatString")) +
                  " - " +
                  moment(endDate).format(t("dateFormatString"))
            );
          compareWith &&
            startComparisonDate &&
            endComparisonDate &&
            setDateComparitioStr(
              moment(startComparisonDate).format(t("dateFormatString")) +
                  " - " +
                  moment(endComparisonDate).format(t("dateFormatString"))
            );
          setGraphAnalysisList(result);
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
    getGraphAnalysis(true);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip_label}>
          <p className={styles.tooltip_title}>{label}</p>
          <p className={styles.tooltip_title}>
            {dateStr} :{" "}
            {`${payload[0].value.toLocaleString(LOCALE, OPTION_CURRENCY)}`}
            {t("unitPrice", {unitPrice: unitPrice})}
          </p>
          {showComparison && (
            <p className={styles.tooltip_title}>
              {dateComparisonStr} :{" "}
              {`${payload[1].value.toLocaleString(LOCALE, OPTION_CURRENCY)}`}
              {t("unitPrice", {unitPrice: unitPrice})}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  const CustomizedTickY = ({
    x,
    y,
    stroke,
    payload,
    isCustom = false,
    offesetY = 0,
    offesetX = 0,
  }: any) => {
    return (
      <g transform={`translate(${x + offesetX},${y + offesetY})`}>
        <text textAnchor="middle" className="text_graph">
          {(payload.value/1000).toLocaleString(LOCALE, OPTION_CURRENCY)}
        </text>
      </g>
    );
  };
  const CustomizedTickX = ({
    x,
    y,
    stroke,
    payload,
    offesetY = 0,
    offesetX = 0,
  }: any) => {
    return (
      <g transform={`translate(${x + offesetX},${y + offesetY})`}>
        <text className={`text_graph ${styles.rotate}`}>
          {payload.value}
        </text>
      </g>
    );
  };
  const CustomizedLabel = ({}: any) => {
    return (
      <g transform={`translate(10,35)`}>
        <text textAnchor="left" className="text_graph">
        {t("revenue.labelOfGraph")}
        </text>
      </g>
    );
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
  }, [])
  return (
    <>
      <HeaderContent
        title={t("revenue.graphAnalysis.title")}
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
              {t("revenue.graphAnalysis.tabProduct")}
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
              {t("revenue.graphAnalysis.tabCategory")}
            </p>
          </div>
        </div>
        <div>
          <div className={styles.condition_group}>
            <div>
              <div>
                <p className="text_title">
                  {t("revenue.graphAnalysis.period")}
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
                    {t("revenue.graphAnalysis.comparison")}
                  </span>
                </label>
              </div>
              {compareWith && (
                <div>
                  <p className="text_title">
                    {t("revenue.graphAnalysis.compareWith")}
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
                            field: t("revenue.graphAnalysis.compareWith"),
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
                  {t("revenue.graphAnalysis.clear")}
                </button>
                <button
                  className={`btn_sub ml_4`}
                  onClick={() => getGraphAnalysis(false)}
                >
                  {t("revenue.graphAnalysis.apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.graph_group}>
          <p className="text_title ml_12">{t("revenue.graphAnalysis.graph")}</p>
          <div className={styles.graph}>
            {graphAnalysisList?.length == 0 ? (
              <p className={styles.no_data}>
                {t("revenue.graphAnalysis.noData")}
              </p>
            ) : (
              <>
                <BarChart
                  width={
                    graphAnalysisList && graphAnalysisList?.length > 7
                      ? graphAnalysisList?.length * 50
                      : 400
                  }
                  height={500}
                  data={graphAnalysisList}
                  margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 75,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-270}
                    textAnchor="start"
                    interval={0}
                    tick={<CustomizedTickX offesetX={0} offesetY={5}/>}
                  />
                  <YAxis
                    width={30}
                    label={<CustomizedLabel/>}
                    tick={
                      <CustomizedTickY
                        isCustom={true}
                        offesetX={-15}
                        offesetY={3}
                      />
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ top: -30, left: 20 }} layout={'vertical'} verticalAlign={'middle'} />

                  <Bar
                    name={dateStr}
                    dataKey="sales"
                    fill="#543005"
                    maxBarSize={30}
                  />
                  {showComparison && (
                    <Bar
                      name={dateComparisonStr}
                      dataKey="salesComparision"
                      fill="#DADDDE"
                    />
                  )}
                </BarChart>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default GraphAnalysis;
