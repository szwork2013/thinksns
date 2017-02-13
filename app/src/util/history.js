/**
 * history.
 *
 * 工具环境自定义创建history.
 */
import { hashHistory, createMemoryHistory } from 'react-router';

const history = window.navigator.standalone == true ? createMemoryHistory() : hashHistory;

export default history;
