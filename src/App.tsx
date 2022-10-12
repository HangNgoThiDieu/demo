import { useEffect, useState } from "react";
import { AuthProvider } from "./context/auth";
import AppRouter from "./routers";
import {useTheme} from './theme/useTheme';
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyles } from 'theme/global-styles';
import "assets/styles/common.scss";
import { ToastContainer } from "react-toastify";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import LoadingOverlay from "react-loading-overlay-ts";
import PropagateLoader from "react-spinners/PropagateLoader";
import ja from "date-fns/locale/ja";
import vi from "date-fns/locale/vi";
import en from 'date-fns/locale/en-US';
import kr from "date-fns/locale/ko";
import { useLoadingContext } from "context/loading";
setDefaultLocale('ja');
registerLocale("ja", ja);
registerLocale("en", en);
registerLocale("kr", kr);
registerLocale("vi", vi);

export interface DefaultTheme {
    mainColor: string;
    subColor: string;
    textColor: string;
    accentColor: string;
}

const Container = styled.div`
  background-color: #F7F7F7;
  height: 100vh;
`;

const STYLES: any = {
  overlay: (base: any) => ({
    ...base,
    zIndex: "1060",
  }),
};

function App() {
  const { theme, themeLoaded } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<DefaultTheme>(theme);
  const { isLoading } = useLoadingContext();

  useEffect(() => {
    setSelectedTheme(theme);
  }, [themeLoaded]);

  return (
    <>
      { themeLoaded && <ThemeProvider theme={selectedTheme}>
          <Container>
            <GlobalStyles />
            <AuthProvider setter={ setSelectedTheme }>
              <LoadingOverlay
                active={isLoading}
                spinner={<PropagateLoader color={selectedTheme.mainColor} size={12} />}
                styles={STYLES}
              >
                <AppRouter />
                <ToastContainer />
              </LoadingOverlay>
            </AuthProvider>
          </Container>
        </ThemeProvider>
      }
    </>
  );
}

export default App;
