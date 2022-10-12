import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchAccountModel } from "types/models/search-account.model";
import { SearchAccountResult } from "types/results/search-account.result";
import { accountService } from "services/account.service";
import IconEdit from "assets/images/icon_edit.svg";
import styles from "./index.module.scss";
import Form from "react-bootstrap/Form";
import Search from "components/commons/search";
import IconTitle from "assets/images/icon_title.svg";
import HeaderContent from "components/commons/header-content";
import { URL } from "utils/index";
import IconTrash from "assets/images/icon_delete.svg";
import ConfirmModal from "components/modals/confirm";
import NotifyModal from "components/modals/notify";
import { Role, UsersStatusResponse } from "utils/enums";
import { toast } from "react-toastify";
import { useAuth } from "context/auth";
import { ADD_ACCOUNT, STORE_ROLES, USER_STATUS } from "utils/constants";
import { StoreRolesResult } from "types/results/account/store-roles.result";
import NoData from "components/commons/no-data";
import { useLoadingContext } from "context/loading";

const Account = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoadingContext();

  const [listAccount, setListAccount] = useState<SearchAccountResult[]>();
  const [filterData, setFilterData] = useState<SearchAccountModel>({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [openNotify, setOpenNotify] = useState(false);
  const [keyWord, setkeyword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<StoreRolesResult[]>();
  const [firstCheck, setFirstCheck] = useState(false);
  const [lastCheck, setLastCheck] = useState(false);
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [validCheck, setValidCheck] = useState(false);
  const [inValidCheck, setInvalidCheck] = useState(false);
  const [status, setStatus] = useState<number>();

  const getListAccount = async () => {
    try {
      const result = await accountService.getListAccount(filterData);
      setListAccount(result);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  const getStoreRoles = async () => {
    try {
      const result = await accountService.getStoreRoles();
      setRoles(result);
    } catch (error) {}
  };

  const handleDeleteAccount = (userId: string) => {
    accountService
      .deleteAccount(userId)
      .then((rs) => {
        setOpenNotify(true);
        setIsDeleteModal(false);
        getListAccount();
      })
      .catch((err) => {
        setIsDeleteModal(false);
        if (err.errorCode === UsersStatusResponse.IsLogined) {
          toast.error(t("account.delete.errors.notDelete"));
        } else {
          toast.error(t("validation.errorMessage"));
        }
      });
  };

  const onSubmitSearch = (e: any) => {
    e.preventDefault();
    setFilterData({
      ...filterData,
      searchRoleId: roleId,
      searchName: keyWord,
      status: status
    });
  };

  const handleChangeRoles = (value: any) => {
    setRoleId(value);
  };

  const handleToggleFirst = (e: any) => {
    const state = e.target.checked;

    if (state && !firstCheck) {
      setFirstCheck(!firstCheck);
      setLastCheck(false);
      setRoleId(e.target.value);
    } else {
      setFirstCheck(false);
      setLastCheck(false);
      setRoleId("");
    }
  };

  const handleToggleLast = (e: any) => {
    const state = e.target.checked;

    if (state && !lastCheck) {
      setFirstCheck(false);
      setLastCheck(!lastCheck);
      setRoleId(e.target.value);
    } else {
      setFirstCheck(false);
      setLastCheck(false);
      setRoleId("");
    }
  };

  const handleToggleValid = (e: any) => {
    const state = e.target.checked;

    if (state && !validCheck) {
      setValidCheck(!validCheck);
      setInvalidCheck(false);
      setStatus(e.target.value);
    } else {
      setValidCheck(false);
      setInvalidCheck(false);
      setStatus(undefined);
    }
  };

  const handleToggleInValid = (e: any) => {
    const state = e.target.checked;

    if (state && !inValidCheck) {
      setValidCheck(false);
      setInvalidCheck(!inValidCheck);
      setStatus(e.target.value);
    } else {
      setValidCheck(false);
      setInvalidCheck(false);
      setStatus(undefined);
    }
  };

  const getHeight = () => {
    if (elementRef && elementRef.current && elementRef.current.clientHeight) {
      setHeightBtn(elementRef?.current?.clientHeight + 1);
    }
  };

  useEffect(() => {
    getHeight();
  }, []);

  useEffect(() => {
    getStoreRoles();
  }, []);

  useEffect(() => {
    showLoading();
    getListAccount();
  }, [filterData]);

  return (
    <>
      <div className={styles.content_account}>
        <HeaderContent
          title={t("account.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        />
        <div className={styles.box_search}>
          <Form onSubmit={onSubmitSearch} autoComplete="off">
            <Form.Group className={styles.form_group}>
              <img src={IconTitle} alt="" />
              <Form.Label className={styles.title_search}>
                {t("account.titleSearch")}
              </Form.Label>
              <Search
                name="SearchName"
                onChange={(e: any) => setkeyword(e.target.value)}
                handleSearchIcon={onSubmitSearch}
              />
            </Form.Group>
            {/* filter status of the user */}
            <Form.Group className={styles.form_group}>
              <img src={IconTitle} alt="" />
              <Form.Label className={styles.title_search}>
                {t("account.titleStatus")}
              </Form.Label>
              <Form.Check>
                <div className={styles.radio}>
                  <div className={`form-group ${styles.form_input}`}>
                    <label className={styles.mr_24}>
                      <input
                        type="radio"
                        name="status"
                        value={USER_STATUS.Valid}
                        checked={validCheck}
                        onChange={(e: any) => setStatus(e.target.value)}
                        onClick={(e) => handleToggleValid(e)}
                      />
                      <span className={styles.text_radio}>
                        {t("account.valid")}
                      </span>
                    </label>
                    <label className={styles.mr_24}>
                      <input
                        type="radio"
                        name="status"
                        value={USER_STATUS.InValid}
                        checked={inValidCheck}
                        onChange={(e: any) => setStatus(e.target.value)}
                        onClick={(e) =>handleToggleInValid(e)}
                      />
                      <span className={styles.text_radio}>
                        {t("account.invalid")}
                      </span>
                    </label>
                  </div>
                </div>
              </Form.Check>
            </Form.Group>
            
            {/* filter role of the user */}
            <Form.Group className={styles.form_group}>
              <img src={IconTitle} alt="" />
              <Form.Label className={styles.title_search}>
                {t("account.titleRole")}
              </Form.Label>
              <Form.Check>
                <div className={styles.radio}>
                  <div className={`form-group ${styles.form_input}`}>
                    {roles &&
                      roles.map((role, index) => (
                        <label
                          key={index}
                          className={index == 0 ? styles.mr_24 : ""}
                        >
                          {/* this code block is suitable when the system has 2 roles */}
                          <input
                            type="radio"
                            name="roleName"
                            value={role.id}
                            checked={index == 0 ? firstCheck : lastCheck}
                            onChange={(e: any) =>
                              handleChangeRoles(e.target.value)
                            }
                            onClick={(e) =>
                              index == 0
                                ? handleToggleFirst(e)
                                : handleToggleLast(e)
                            }
                          />
                          <span className={styles.text_radio}>
                            {role.name === STORE_ROLES.Staff
                              ? t("account.staff")
                              : t("account.storeManager")}
                          </span>
                          {/* end comments */}
                        </label>
                      ))}
                  </div>
                </div>
              </Form.Check>
            </Form.Group>

            <Form.Group className="mb_24">
              <button type="submit" className="btn_sub">
                {t("account.buttonSearch")}
              </button>
            </Form.Group>
          </Form>
        </div>
        <div className={styles.main_account}>
          <ul>
            {listAccount &&
              listAccount.length > 0 &&
              listAccount?.map((item, index) => (
                <li key={index}>
                  <Link to={`${URL.ACCOUNT_DETAIL}/${item.id}`}>
                    <span className="text_bold_14">
                      {item.role === Role.Staff
                        ? `${t("account.staff")}`
                        : `${t("account.storeManager")}`}
                    </span>{" "}
                    <br />
                    <span className="text_16">{item.fullName}</span>
                  </Link>
                  <div className={styles.right_account}>
                    {user?.userId !== item.id.toString() ? (
                      <button
                        onClick={() => [
                          setIsDeleteModal(true),
                          setUserId(item.id),
                          setUserName(item.fullName),
                        ]}
                        className={`${styles.btn_delete} item_delete mb_8`}
                      >
                        <img
                          className={styles.image_delete}
                          src={IconTrash}
                          alt="iconDelete"
                        ></img>
                      </button>
                    ) : null}
                    <button
                      onClick={() =>
                        history.push(`${URL.EDIT_ACCOUNT}${item.id}`)
                      }
                      className="item_edit"
                    >
                      <img
                        className={styles.image_edit}
                        src={IconEdit}
                        alt="iconEdit"
                      ></img>
                    </button>
                  </div>
                </li>
              ))}
            {listAccount && listAccount.length < 1 && <NoData />}
          </ul>
        </div>
        <div style={{ height: heightBtn }}></div>
        <div className={styles.form_button} ref={elementRef}>
          <Link to={`${ADD_ACCOUNT}`}>
            <button className={`btn_main ${styles.btn_add_account}`}>
              {t("account.buttonAddAccount")}
            </button>
          </Link>
        </div>
        {isDeleteModal && (
          <ConfirmModal
            id={userId}
            open={isDeleteModal}
            title={t("account.delete.title")}
            subTitle={t("account.delete.confirmText", { name: userName })}
            textButton={t("account.delete.modal.btnDelete")}
            textCancel={t("cancel")}
            handleEvent={() => handleDeleteAccount(userId.toString())}
            handleCloseModal={() => setIsDeleteModal(false)}
          />
        )}
        {openNotify && (
          <NotifyModal
            open={openNotify}
            message={t("account.delete.successMessage", { name: userName })}
            title={""}
            textButton={t("close")}
            handleCloseModal={() => setOpenNotify(false)}
          ></NotifyModal>
        )}
      </div>
    </>
  );
};
export default Account;
