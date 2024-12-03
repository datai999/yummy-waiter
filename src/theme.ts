import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#D42E44',
    },
    secondary: {
      main: '#9E675B',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
