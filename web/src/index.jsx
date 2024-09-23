import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import * as serviceWorker from './serviceWorker';
import App from './App';
import { store } from './store';

// style + assets
import '@arco-design/web-react/dist/css/arco.css';

import '@/assets/scss/style.scss';
import config from './config';
import reportWebVitals from 'reportWebVitals';
// ==============================|| REACT DOM RENDER  ||============================== //


import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider, theme } from 'antd';

import { isMobile } from '@/utils/common';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

function getLocale() {
  return zhCN;
}

root.render(
  <ConfigProvider
    theme={{
      algorithm: [isMobile() ? theme.compactAlgorithm : theme.compactAlgorithm],
      token: { wireframe: true, borderRadius: 4, fontSize: 14 }
    }}
    locale={getLocale()}
  >
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <App />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
