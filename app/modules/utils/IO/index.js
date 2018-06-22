/**
 * 拼接Get请求链接发送请求
 */
export function fetchGet(url, params) {
  if (params) {
    let paramsArray = [];
    Object.keys(params).forEach(key =>
      paramsArray.push(key + "=" + params[key])
    );
    if (url.search(/\?/) === -1) {
      url += "?" + paramsArray.join("&");
    } else {
      url += "&" + paramsArray.join("&");
    }
  }
  return new Promise(
    resolve => {
      resolve({
        name: "罄天",
        sex: "男"
      });
    },
    reject => {
      reject({
        name: "xx"
      });
    }
  );
}
