import React, { FC } from 'react';
import { NavBar } from './components/NavBar';
import Profile from './pages/Profile/profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, createMuiTheme, ThemeProvider } from '@material-ui/core';
import Page, { PageContext } from './pages/Page/page';
import { SelenaDummyLinks } from './pages/Page/selena_test';
import { Logo } from './components/Logo';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import Builder from './pages/Builder/Builder';
import { EmptyLinks } from './pages/Page/blank_page';
import { useEffect } from 'react-transition-group/node_modules/@types/react';
import MiniDrawer from './components/Nav';

export const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#101010',
    },
    secondary: {
      main: '#118a44',
      contrastText: 'rgba(255,252,252,0.87)',
    },
    background: {
      default: '#fffbfb',
      paper: '#fbfbfb',
    },
    success: {
      main: '#65ff00',
    },
  },
});

export const NavView = ({ childComponents }) => {
  return (
    <div>
      <MiniDrawer contentChild={childComponents} />
    </div>
  );
};

export const App: FC<any> = props => {
  let accountId = 'ahmad';

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <div style={{ marginTop: '10px', minHeight: '92.3vh' }}>
            <Routes>
              <Route
                path=""
                element={<NavView childComponents={<Profile />} />}
              />
              <Route
                path="/profile"
                element={<NavView childComponents={<Profile />} />}
              />
              <Route
                path="/build-page"
                element={
                  <NavView childComponents={<Builder accountId="ahmad" />} />
                }
              />
              <Route path="/builder-view" element={<Page {...EmptyLinks} />} />
              <Route path="/:id" element={<Page {...SelenaDummyLinks} />} />

              <Route path="/test" element={<MiniDrawer />} />
            </Routes>
          </div>
        </div>
      </Router>
      <footer
        style={{
          textAlign: 'center',
          bottom: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <Logo size="small"></Logo>
        </div>
      </footer>
    </ThemeProvider>
  );
};
