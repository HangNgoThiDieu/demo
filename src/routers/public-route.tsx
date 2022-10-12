import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route } from "react-router-dom";
import { tokenHelper } from "utils/store-token";
import PublicLayout from "../layouts/public";

const PublicRoute = ({ component: Component, restricted,isShowHeader= true, isSetPW=false, ...rest }: any) => {
  const {t} = useTranslation();
  
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        tokenHelper.isAuth() && restricted ? (
          <Redirect to="/" />
        ) : (
          <PublicLayout isShowHeader={isShowHeader}>
            <Suspense fallback={<div>{t("loading")}</div>}>
              <Component {...props} isSetPW={isSetPW} />
            </Suspense>
          </PublicLayout>
        )
      }
    />
  );
};

export default PublicRoute;
