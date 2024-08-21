import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import * as serviceWorker from './serviceWorker';
import App from './App';
import { store } from './store';

// style + assets
import '@/assets/scss/style.scss';
import config from './config';

import '@arco-design/web-react/dist/css/arco.css';
import zhCN from 'antd/locale/zh_CN';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import { ConfigProvider, theme } from 'antd';

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

function getLocale() {
  return zhCN;
}

root.render(
  <ConfigProvider locale={getLocale()} prefixCls={'chirou'} theme={{}}>
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
serviceWorker.register();
