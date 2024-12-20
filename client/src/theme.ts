import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: red[700],
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: red[700],
    }
  },
});

export default theme;
