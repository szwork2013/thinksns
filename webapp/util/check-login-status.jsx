import Cache from './cache.jsx';

let checkLoginStatus = () => {
  if (Cache.hasItem('login-uid')) {
    TS.MID = Cache.getItem('login-uid');
  } else if (TS.MID) {
    Cache.setItem('login-uid', TS.MID);
  }
  return TS.MID;
};

export default checkLoginStatus;