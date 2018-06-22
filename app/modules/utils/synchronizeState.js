/**
 * 如果是data类型组件
 */
export default function wrap(
  Component,
  {
    events = [],
    type,
    addonMethods = {},
    pageState = {},
    vergineType = "",
    componentKey = "",
    elementKey = "",
    key = "",
    dispatch = () => {},
    propsUtils = {}
  }
) {
  const currentPath = "/" + window.location.pathname.split("/").slice(2);
  const page = window.__pages.filter(el => {
    return el.pagePath == currentPath;
  })[0];
  /**
     * 添加实例方法
     */
  const keys = Object.keys(addonMethods);
  for (let t = 0, len = keys.length; t < len; t++) {
    const methodName = addonMethods[keys[t]];
    Component.prototype[methodName] = (value, cmptKey) => {
      dispatch({
        type: [page.pageName] + ".",
        payload: {
          [cmptKey]: value
        }
      });
    };
  }
  return Component;
}
