import UserLayout from "layouts/user";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route } from "react-router-dom";
import { tokenHelper } from "utils/store-token";
import AdminLayout from "../layouts/admin";

const PrivateRoute = ({ component: Component,requireRoles , ...rest }: any) => {
  const {t} = useTranslation();
  var url = window.location.toString();
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route
      {...rest}
      render={(props: any) =>
        url.includes("/user/") ? (
          <UserLayout>
            <Suspense fallback={<div>{t("loading")}</div>}>
              <Component {...props} />
            </Suspense>
          </UserLayout>
        ) : (
          tokenHelper.isAuth() ? (
            <AdminLayout>
              <Suspense fallback={<div>{t("loading")}</div>}>
                <Component {...props} />
              </Suspense>
            </AdminLayout>
          ) : (
            <Redirect to="/login" />
          )
        )
      }
    />
  );
};

export default PrivateRoute;
