import React, { FC } from 'react';
import { NavBar } from './components/NavBar';
import Profile from './pages/Profile/profile';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Page from './pages/Page/page';
import { SelenaDummyLinks } from './pages/Page/page';
import { Logo } from './components/Logo';
import {RemoveScrollBar} from 'react-remove-scroll-bar';

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
      default: '#000000',
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
      <Container>
        <Router>
          <div>
            <NavBar></NavBar>
            <div style={{ marginTop: "55px" ,  minHeight:"85vh" }}>
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/:id" element={<Page {...SelenaDummyLinks} />} />

              </Routes>
            </div>
          </div>
        </Router>
        <footer style={{
        textAlign: "center",
        bottom: "0",
        width: "100%",
        display: "flex", justifyContent: "center"
      }}>
        <div style={{marginBottom: "15px" }}>
          <Logo size="small" ></Logo>
        </div>
      </footer>
      </Container>
      
    </ThemeProvider>

  )
}