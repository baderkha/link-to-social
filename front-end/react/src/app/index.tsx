import React, { FC } from 'react';
import { NavBar } from './components/NavBar';
import Profile from './pages/Profile/profile';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#101010',
    },
    secondary: {
      main: '#04e162',
    },
    background: {
      default: '#ffffff',
      paper: '#eae4e4',
    },
    success: {
      main: '#2962ff',
    },
  },
});

export const App: FC<any> = (props) => {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div>
        <NavBar></NavBar>
        <Routes>

          <Route path="/profile" element={<Profile />} />
        </Routes>

      </div>
    </Router>
    </ThemeProvider>
  )
}