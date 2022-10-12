import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import HeaderContent from "components/commons/header-content";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useParams } from "react-router-dom";
import { tableService } from "services/table.service";
import { TableDetailResult } from "types/results/table/table-detail.result";
import TransactionList from "components/commons/transactions";
import Select from "components/commons/select";
import { FilterTransactionsModel } from "types/models/filter-transactions.model";
import GroupsButtonBottom from "components/commons/group-button-bottom";
import { transactionService } from "services/transaction.service";
import QRCodeModal from "components/modals/qr-code";
import { IssuanceTransactionResult } from "types/results/transaction/issuance-transaction.result";
import Print from "components/commons/print";
import { useReactToPrint } from "react-to-print";
import { CURRENCY_UNITS, TransactionStatusList } from "utils/constants";
import { tokenHelper } from "utils/store-token";
import { useLoadingContext } from "context/loading";

const TableDetail: React.FC = (props: any) => {
  interface TableDetailParams {
    id: number;
  }
  const params = useParams();
  const { id } = params as TableDetailParams;
  const { t } = useTranslation();
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();
  const [tableDetail, setTableDetail] = useState<TableDetailResult>();
  const [filterTransactionStatus, setFilterTransactionStatus] =
    useState<FilterTransactionsModel>({});
  const [openModal, setOpenModal] = useState(false);
  const [transactionAdd, setTransactionAdd] =
    useState<IssuanceTransactionResult>();
  const componentRef = useRef(null);
  const [openPrint, setOpenPrint] = useState(false);
  const [unitPrice, setUnitPrice] = useState<string>();

  const getTableDetail = () => {
    tableService
      .getTableDetail(id, filterTransactionStatus)
      .then((result) => {
        setTableDetail(result);
        hideLoading();
      })
      .catch((err) => {
        hideLoading();
      });
  };

  const handleChange = (e: any) => {
    setFilterTransactionStatus({
      ...filterTransactionStatus,
      transactionStatus: e.target.value,
    });
  };

  useEffect(() => {
    showLoading();
    getTableDetail();
  }, [filterTransactionStatus]);

  const issuanceTransaction = (showModal: boolean) => {
    transactionService
      .issuanceTransaction(id)
      .then((result) => {
        if (showModal) {
          setOpenPrint(true);
          setOpenModal(true);
          setTransactionAdd(result);
          handlePrint();
        } 
          getTableDetail();
      })
      .catch((err) => {
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenPrint(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
  }, [])

  return (
    <div className={styles.table_detail}>
      <HeaderContent
        title={t("table.detail.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.push('/table')}
      ></HeaderContent>
      <div className={styles.filter}>
        <Select data={TransactionStatusList} onChange={handleChange}></Select>
        <label className={`text_title break_word ${styles.name_table}`}>
          {tableDetail?.name}
        </label>
      </div>
      <div className={styles.transaction_list}>
        <TransactionList transactions={tableDetail?.transactions} unitPrice={unitPrice} />
      </div>
      <GroupsButtonBottom
        textButtonLeft={t("table.detail.issue")}
        textButtonRight={t("table.detail.issuePrint")}
        handleButtonLeft={() => issuanceTransaction(false)}
        handleButtonRight={() => issuanceTransaction(true)}
      />
      <QRCodeModal
        open={openModal}
        transaction={transactionAdd}
        handleCloseModal={() => handleCloseModal()}
      />
      <div className="display_none">
        <div ref={componentRef}>
          <Print isQRCodeImage={openPrint} transaction={transactionAdd}></Print>
        </div>
      </div>
    </div>
  );
};

export default TableDetail;
