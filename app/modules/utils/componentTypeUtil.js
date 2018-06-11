const COMPONENT_TTYPES_DATA = ["Input", "Select", "Table"];

const COMPONENT_TYPES_BEHAVIOR = ["Button"];
/**
 * 
 * @param {*} componentType 
 * 判断是行为组件还是数据组件
 */
export function getSelectedComponentType(componentType) {
  return COMPONENT_TTYPES_DATA.indexOf(componentType) != -1
    ? "data"
    : "behavior";
}

/**
 * 满足一个是行为组件，一个是数据组件才行
 */
export function isAllowDrag(components) {
  let isData = false,
    isBehavior = false;
  for (let t = 0, len = components.length; t < len; t++) {
    const { componentKey, type } = components[t];
    if (getSelectedComponentType(type) == "data") {
      isData = true;
    }
    if (getSelectedComponentType(type) == "behavior") {
      isBehavior = true;
    }
  }
  return isBehavior && isData;
}
