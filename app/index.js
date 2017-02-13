/**
 * 入口文件
 */
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './src/App';

import './styles/thinksns.css';

document.addEventListener('DOMContentLoaded', () => {
  injectTapEventPlugin();

  render(
    <App />,
    document.getElementById('app')
  );
});
