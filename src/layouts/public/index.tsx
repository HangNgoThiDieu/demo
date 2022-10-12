import React from "react";
import { useTranslation } from "react-i18next";
import Header from "layouts/header";
import styles from "./index.module.scss";
import { useAuth } from "context/auth";

const PublicLayout = ({ children, isShowHeader }: any) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const {user} = useAuth();
  const handleOpen = () => {
    setOpen(false);
  };

  return (
      <div className={styles.wrapper}>
        {isShowHeader && <Header onOpen={handleOpen} title={isAuthenticated && user ? user?.fullname : t('login.title')}/>}
        <main className={isShowHeader ? styles.main_content : styles.main_no_header}>
          {children}
        </main>
      </div>
   
  );
};
  
export default PublicLayout;