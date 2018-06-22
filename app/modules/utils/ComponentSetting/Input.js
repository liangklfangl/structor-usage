/**
 * 1.type存在的类型:
 *      1.1 enum:枚举类型,select来提供选择,枚举enums值
 *      1.2 array:二级联动,根据第一级选择选择第二级。如果选择string/boolean等那么直接输入框，ReactNode提供在线创建
 *      1.3 boolean/string等直接提供一个输入框
 *      1.4 func类型，提供一个在线函数书写地方
 * 2.设计的字段类型:
 *      2.1 type
 *      2.2 label
 *      2.3 defaultValue: 这个字段用户什么也没有填写应该显示什么
 *      2.4 value:用户输入后显示，默认情况下和defaultValue保持一致
 */
const flexibleConfigurationLists = {
  Input: {
    //key:这个方法调用后修改state的那个值
    //value:添加的方法
    addonMethods: {
      value: "onChange"
    },
    props: {
      // 根据这个name写入state
      name: {
        defaultValue: "",
        value: "",
        label: "字段名称",
        type: "string"
      },
      addonAfter: {
        defaultValue: null,
        value: null,
        label: "后置标签",
        type: "string|ReactNode".split("|")
      },
      addonBefore: {
        defaultValue: null,
        value: null,
        type: "string|ReactNode".split("|"),
        label: "前置标签"
      },
      defaultValue: {
        defaultValue: "",
        value: "",
        label: "默认值",
        type: "string"
      },
      disabled: {
        type: "enum",
        label: "是否禁用",
        enums: ["是", "否"],
        value: false,
        defaultValue: false
      },
      id: {
        value: "",
        defaultValue: "",
        type: "string",
        label: "ID"
      },
      prefix: {
        label: "图标前缀",
        value: "",
        defaultValue: "",
        type: "string|ReactNode".split("|")
      },
      size: {
        label: "控件大小",
        enums: ["default", "large", "small"],
        value: "default",
        defaultValue: "default",
        type: "enum"
      },
      suffix: {
        label: "图标后缀",
        value: "",
        defaultValue: "",
        type: "string|ReactNode".split("|")
      },
      value: {
        label: "Input类型",
        type: "string",
        defaultValue: "",
        value: ""
      },
      onPressEnter: {
        label: "回车按键回调",
        type: "func",
        defaultValue: null,
        value: null
      }
    }
  }
};

export default flexibleConfigurationLists;
