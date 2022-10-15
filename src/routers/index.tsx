import { lazy, Suspense } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./private-route";
import PublicRoute from "./public-route";
import NotFoundComponent from "../pages/store/error/page-404";
import ForbiddenComponent from "../pages/store/error/page-403";
import ServerErrorComponent from "../pages/store/error/page-500";

const LoginComponent = lazy(() => import("pages/store/login"));
const TableComponent = lazy(() => import("pages/store/table"));
const OrderComponent = lazy(() => import("pages/store/order"));
const EditAccountComponent = lazy(() => import("../pages/store/account/edit"));
const AddAccountComponent = lazy(() => import("pages/store/account/add"));
const StoreSettingComponent = lazy(() => import("pages/store/store-setting"));
const AccountComponent = lazy(() => import("pages/store/account"));
const AccountDetailComponent = lazy(() => import("pages/store/account/detail"));
const OrderProductDetailComponent = lazy(
  () => import("pages/store/order/product/detail")
);
const TableSettingComponent = lazy(() => import("pages/store/table/setting"));
const ProductComponent = lazy(() => import("pages/store/product"));
const EditProductComponent = lazy(() => import("../pages/store/product/edit"));
const AddProductComponent = lazy(() => import("../pages/store/product/add"));

// demo
const ProductsDemoComponent = lazy(() => import("pages/store/product-demo"));

const TransactionDetailComponent = lazy(
  () => import("pages/store/transaction/detail")
);
const ProductDetailComponent = lazy(() => import("pages/store/product/detail"));
const TableDetailComponent = lazy(() => import("pages/store/table/detail"));
const CartComponent = lazy(() => import("pages/store/order/cart"));
const SelectProductComponent = lazy(
  () => import("pages/store/order/select-product")
);
const TopComponent = lazy(() => import("pages/store/top"));
const GraphAnalysisComponent = lazy(
  () => import("pages/store/revenue/graph-analysis")
);
const TableAnalysisComponent = lazy(
  () => import("pages/store/revenue/table-analysis")
);
const RevenueAnalysisComponent = lazy(() => import("pages/store/revenue/analysis"));
const ResetPasswordComponent = lazy(() => import("pages/store/reset-password/reset"));
const ForgotPasswordComponent = lazy(() => import("pages/store/reset-password/"));
const DesignSettingComponent = lazy(() => import("pages/store/store-setting/design"));
const PaymentSettingComponent = lazy(() => import("pages/store/store-setting/payment"));
const ChangePasswordComponent = lazy(() => import("pages/store/change-password"));
const SeatSettingComponent = lazy(() => import("pages/store/store-setting/seat"));
const NotificationUserComponent = lazy(() => import("pages/store/notification-user"));
const AddNotificationUserComponent = lazy(() => import("pages/store/notification-user/add"));
const EditNotificationUserComponent = lazy(() => import("pages/store/notification-user/edit"));
const ChangePasswordForStaffComponent = lazy(() => import("pages/store/change-password-staff"));

// user
const UserTopComponent = lazy(() => import("pages/user/top"));
const UserSelectProductComponent = lazy(() => import("pages/user/order/select-product"));
const UserCartComponent = lazy(() => import("pages/user/order/cart"));
const UserOrderHistoryComponent = lazy(() => import("pages/user/order-history"));
const UserPaymentComponent = lazy(() => import("pages/user/payment"));
const NotificationDetailComponent = lazy(() => import("pages/user/notification/detail"));
const ProductDetailUserComponent = lazy(() => import("pages/user/order/product-detail"));
const UserPaymentMoMoResult = lazy(() => import("pages/user/payment/momo-result"));
const UserPaymentOnePayReturn = lazy(() => import("pages/user/payment/onepay-result"));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute component={TopComponent} path="/" exact />
        <PrivateRoute component={TableComponent} path="/table" exact />
        <PrivateRoute component={OrderComponent} path="/order" exact />
        <PrivateRoute
          component={StoreSettingComponent}
          path="/store/setting"
          exact
        />
        <PrivateRoute component={AccountComponent} path="/account" exact />

        <PrivateRoute
          component={TransactionDetailComponent}
          path="/transaction/:transactionId"
          exact
        />
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

        {/* demo */}
        <PrivateRoute
          component={ProductsDemoComponent}
          path="/product-demo"
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

        <PrivateRoute component={ProductComponent} path="/products" exact />

        <PrivateRoute
          component={EditProductComponent}
          path="/product/edit/:id"
          exact
        />

        <PrivateRoute
          component={AddProductComponent}
          path="/product/add"
          exact
        />

        <PrivateRoute
          component={OrderProductDetailComponent}
          path="/order/product-order/:productId"
          exact
        />

        <PrivateRoute
          component={TableSettingComponent}
          path="/table/setting"
          exact
        />
        <PrivateRoute
          component={ProductDetailComponent}
          path="/product/:productId"
          exact
        />
        <PrivateRoute
          component={TableDetailComponent}
          path="/table/:id"
          exact
        />

        <PrivateRoute component={CartComponent} path="/cart/:orderId" exact />

        <PrivateRoute
          component={GraphAnalysisComponent}
          path="/revenue-analysis/graph"
          exact
        />

        <PrivateRoute
          component={TableAnalysisComponent}
          path="/revenue-analysis/table"
          exact
        />

        <PrivateRoute
          component={RevenueAnalysisComponent}
          path="/revenue-analysis"
          exact
        />

        <PrivateRoute
          component={SelectProductComponent}
          path="/transaction/:transactionId/order/select-product"
          exact
        />

        <PrivateRoute
          component={DesignSettingComponent}
          path="/design-setting"
          exact
        />

        <PrivateRoute
          component={PaymentSettingComponent}
          path="/payment-setting"
          exact
        />

        <PrivateRoute
          component={SeatSettingComponent}
          path="/seat-setting"
          exact
        />

        <PrivateRoute
          component={ChangePasswordComponent}
          path="/change-password/:userId"
          exact
        />

        <PublicRoute
          component={ResetPasswordComponent}
          path="/store/reset-password"
          exact
          restricted={true}
          isSetPW={false}
        />

        <PublicRoute
          component={ResetPasswordComponent}
          path="/store/set-password"
          exact
          restricted={true}
          isSetPW={true}
        />

        <PrivateRoute
          component={ChangePasswordForStaffComponent}
          path="/change-password-other/:userId"
          exact
          restricted={true}
        />

        <PublicRoute
          component={ForgotPasswordComponent}
          path="/store/forgot-password"
          exact
        />

        <PrivateRoute
          component={NotificationUserComponent}
          path="/notifications"
          exact
        />

        <PrivateRoute
          component={AddNotificationUserComponent}
          path="/notification/add"
          exact
        />

        <PrivateRoute
          component={EditNotificationUserComponent}
          path="/notification/edit/:notificationId"
          exact
        />

        // USERS
        <PrivateRoute
          component={UserTopComponent}
          path="/user/trans"
          exact
        />

        <PrivateRoute
          component={UserOrderHistoryComponent}
          path="/user/order-history"
          exact
        />

        <PrivateRoute
          component={NotificationDetailComponent}
          path="/user/notification/:notificationId"
          exact
        />
        
        <PrivateRoute
          component={UserPaymentComponent}
          path="/user/payment"
          exact
        />

        <PrivateRoute
          component={UserSelectProductComponent}
          path="/user/transaction/:transactionId/order/select-product"
          exact
        />
        <PrivateRoute component={UserCartComponent} path="/user/cart/:orderId" exact />

        <PrivateRoute
          component={ProductDetailUserComponent}
          path="/user/order/product-order/:productId"
          exact
        />

        <PrivateRoute
          component={UserPaymentMoMoResult}
          path="/user/payment/momo"
          exact
        />

        <PrivateRoute
          component={UserPaymentOnePayReturn}
          path="/user/payment/onepay"
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
