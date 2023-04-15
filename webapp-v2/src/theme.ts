import { createTheme } from '@mui/material';
import { green, blue, red } from '@mui/material/colors';

const mdTheme = createTheme({
  palette: {
    primary: {
      main: blue[700]
    },
    secondary: {
      main: blue[300]
    },
    success: {
      main: green[400]
    },
    error: {
      main: red[400]
    }
  }
});

export default mdTheme;
