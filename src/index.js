import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import { message } from 'antd';

import router from './router';

import './index.css';

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    message.destroy();
    message.error(e.message);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/app'));

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
