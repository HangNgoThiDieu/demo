import React, { useEffect, useState } from "react";
import Header from "../header";
import { useAuth } from "../../context/auth";
import Sider from "layouts/sider";
import styles from "./index.module.scss";
import { storeSettingService } from "services/store.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { tokenHelper } from "utils/store-token";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { ACCESS_TOKEN, LOGOUT } from "utils";
import NotifyModal from "components/modals/notify";

interface StoreProps {
  logoSetter?: any
}

const StoreContext = React.createContext<StoreProps>({} as StoreProps);

const AdminLayout = ({ children }: any) => {
  const [open, setOpen] = React.useState(false);
  const {user, signOut} = useAuth();
  const [logo, setLogo] = useState<string>("");
  const { t } = useTranslation();
  const history = useHistory();
  const { accessToken } = tokenHelper.getTokenFromStorage();
  const [connectionAdmin, setConnectionAdmin] = useState<HubConnection>();
  const [connectionUser, setConnectionUser] = useState<HubConnection>();
  const [showMessage, setShowMessage] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const auth = tokenHelper.getToken(ACCESS_TOKEN);

  const handleOpen = () => {
    setOpen(true);
    document.body.classList.add(styles.menu_active);
  };
  const handleClose = () => {
    document.body.classList.remove(styles.menu_active);
    setOpen(false);
  };

  const removeScrollHidden = () => {
    document.body.classList.remove(styles.menu_active);
  }

  const singOut = async () => {
 
    setShowMessage(false);
    setErrorMessage("");
    await signOut();
    history.push(`${LOGOUT}`);
  }

  useEffect(() => {
    // connect admin
    const newConnectionAdmin = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_ADMIN_URL}admin/suspend?comId=${auth?.companyId}`, 
                { accessTokenFactory: () =>  accessToken})
      .withAutomaticReconnect()
      .build();

    setConnectionAdmin(newConnectionAdmin);

    // connect store - user
    const newConnectionUser = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}user/suspend?userId=${auth?.userId}`,
                { accessTokenFactory: () =>  accessToken })
      .withAutomaticReconnect()
      .build();

    setConnectionUser(newConnectionUser);
  }, []);

  useEffect(() => {
    if (connectionAdmin) {
      connectionAdmin
        .start()
        .then((result) => {
          connectionAdmin.on("admin/suspend", async (message) => {
            // await signOut();
            // history.push(`${LOGOUT}`);
            // toast.error(t("login.companySuspended"));
            setShowMessage(true);
            setErrorMessage(t("login.companySuspended"));
          });
        })
        .catch((e) => {});
    }
  }, [connectionAdmin]);

  useEffect(() => {
    if (connectionUser) {
      connectionUser
        .start()
        .then(() => {
          connectionUser.invoke("getconnectionid")
        })
        .then((result) => {
          connectionUser.on("user/suspend", async (message) => {
            // await signOut();
            // history.push(`${LOGOUT}`);
            // toast.error(t("login.accountSuspended"));
            setShowMessage(true);
            setErrorMessage(t("login.accountSuspended"));
          });
        })
        .catch((e) => {});
    }
  }, [connectionUser])

  useEffect(() => {
    const getLogo = () => {
      storeSettingService.getStoreLogo().then((result) => {
        setLogo(result);
      })
      .catch((e) => {
        toast.error(t("validation.errorMessage"));
      })
    }

    getLogo();
  }, [logo]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [history.location.pathname]);

  const storeContext = React.useMemo(
    () => ({
      logoSetter: setLogo
    }),
    [],
  );

  return (
   <>
   <div>
      <Header onOpen={handleOpen} title={user?.fullname ?? ''} logo={logo} handle={() => history.push(`/account/${user?.userId}`)} isMenu={true}/>
      <Sider open={open} onClose={handleClose} removeScrollHidden={removeScrollHidden}></Sider>
      <main className="pt_52">
        {showMessage && (
          <NotifyModal
          open={showMessage}
          message={errorMessage}
          textButton={t("close")}
          handleCloseModal={() => singOut()}
        />
        )}
        <StoreContext.Provider value={storeContext}>{children}</StoreContext.Provider>
      </main>
    </div>
   </>
  );
};
export default AdminLayout;

export const useStoreContext = () => React.useContext<StoreProps>(StoreContext);