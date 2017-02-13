/**
 * createStoreProvider.
 */
import React from 'react';
import { Provider } from 'react-redux';

const createStoreProvider = (store, Container) => (
  props => (
    <Provider store={store}>
      <Container {...props} />
    </Provider>
  )
);

export default createStoreProvider;
