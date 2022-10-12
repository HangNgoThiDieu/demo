import React, { useCallback, useEffect, useState } from 'react';
import authReducer, { initialState } from './reducer';
import { AuthActions } from './action';
import { AuthUser } from '../../types';
import { authService } from '../../services/auth.service';
import { LoginModel } from '../../types/models/login.model';
import { ColorsResult } from 'types/results/colors.result';
import { tokenHelper } from 'utils/store-token';
import { COLORS, CURRENCY_UNITS, CURRENCY_UNIT_DEFAULT, LANGUAGE, TRANSLATE_LIST } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { storeSettingService } from 'services/store.service';

interface AuthProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: AuthUser;
  signIn: (model: LoginModel) => Promise<void>;
  signOut: () => void;
  setter?: any;
}

const AuthContext = React.createContext<AuthProps>({} as AuthProps);

export const AuthProvider = (props: any) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const { accessToken } = tokenHelper.getTokenFromStorage();
        const { refreshToken } = tokenHelper.getRefreshTokenFromStorage();
        if (accessToken && refreshToken) {
          // try to refresh token if access token expired
          if (!tokenHelper.isValidToken(accessToken)) {
            const { accessToken: newToken } = await authService.refreshToken({ accessToken, refreshToken });
            if (newToken) {
              tokenHelper.saveTokenToStorage(newToken);
              const decodedToken = tokenHelper.decodeToken(newToken);
              const user = decodedToken as AuthUser;

              dispatch(AuthActions.restoreToken({ user }));
            } else {
              dispatch(AuthActions.restoreToken({ user: undefined }));
            }
          } else {
            const user = tokenHelper.decodeToken(accessToken) as AuthUser;
            dispatch(AuthActions.restoreToken({ user }));
          }
        } else {
          dispatch(AuthActions.restoreToken({ user: undefined }));
        }
      } catch (e) {
        dispatch(AuthActions.restoreToken({ user: undefined }));
      }
    };

    const setLanguage = async () => {
      // get default lang 
      if (isAuthenticated && tokenHelper.getLanguageFromStorage(LANGUAGE)) {
        storeSettingService.getLanguageStore().then((result) => {
          const language = TRANSLATE_LIST.filter((x) => x.key == result).map((y) => y.value).shift();
          tokenHelper.setLanguageToStorage(LANGUAGE, language);
        });
      }
      i18n.changeLanguage(tokenHelper.getLanguageFromStorage(LANGUAGE));
    }

    bootstrapAsync();
    setLanguage();
  }, []);

  const signIn = useCallback(async (model: LoginModel) => {
    const { accessToken, refreshToken, mainColor, subColor, textColor, accentColor, language, currencyUnit } 
      = await authService.login(model);

    if (mainColor || subColor || textColor || accentColor) {
      const colorsResult: ColorsResult = {
        mainColor: mainColor,
        subColor: subColor,
        textColor: textColor,
        accentColor: accentColor
      };
      tokenHelper.setColorsToStorage(COLORS, colorsResult);
      props.setter(colorsResult);
    }

    tokenHelper.saveTokenToStorage(accessToken);
    tokenHelper.saveRefreshTokenToStorage(refreshToken);
    tokenHelper.setPropertyToStorage(CURRENCY_UNITS,currencyUnit || CURRENCY_UNIT_DEFAULT);

    const lang = TRANSLATE_LIST.filter((x) => x.key == language).map((y) => y.value).shift();
    tokenHelper.setLanguageToStorage(LANGUAGE, lang);
    i18n.changeLanguage(tokenHelper.getLanguageFromStorage(LANGUAGE));

    const decodedToken = tokenHelper.decodeToken(accessToken);
    const user = decodedToken as AuthUser;

    dispatch(AuthActions.signIn({ user }));
  }, []);

  const signOut = useCallback(async () => {
    const {refreshToken} = tokenHelper.getRefreshTokenFromStorage();
    if (refreshToken) {
      await authService.logout(refreshToken);

      onLoggedOut();
    }
    else {
      onLoggedOut();
    }
  }, []);

  const onLoggedOut = () => {
    tokenHelper.removeToken();
    tokenHelper.removeColor();
    tokenHelper.removePropertyFromStorage(CURRENCY_UNITS);
    dispatch(AuthActions.signOut());
  }

  const authContext = React.useMemo(
    () => ({
      isAuthenticated: !!state.user,
      isLoading: state.isLoading,
      user: state.user,
      signIn,
      signOut,
      setter: props.setter
    }),
    [state.isLoading, state.user],
  );

  return (
    <AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext<AuthProps>(AuthContext);