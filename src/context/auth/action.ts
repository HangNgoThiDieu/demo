import { AuthUser } from "../../types";
import { ActionsUnion, createAction, createActionPayload } from "../../utils/action";

export enum AuthAction {
  SignIn = 'SIGN_IN',
  SignUp = 'SIGN_UP',
  SignOut = 'SIGN_OUT',
  RestoreToken = 'RESTORE_TOKEN'
}

export const AuthActions = {
  signIn: createActionPayload<typeof AuthAction.SignIn, {
    user: AuthUser;
  }>(AuthAction.SignIn),
  signOut: createAction<typeof AuthAction.SignOut>(AuthAction.SignOut),
  restoreToken: createActionPayload<typeof AuthAction.RestoreToken, {
    user?: AuthUser;
  }>(AuthAction.RestoreToken)
};

export type AcceptedActions = ActionsUnion<typeof AuthActions>;