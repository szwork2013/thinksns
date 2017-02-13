/**
 * formatClientName.
 */
const clients = {
  0: '网页',
  1: '手机',
  2: 'Android',
  3: 'iPhone',
  4: 'iPad',
  5: 'Windows',
  6: 'H5客户端',
};

const formatClientName = clientCode => clients[clientCode] || clientCode;

export default formatClientName;