import React, { useContext, useLayoutEffect, useMemo, useReducer } from "react";

interface LoadingProps {
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: boolean | undefined;
}

const LoadingContext = React.createContext({} as LoadingProps);

export const useLoadingContext = () => useContext(LoadingContext);

export const LoadingContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (prevState: any, action: { type: string; loading: boolean }) => {
      switch (action.type) {
        case "SHOW":
          return {
            loading: true,
          };
        case "HIDE":
          return {
            loading: false,
          };
      }
    },
    { loading: false }
  );

  const loadingContext = useMemo(
    () => ({
      showLoading: () => {
        dispatch({ type: "SHOW", loading: true });
      },
      hideLoading: () => {
        dispatch({ type: "HIDE", loading: false });
      },
      isLoading: state?.loading,
    }),
    [state]
  );

  useLayoutEffect(() => {
    if (state?.loading) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    }
    if (!state?.loading) {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
  }, [state?.loading]);

  return (
    <LoadingContext.Provider value={loadingContext}>
      {children}
    </LoadingContext.Provider>
  );
};
