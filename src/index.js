import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import DreamView from './components/Dreamview';
// import 'antd/dist/antd.css';
import "./styles/main.scss";
import STORE from './store';

ReactDOM.render(
  <Provider store={STORE}>
      <DreamView />
  </Provider>,
  document.getElementById('root')
);
