/**
 * App.
 */
import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import history from './util/history';
// Old routes.
import OldRouter from '../../webapp/App';
// components.
import AppComponent from './component/AppComponent';
import MainComponent from './component/MainComponent';
// feeds.
import FeedMainComponent from './component/FeedMainComponent';
import FeedAllProvider from './provider/FeedAllProvider';

const App = () => (
  <Router history={history}>
    <Route path="/new" component={AppComponent}>
      <Route path="main" component={MainComponent} >
        <Route path="feed" component={FeedMainComponent}>
          <IndexRoute component={FeedAllProvider} />
        </Route>
      </Route>
    </Route>
    {OldRouter}
  </Router>
);

export default App;
