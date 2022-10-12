import HeaderContent from "components/commons/header-content";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { tableService } from "services/table.service";
import { TableSettingResult } from "types/results/table/table-setting.result";
import styles from "./index.module.scss";
import TableList from "components/commons/table-list";
import TableModal from "components/modals/table";
import { TableEditModel } from "types/models/table-setting/table-edit.model";
import ConfirmModal from "components/modals/confirm";
import { TableAddModel } from "types/models/table-setting/table-add.model";
import NotifyModal from "components/modals/notify";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { TableStatusResponse } from "utils/enums";
import IconAdd from "assets/images/icon_add.svg";
import { settingService } from "services/setting.service";
import { useLoadingContext } from "context/loading";

const TableSetting = () => {
  const { t } = useTranslation();
  const [listTable, setListTable] = useState<TableSettingResult[]>();
  const [btnLeft] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [subTitlle, setSubTitle] = useState<string>("");
  const [tableId, setTableId] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [tableEdit, setTableEdit] = useState<TableEditModel>();
  const [isAdd, setIsAdd] = useState(false);
  const [tableAdd, setTableAdd] = useState<TableAddModel>();
  const [messageNotify, setMessageNotify] = useState<string>("");
  const [openNotify, setOpenNotify] = useState(false);
  const history = useHistory();
  const [tableName, setTableName] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEnableSeat, setIsEnableSeat] = useState<boolean>(false);
  const { showLoading, hideLoading } = useLoadingContext();
  const [isSubmitDelete, setIsSubmitDelete] = useState(false);

  const getListTable = async () => {
    try {
      const result = await tableService.getTableSettingList();
      setListTable(result);
      hideLoading();
    } catch (e: any) {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    }
  };

  const handleOpenDelete = (id: number, name: string) => {
    setTableId(id);
    setTableName(name);
    setSubTitle(t("tableSetting.delete.subTitleModalDelete", { name: name }));
    setOpenModalDelete(true);
  };

  const handleOpenEdit = (id: number, name: string, listSeat: TableSettingResult[]) => {
    const table = {
      id: id,
      name: name,
      listSeat: listSeat
    } as TableEditModel;
    setIsAdd(false);
    setTableEdit(table);
    setOpenModal(true);
  };

  const handleEventDelete = (id?: number, name?: string) => {
    if (!isSubmitDelete) {
      setIsSubmitDelete(true);
      id &&
      name &&
      tableService
        .deleteTable(id)
        .then(() => {
          setIsSubmitDelete(false);
          setOpenModalDelete(false);
          setListTable((data) => data && data.filter((item) => item.id !== id));
          setMessageNotify(
            t("tableSetting.delete.notifySuccess", { name: name })
          );
          setOpenNotify(true);
        })
        .catch((error) => {
          setIsSubmitDelete(false);
          if (error.errorCode == TableStatusResponse.IsUsing) {
            toast.error(t("tableSetting.delete.isUsing"));
          }
          else {
            toast.error(t("validation.errorMessage"));
          }
          setOpenModalDelete(false);
        });
    }
  };

  const handleEventTable = (data: any) => {
    if(!isSubmit) {
      setIsSubmit(true);
      if (isAdd) {
        tableService
          .addTable(data)
          .then(() => {
            setOpenModal(false);
            getListTable();
            setMessageNotify(
              t("tableSetting.add.notifySuccess", { name: data.name })
            );
            setOpenNotify(true);
            setIsSubmit(false);
          })
          .catch((e) => {
            setIsSubmit(false);
            switch (e.errorCode) {
              case TableStatusResponse.DuplicatedTableName:
                toast.error(t("tableSetting.error.duplicateTableName"));
                break;
  
              default:
                toast.error(t("validation.errorMessage"));
                break;
            }
          });
      } else {
        tableService
          .editTable(data)
          .then(() => {
            setOpenModal(false);
            
            getListTable();
            setMessageNotify(
              t("tableSetting.edit.notifySuccess", { name: data.name })
            );
            setOpenNotify(true);
            setIsSubmit(false);
          })
          .catch((e) => {
            setIsSubmit(false);
            switch (e.errorCode) {
              case TableStatusResponse.DuplicatedTableName:
                toast.error(t("tableSetting.error.duplicateTableName"));
                break;
              case TableStatusResponse.DuplicatedSeatName:
                toast.error(t("tableSetting.error.duplicatedSeatName"));
                break;
              case TableStatusResponse.NotFound:
                toast.error(t("tableSetting.error.tableNotFound"));
                break;
              default:
                toast.error(t("validation.errorMessage"));
                break;
            }
          });
      }
    }
  };

  const onOpenAdd = () => {
    const table = {
      name: "",
    } as TableAddModel;
    setTableAdd(table);
    setIsAdd(true);
    setOpenModal(true);
  };

  const onClose = () => {
    setOpenModal(false);
    setIsAdd(false);
  };

  const closeNotify = () => {
    setOpenNotify(false);
    setOpenModal(false);
    setIsAdd(false);
  };

  const getSeat = () => {
    settingService.getSeat().then((result) => {
      setIsEnableSeat(result.isEnableSeat);
    }).catch((e) => {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    })
  };

  useEffect(() => {
    showLoading();
    getSeat();
    getListTable();
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <HeaderContent
          title={t("tableSetting.title")}
          isBtnLeft={btnLeft}
          onBtnLeft={() => history.goBack()}
        ></HeaderContent>
        <div className={styles.content_setting}>
          <div className={styles.table_header}>
            <label className={styles.number_table}>
              {t("table.numberOfTable")}：{listTable && listTable.length}
            </label>
            <button onClick={onOpenAdd} className="btn_add_category">
              <img className="pr_4 icon_add" src={IconAdd} alt="plus"></img>
              {t("tableSetting.add.buttonAdd")}
            </button>
          </div>
          <TableList
            data={listTable}
            isEnableSeat={isEnableSeat}
            openEdit={handleOpenEdit}
            openDelete={handleOpenDelete}
          ></TableList>
        </div>
        <ConfirmModal
          id={tableId}
          name={tableName}
          open={openModalDelete}
          title={t("tableSetting.delete.titleModalDelete")}
          subTitle={subTitlle}
          textButton={t("tableSetting.delete.buttonModalDelete")}
          textCancel={t("cancel")}
          handleEvent={handleEventDelete}
          handleCloseModal={() => setOpenModalDelete(false)}
        ></ConfirmModal>
        {openModal && <TableModal
          isAdd={isAdd}
          open={openModal}
          tableEdit={tableEdit}
          tableAdd={tableAdd}
          isEnableSeat={isEnableSeat}
          title={
            isAdd
              ? t("tableSetting.add.titleAdd")
              : t("tableSetting.edit.titleEdit")
          }
          textButton={
            isAdd
              ? t("tableSetting.add.buttonAddTable")
              : t("tableSetting.edit.buttonEdit")
          }
          handleEventTable={handleEventTable}
          handleCloseModal={onClose}
        ></TableModal>}
        <NotifyModal
          open={openNotify}
          message={messageNotify}
          textButton={t("close")}
          handleCloseModal={closeNotify}
        ></NotifyModal>
      </div>
    </>
  );
};

export default TableSetting;
