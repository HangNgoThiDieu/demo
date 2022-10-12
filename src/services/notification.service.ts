import Config from "config";
import { NotificationAddUserModel } from "types/models/notification/notification-add-user.model";
import { NotificationAddModel } from "types/models/notification/notification-add.model";
import { NotificationEditUserModel } from "types/models/notification/notification-edit-user.model";
import { NotificationEditModel } from "types/models/notification/notification-edit.model";
import { PagedResult } from "types/paged-result";
import { NotificationDetailResult } from "types/results/notification/notification-detail.result";
import { NotificationListResult } from "types/results/notification/notification-list.result";
import { NotificationUserDetailResult } from "types/results/notification/notification-user-detail.result";
import { NotificationUserResult } from "types/results/notification/user/notification-user.result";
import api from "utils/api";

const getNotificationDetail = async (notificationId: number) => {
  return await api.get<NotificationDetailResult>(
    Config.API_URL.NOTIFICATION_DETAIL(notificationId),
    {}
  );
};

const editNotification = async (model: NotificationEditModel) => {
  return await api.putForm<void>(Config.API_URL.EDIT_NOTIFICATION, model);
};

const getNotificationList = async () => {
  return await api.get<NotificationListResult[]>(
    Config.API_URL.NOTIFICATION_LIST
  );
};

const addNotification = async (model: NotificationAddModel) => {
  return await api.postFormCustom<void>(Config.API_URL.ADD_NOTIFICATION, model);
}

const getNotificationsUserList = async (page: number, pageSize: number) => {
  return await api.post<PagedResult<NotificationUserResult>>(
    Config.API_URL.NOTIFICATIONS_USER_LIST, { page, pageSize }
  );
};

const deleteNotificationUser = async (notificationId: number) => {
  return await api.delete(Config.API_URL.DELETE_NOTIFICATION_USER(notificationId));
}

const addNotificationUser = async (model: NotificationAddUserModel) => {
  return await api.postFormCustom(Config.API_URL.ADD_NOTIFICATION_USER, model);
}

const editNotificationUser = async (model: NotificationEditUserModel) => {
  return await api.putForm(Config.API_URL.EDIT_NOTIFICATION_USER, model);
}

const getNotificationUserById = async (notificationId: number) => {
  return await api.get<NotificationUserDetailResult>(Config.API_URL.GET_NOTIFICATION_USER_BY_ID(notificationId), {});
}

const getNotificationsUserOnTop = async (companyId: number) => {
  return await api.get<NotificationUserResult[]>(Config.API_URL.GET_NOTIFICATIONS_USER_ON_TOP, {companyId: companyId});
}

const getNotificationUserDetail = async (notificationId: number, companyId: number) => {
  return await api.get<NotificationUserDetailResult>(Config.API_URL.GET_NOTIFICATION_USER_DETAIL(notificationId,companyId), {});
}

export const notificationService = {
  getNotificationDetail,
  editNotification,
  getNotificationList,
  addNotification,
  getNotificationsUserList,
  deleteNotificationUser,
  addNotificationUser,
  editNotificationUser,
  getNotificationUserById,
  getNotificationsUserOnTop,
  getNotificationUserDetail
};
