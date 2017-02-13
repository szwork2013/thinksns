/**
 * api.
 * 
 * API相关工具类.
 */
import { h5_api_url, api_url } from '../../config';

/**
 * 创建URI.
 *
 * @param {string} baseURI 根地址
 * @param {string} API 接口形式,如:"sign/up"
 * @param {object} options.params 而外query的参数
 * @return {string} 构造完成的地址
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
const createURI = (baseURI, API, {...params}) => {
  // 从API中切割controller和action
  const [ controller, action ] = API.split('/');

  // 替换controller和action并切割出请求地址和根地址
  const [ base, query = '' ] = baseURI
    .replace(/\%controller\%/g, controller)
    .replace(/\%action\%/g, action)
    .split('?');

  // 创建所有的query参数，（覆盖params设置的controller和action，如果有的话！）
  let attrs = {...params};
  query.split('&').forEach(param => {
    const [key, value] = param.split('=');
    attrs[key] = value;
  });

  // 拼装请求的字符串形式
  let queryString = '?';
  for (let key in attrs) {
    queryString += `${key}=${attrs[key]}&`;
  }

  // 返回构建的URL
  return base + queryString.slice(0, queryString.length - 1);
};

/**
 * H5 自封装API构建函数.
 *
 * @param {string} API 接口名称
 * @param {object} options.params 额外请求的参数
 * @return {string} 构建的地址
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
export const createH5API = (API, {...params}) => createURI(h5_api_url, API, params);

/**
 * 构建通用的 Ts 接口函数.
 *
 * @param {string} API 接口名称
 * @param {object} options.params 额外的请求参数
 * @return {string} 构建的API地址
 * @author Seven Du <shiweidu@outlook.com>
 * @homepage http://medz.cn
 */
export const createAPI = (API, {...params}) => createURI(api_url, API, params);
