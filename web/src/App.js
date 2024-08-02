import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ThemeProvider, useTheme } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { SET_THEME } from '@/store/actions';
import { I18nextProvider } from 'react-i18next';
// routing
import Routes from '@/routes';

// defaultTheme
import themes from '@/themes';

// project imports
import NavigationScroll from '@/layout/NavigationScroll';

// auth
import UserProvider from '@/contexts/UserContext';
import StatusProvider from '@/contexts/StatusContext';
import { SnackbarProvider } from 'notistack';
import CopySnackbar from '@/ui-component/Snackbar';

// locales
import i18n from '@/i18n/i18n';

// ==============================|| APP ||============================== //

const App = () => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const storedLanguage = localStorage.getItem('appLanguage') || 'zh_CN';
  i18n.changeLanguage(storedLanguage);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      dispatch({ type: SET_THEME, theme: storedTheme });
    }
  }, [dispatch]);

  useEffect(() => {
    onChangeTheme();
  }, [customization]);

  function onChangeTheme() {
    // const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    //
    // darkThemeMq.addListener((e) => {
    //   if (e.matches) {
    //     document.body.setAttribute('arco-theme', 'dark');
    //   } else {
    //     document.body.removeAttribute('arco-theme');
    //   }
    // });
    // 获取主题

    if (customization.theme === 'dark') {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <SnackbarProvider
            autoHideDuration={5000}
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            Components={{ copy: CopySnackbar }}
          >
            <I18nextProvider i18n={i18n}>
              <UserProvider>
                <StatusProvider>
                  <Routes />
                </StatusProvider>
              </UserProvider>
            </I18nextProvider>
          </SnackbarProvider>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
