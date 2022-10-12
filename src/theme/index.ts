import { colors, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
      background: {
        default: '#F4F6F8',
        paper: colors.common.white
      },
      primary: {
        contrastText: '#ffffff',
        main: '#1976d2'
      },
      secondary: {
        contrastText: '#ffffff',
        main: "#DC004E"
      },
      text: {
        primary: '#172b4d',
        secondary: '#6b778c'
      }
    },
  });
  
  export default theme;