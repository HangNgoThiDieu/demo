import { lazy, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import NotFoundComponent from "../pages/store/error/page-404";
import ForbiddenComponent from "../pages/store/error/page-403";
import ServerErrorComponent from "../pages/store/error/page-500";

const LoginComponent = lazy(() => import("pages/store/login"));
const EditAccountComponent = lazy(() => import("../pages/store/account/edit"));
const AddAccountComponent = lazy(() => import("pages/store/account/add"));
const AccountComponent = lazy(() => import("pages/store/account"));
const AccountDetailComponent = lazy(() => import("pages/store/account/detail"));
const TopComponent = lazy(() => import("pages/store/top"));


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute component={TopComponent} path="/" exact />
       
        <PrivateRoute component={AccountComponent} path="/account" exact />
       
        <PrivateRoute
          component={AddAccountComponent}
          path="/account/add"
          exact
        />
        <PrivateRoute
          component={AccountDetailComponent}
          path="/account/:userId"
          exact
        />
        <PublicRoute
          restricted={true}
          component={LoginComponent}
          path="/login"
          exact
        />
        <PrivateRoute
          component={EditAccountComponent}
          path="/account/edit/:id"
          exact
        />


       

       

       
       
    

       

    

      

        

      

       

        <PublicRoute
          component={ForbiddenComponent}
          path="/403"
          isShowHeader={false}
          exact
        />

        <PublicRoute
          component={NotFoundComponent}
          path="/404"
          isShowHeader={false}
          exact
        />

        <PublicRoute
          component={ServerErrorComponent}
          path="/500"
          isShowHeader={false}
          exact
        />

        <PublicRoute
          component={NotFoundComponent}
          path="*"
          isShowHeader={false}
          exact
        />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
