import { AuthUser } from "../../types";
import { AcceptedActions, AuthAction } from "./action";

export interface AuthState {
  isLoading: boolean;
  user?: AuthUser;
}

export const initialState: AuthState = {
  isLoading: true,
};

const authReducer = (state: AuthState, action: AcceptedActions): AuthState => {
  switch (action.type) {
    case AuthAction.SignIn:
      return {
        ...state,
        user: action.payload.user,
      };
    case AuthAction.SignOut: {
      return {
        ...state,
        user: undefined,
      };
    }
    case AuthAction.RestoreToken: {
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
      };
    }

    default:
      return state;
  }
};

export default authReducer;