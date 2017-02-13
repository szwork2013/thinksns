/**
 * CustomListStore.
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import CustomListReducer from '../reducer/CustomListReducer';

export const createCustomListStore = (defalutList = []) => createStore(CustomListReducer, defalutList, applyMiddleware(thunk)); 