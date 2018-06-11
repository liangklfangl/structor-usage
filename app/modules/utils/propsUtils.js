/**
 * 根据配置信息获取props
 *  addonAfter: {
        defaultValue: null,
        value: null,
        label: "后置标签",
        type: "string|ReactNode".split("|")
      }
 */
export function getProps(PropsObject) {
  const keys = Object.keys(PropsObject);
  const props = {};
  for (let t = 0, len = keys.length; t < len; t++) {
    const { value } = PropsObject[keys[t]];
    props[keys[t]] = value;
  }
  return props;
}

/**
 * 将选中的属性映射回来，比如是否
 */
export function transformProps(key) {
  return key == "是" ? true : key == "否" ? false : key;
}

/**
 * 
 * @param {*} arr 
 * @param {*} prop 
 * 去重对象数组
 */
export function uniqueBy(arr, prop) {
  const res = new Map();
  return arr.filter(a => !res.has(a[prop]) && res.set(a[prop], 1));
}
