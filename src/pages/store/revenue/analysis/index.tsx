import React, { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styles from "./index.module.scss";
import HeaderContent from "components/commons/header-content";
import { useHistory } from "react-router";
import GroupsButtonBottom from "components/commons/group-button-bottom";
import iconBack from "assets/images/icon_back.svg";
import { revenueAnalysisService } from "services/revenue-analysis.service";
import {
  DayRevenueAnalysisResult,
  MonthRevenueAnalysisResult,
} from "types/results/revenue/revenue-analysis.result";
import { CURRENCY_UNITS, DAY_OF_WEEK, LOCALE, MONTH_OF_YEAR, OPTION_CURRENCY, PAYMENT_GATEWAY } from "utils/constants";
import { toBrowserTime } from "utils/datetime";
import DailyRevenueAnalysis from "./day/";
import MonthlyRevenueAnalysis from "./month/";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TodayRevenueGraph from "./today/";
import { DateRevenueGraphResult } from "types/results/revenue/date-revenue.result";
import { tokenHelper } from "utils/store-token";
import moment from "moment";

const RevenueAnalysis = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [dayRevenue, setDayRevenue] = useState<DayRevenueAnalysisResult[]>([]);
  const [monthRevenue, setMonthRevenue] = useState<MonthRevenueAnalysisResult[]>([]);
  const [todayRevenue, setTodayRevenue] = useState<DateRevenueGraphResult[]>([]);
  const now = new Date();
  const width = window.innerWidth;
  const [unitPrice, setUnitPrice] = useState<string>();

  // declare state for graph A
  const [timeOfGraphM, setTimeOfGraphM] = useState(new Date());
  const [filterMonthGraphM, setFilterMonthGraphM] = useState<number>(now.getMonth() + 1);
  const [filterYearGraphM, setFilterYearGraphM] = useState<number>(now.getFullYear());
  const [isDisableGraphM, setIsDisableGraphM] = useState<boolean>(false);
  // end declare state for graph A

  // declare state for graph B
  const [timeOfGraphY, setTimeOfGraphY] = useState(new Date());
  const [filterYearGraphY, setFilterYearGraphY] = useState<number>(now.getFullYear());
  const [isDisableGraphY, setIsDisableGraphY] = useState<boolean>(false);
  // end declare state for graph B

  // declare state for graph C
  const [timeOfGraphD, setTimeOfGraphD] = useState(new Date());
  const [filterDayGraphD, setFilterDayGraphD] = useState<number>(now.getDate());
  const [filterMonthGraphD, setFilterMonthGraphD] = useState<number>(now.getMonth() + 1);
  const [filterYearGraphD, setFilterYearGraphD] = useState<number>(now.getFullYear());
  const [isDisableGraphD, setIsDisableGraphD] = useState<boolean>(false);
  // end declare state for graph C

  const getRevenueAnalysisForMonth = (month: number, year: number) => {
    revenueAnalysisService
      .getRevenueAnalysis(month, year)
      .then((res) => {
        setDayRevenue(res.listDayRevenue);
      })
      .catch((err) => {
        toast.error(t("unexpectedError"));
      });
  };

  const getRevenueAnalysisForYear = (month: number, year: number) => {
    revenueAnalysisService
      .getRevenueAnalysis(month, year)
      .then((res) => {
        setMonthRevenue(res.listMonthRevenue);
      })
      .catch((err) => {
        toast.error(t("unexpectedError"));
      });
  };

  const getDateRevenueGraph = (date: Date) => {
    revenueAnalysisService
      .getDateRevenueGraph(moment(date).format('yyyy/MM/DD'))
      .then((res) => {
        setTodayRevenue(res);
      })
      .catch((err) => {
        toast.error(t("unexpectedError"));
      });
  };
  const formatYAxis = (tickItem: any) => {
    tickItem = tickItem / 1000;
    return tickItem?.toLocaleString(LOCALE, OPTION_CURRENCY);
  };

  const formatMonth = (tickItem: any) => {
    switch (tickItem) {
      case MONTH_OF_YEAR.January:
        tickItem = t("revenue.monthOfYear.jan");
        break;
      case MONTH_OF_YEAR.Febrary:
        tickItem = t("revenue.monthOfYear.feb");
        break;
      case MONTH_OF_YEAR.March:
        tickItem = t("revenue.monthOfYear.mar");
        break;
      case MONTH_OF_YEAR.April:
        tickItem = t("revenue.monthOfYear.apr");
        break;
      case MONTH_OF_YEAR.May:
        tickItem = t("revenue.monthOfYear.may");
        break;
      case MONTH_OF_YEAR.June:
        tickItem = t("revenue.monthOfYear.jun");
        break;
      case MONTH_OF_YEAR.July:
        tickItem = t("revenue.monthOfYear.jul");
        break;
      case MONTH_OF_YEAR.August:
        tickItem = t("revenue.monthOfYear.aug");
        break;
      case MONTH_OF_YEAR.September:
        tickItem = t("revenue.monthOfYear.sep");
        break;
      case MONTH_OF_YEAR.October:
        tickItem = t("revenue.monthOfYear.oct");
        break;
      case MONTH_OF_YEAR.Noveber:
        tickItem = t("revenue.monthOfYear.nov");
        break;
      case MONTH_OF_YEAR.December:
        tickItem = t("revenue.monthOfYear.dec");
        break;
      default:
        tickItem = t("");
    }
    return tickItem;
  };

  const formatDayOfWeek = (tickProps: any) => {
    switch (tickProps) {
      case DAY_OF_WEEK.Sunday:
        tickProps = t("revenue.dayOfWeek.sunday");
        break;
      case DAY_OF_WEEK.Monday:
        tickProps = t("revenue.dayOfWeek.monday");
        break;
      case DAY_OF_WEEK.Tuesday:
        tickProps = t("revenue.dayOfWeek.tuesday");
        break;
      case DAY_OF_WEEK.Wednesday:
        tickProps = t("revenue.dayOfWeek.wednesday");
        break;
      case DAY_OF_WEEK.Thursday:
        tickProps = t("revenue.dayOfWeek.thursday");
        break;
      case DAY_OF_WEEK.Friday:
        tickProps = t("revenue.dayOfWeek.friday");
        break;
      case DAY_OF_WEEK.Saturday:
        tickProps = t("revenue.dayOfWeek.saturday");
        break;
      default:
        tickProps = t("");
    }

    return tickProps;
  };

  const CustomTooltipForGraphA = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip_label}>
          <p className={styles.tooltip_title}>
            {`${toBrowserTime(
              new Date(timeOfGraphM.getFullYear(), timeOfGraphM.getMonth(), payload[0].payload.keyDay),
              t("dateFormatString")
            )} ${formatDayOfWeek(payload[0].payload.keyDayOfWeek)}${t(
              "revenue.dayOfWeek.suffix"
            )}`}
          </p>
          <p className={styles.tooltip_text}>
            {t("revenue.revenueLabel")} :{" "}
            {`${payload[0].value.toLocaleString(LOCALE, OPTION_CURRENCY)}`}
            {t("unitPrice", {unitPrice: unitPrice})}
          </p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipForGraphB = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip_label}>
          <p className={styles.tooltip_title}>
            {`${toBrowserTime(
              new Date(timeOfGraphY.getFullYear(), payload[0].payload.keyMonth - 1),
              t("yearMonthFormatString")
            )}`}
          </p>
          <p className={styles.tooltip_text}>
            {t("revenue.revenueLabel")} :{" "}
            {`${payload[0].value.toLocaleString(LOCALE, OPTION_CURRENCY)}`}
            {t("unitPrice", {unitPrice: unitPrice})}
          </p>
        </div>
      );
    }

    return null;
  };

  const DayCustomizedTickX = ({
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
        <text textAnchor="middle" className="text_6">
          {!isCustom ? payload.value : formatDayOfWeek(payload.value)}
        </text>
      </g>
    );
  };

  const MonthCustomizedTickX = ({
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
          {!isCustom ? payload.value : formatMonth(payload.value)}
        </text>
      </g>
    );
  };

  const DayCustomizedTickY = ({
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
          {!isCustom ? payload.value : formatYAxis(payload.value)}
        </text>
      </g>
    );
  };

  const MonthCustomizedTickY = ({
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
          {!isCustom ? payload.value : formatYAxis(payload.value)}
        </text>
      </g>
    );
  };

  const handlePreviousFilter = (isGraphB: boolean = false) => {
    if (isGraphB) {
      setIsDisableGraphY(false);
      timeOfGraphY.setFullYear(timeOfGraphY.getFullYear() - 1);

      setFilterYearGraphY(timeOfGraphY.getFullYear());
      setTimeOfGraphY(timeOfGraphY);
    }
    else {
      setIsDisableGraphM(false);
      timeOfGraphM.setMonth(timeOfGraphM.getMonth() - 1);

      setFilterYearGraphM(timeOfGraphM.getFullYear());
      setFilterMonthGraphM(timeOfGraphM.getMonth() + 1);
      setTimeOfGraphM(timeOfGraphM);
    }
  }

  const handleNextFilter = (isGraphB: boolean = false) => {
    if (isGraphB) {
      timeOfGraphY.setFullYear(timeOfGraphY.getFullYear() + 1);

      // check condition time to disale button next time
      checkIsDisableNextGraphB(timeOfGraphY);

      setFilterYearGraphY(timeOfGraphY.getFullYear());
      setTimeOfGraphY(timeOfGraphY);
    }
    else {
      timeOfGraphM.setMonth(timeOfGraphM.getMonth() + 1);

      // check condition time to disale button next time
      checkIsDisableNext(timeOfGraphM);

      setFilterYearGraphM(timeOfGraphM.getFullYear());
      setFilterMonthGraphM(timeOfGraphM.getMonth() + 1);
      setTimeOfGraphM(timeOfGraphM);
    }
  }

  const handlePreviousDayFilter = () => {
    setIsDisableGraphD(false);
    timeOfGraphD.setDate(timeOfGraphD.getDate() - 1);
    setFilterYearGraphD(timeOfGraphD.getFullYear());
    setFilterMonthGraphD(timeOfGraphD.getMonth() + 1);
    setFilterDayGraphD(timeOfGraphD.getDate());
    setTimeOfGraphD(timeOfGraphD);
    getDateRevenueGraph(timeOfGraphD);
  }
  const handleNextDayFilter = () => {
    timeOfGraphD.setDate(timeOfGraphD.getDate() + 1);
    // check condition time to disale button next time
    checkIsDisableNextGraphD(timeOfGraphD);

    setFilterYearGraphD(timeOfGraphD.getFullYear());
    setFilterMonthGraphD(timeOfGraphD.getMonth() + 1);
    setFilterDayGraphD(timeOfGraphD.getDate());
    setTimeOfGraphD(timeOfGraphD);
    getDateRevenueGraph(timeOfGraphD);
  }
  const handleChangeFilterGraphD = (date: Date) => {
    checkIsDisableNextGraphD(date);
    setFilterYearGraphD(date.getFullYear());
    setFilterMonthGraphD(date.getMonth() + 1);
    setFilterDayGraphD(date.getDate());
    setTimeOfGraphD(date);
  }
  const paymentMethod = (tickProps: any) => {
    switch (tickProps) {
      case PAYMENT_GATEWAY.Cash:
        tickProps = t("revenue.paymentMethod.cash");
        break;
      case PAYMENT_GATEWAY.Transfer:
        tickProps = t("revenue.paymentMethod.transfer");
        break;
      case PAYMENT_GATEWAY.OnePay:
        tickProps = "OnePay";
        break;
      case PAYMENT_GATEWAY.MoMo:
        tickProps = "MoMo";
        break;
      default:
        tickProps = t("");
    }

    return tickProps;
  };

  const handleChangeFilter = (date: Date, isGraphB: boolean = false) => {
    if (isGraphB) {
      checkIsDisableNextGraphB(date);

      setFilterYearGraphY(date.getFullYear());
      setTimeOfGraphY(date);
    }
    else {
      checkIsDisableNext(date);

      setFilterYearGraphM(date.getFullYear());
      setFilterMonthGraphM(date.getMonth() + 1);
      setTimeOfGraphM(date);
    }
  }

  const checkIsDisableNext = (date: Date) => {
    const nextMonthCompare = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    const nowCompare = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

    if (nextMonthCompare > nowCompare) {
      setIsDisableGraphM(true);
      return;
    }
    else if (nextMonthCompare.getTime() === nowCompare.getTime()) {
      setIsDisableGraphM(true);
    }
    else {
      setIsDisableGraphM(false);
    }
  }

  const checkIsDisableNextGraphB = (date: Date) => {
    const nextYearCompare = new Date(date.getFullYear(), 1, 1, 0, 0, 0);
    const nowCompare = new Date(now.getFullYear(), 1, 1, 0, 0, 0);

    if (nextYearCompare > nowCompare) {
      setIsDisableGraphY(true);
      return;
    }
    else if (nextYearCompare.getTime() === nowCompare.getTime()) {
      setIsDisableGraphY(true);
    }
    else {
      setIsDisableGraphY(false);
    }
  }

  const checkIsDisableNextGraphD = (date: Date) => {
    const nextDayCompare = new Date(date.getFullYear(), date.getMonth(), date.getDay(), 0,0,0)
    const nowCompare = new Date(now.getFullYear(), now.getMonth(), now.getDay(), 0, 0, 0);
    if (nextDayCompare > nowCompare) {
      setIsDisableGraphD(true);
      return;
    }
    else if (nextDayCompare.getTime() === nowCompare.getTime()) {
      setIsDisableGraphD(true);
    }
    else {
      setIsDisableGraphD(false);
    }
  }
  const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => {
    return (
      <p className={styles.text_calendar} onClick={onClick} ref={ref}>
        {value}
      </p>
    );
  });

  useEffect(() => {
    getRevenueAnalysisForMonth(filterMonthGraphM, filterYearGraphM);
  }, [filterMonthGraphM,filterYearGraphM]);

  useEffect(() => {
    getRevenueAnalysisForYear(filterMonthGraphM, filterYearGraphY);
  }, [filterYearGraphY]);

  useEffect(() => {
    checkIsDisableNext(now);
    checkIsDisableNextGraphB(now);
    checkIsDisableNextGraphD(now);
  }, []);

  useEffect(() => {
    getDateRevenueGraph(timeOfGraphD);
  }, [timeOfGraphD]);

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip_label}>
          <p className={styles.tooltip_title}>
            {`${paymentMethod(payload[0].payload.paymentMethod)}`}
          </p>
          <p className={styles.tooltip_text}>
            {t("revenue.revenueLabel")} :{" "}
            {`${payload[0].value.toLocaleString(LOCALE, OPTION_CURRENCY)}`}
            {t("unitPrice", {unitPrice: unitPrice})}
          </p>
        </div>
      );
    }

    return null;
  };
  const CustomizedGraphTickX = ({
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
        <text textAnchor="start" className={`text_graph ${styles.rotate}`}>
         {!isCustom ? payload.value : paymentMethod(payload.value)}
        </text>
      </g>
    );
  };
  const CustomizedGraphTickY = ({
    x,
    y,
    stroke,
    payload,
    offesetY = 0,
    offesetX = 0,
  }: any) => {
    return (
      <g transform={`translate(${x + offesetX},${y + offesetY})`}>
        <text textAnchor="middle" className="text_graph">
        {formatYAxis(payload.value)}
        </text>
      </g>
    );
  };
  const CustomizedLabel = ({}: any) => {
    return (
      <g transform={`translate(10,10)`}>
        <text textAnchor="left" className="text_graph">
        {t("revenue.labelOfGraph")}
        </text>
      </g>
    );
  };

  return (
    <>
      <HeaderContent
        title={t("revenue.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.goBack()}
      />
      <div className={styles.content}>
      <div className={styles.graph_date}>
          <p className="text_title">{t("revenue.graphTodayTitle")}</p>
          <div className={styles.graph_box}>
          <div className={styles.graph_calendar}>
              <button className={styles.btn_calendar} onClick={() => handlePreviousDayFilter()}>
                <img
                  className={styles.icon_back}
                  src={iconBack}
                  alt="iconBack"
                />
              </button>
              <div className={styles.text_calendar}>
                <DatePicker
                  locale={t("lang")}
                  selected={timeOfGraphD}
                  onChange={(date: Date) => handleChangeFilterGraphD(date)}
                  dateFormat={t("dateFormatPicker")}
                  showFullMonthYearPicker
                  maxDate={new Date()}
                  customInput={<CustomInput />}
                />
              </div>
              <button className={styles.btn_calendar} 
                      disabled={isDisableGraphD} 
                      onClick={() => handleNextDayFilter()}>
                <img
                  className={styles.icon_next}
                  src={iconBack}
                  alt="iconNext"
                />
              </button>
            </div>
            <div className={styles.graph}>
              <TodayRevenueGraph
                graphRevenue={todayRevenue}
                CustomTooltip={CustomTooltip}
                CustomizedTickX={CustomizedGraphTickX}
                CustomizedTickY={CustomizedGraphTickY}
                CustomizedLabel ={CustomizedLabel}
                height={width-70}
              />
            </div>
          </div>
        </div>
        <div className={styles.graph_date}>
          <p className="text_title">{t("revenue.graphDateTitle")}</p>
          <div className={styles.graph_box}>
            <div className={styles.graph_calendar}>
              <button
                className={styles.btn_calendar}
                onClick={() => handlePreviousFilter()}
              >
                <img
                  className={styles.icon_back}
                  src={iconBack}
                  alt="iconBack"
                />
              </button>
              <div className={styles.text_calendar}>
                <DatePicker
                  locale={t("lang")}
                  selected={timeOfGraphM}
                  onChange={(date: Date) => handleChangeFilter(date)}
                  dateFormat={t("yearMonthFormatPicker")}
                  showMonthYearPicker
                  maxDate={new Date()}
                  customInput={<CustomInput />}
                />
              </div>
              <button
                className={styles.btn_calendar}
                onClick={() => handleNextFilter()}
                disabled={isDisableGraphM}
              >
                <img
                  className={styles.icon_next}
                  src={iconBack}
                  alt="iconNext"
                />
              </button>
            </div>
            <div className={styles.graph}>
              <DailyRevenueAnalysis
                dayRevenue={dayRevenue}
                CustomTooltip={CustomTooltipForGraphA}
                CustomizedTickX={DayCustomizedTickX}
                CustomizedTickY={DayCustomizedTickY}
                CustomizedLabel ={CustomizedLabel}
                height={width - 100}
              />
            </div>
          </div>
        </div>
        <div className={styles.graph_month}>
          <p className="text_title">{t("revenue.graphMonthTitle")}</p>
          <div className={styles.graph_box}>
            <div className={styles.graph_calendar}>
              <button className={styles.btn_calendar} onClick={() => handlePreviousFilter(true)}>
                <img
                  className={styles.icon_back}
                  src={iconBack}
                  alt="iconBack"
                />
              </button>
              <div className={styles.text_calendar}>
                <DatePicker
                  locale={t("lang")}
                  selected={timeOfGraphY}
                  onChange={(date: Date) => handleChangeFilter(date, true)}
                  dateFormat={t("yearFormatPicker")}
                  showYearPicker
                  maxDate={new Date()}
                  customInput={<CustomInput />}
                />
              </div>
              <button className={styles.btn_calendar} disabled={isDisableGraphY} onClick={() => handleNextFilter(true)}>
                <img
                  className={styles.icon_next}
                  src={iconBack}
                  alt="iconNext"
                />
              </button>
            </div>
            <div className={styles.graph}>
              <MonthlyRevenueAnalysis
                monthRevenue={monthRevenue}
                CustomTooltip={CustomTooltipForGraphB}
                CustomizedTickX={MonthCustomizedTickX}
                CustomizedTickY={MonthCustomizedTickY}
                CustomizedLabel ={CustomizedLabel}
                height={width - 100}
              />
            </div>
          </div>
        </div>
        <div className={styles.div_insert}></div>
        <GroupsButtonBottom
          textButtonLeft={t("revenue.buttonLeft")}
          textButtonRight={t("revenue.buttonRight")}
          handleButtonLeft={() => history.push("/revenue-analysis/table")}
          handleButtonRight={() => history.push("/revenue-analysis/graph")}
        />
      </div>
    </>
  );
};

export default RevenueAnalysis;
