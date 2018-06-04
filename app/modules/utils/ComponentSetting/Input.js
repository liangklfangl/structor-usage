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
    //   通用属性
    props: {
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
        label: "后置标签"
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
      type: {
        label: "Input类型",
        value: "text",
        defaultValue: "text",
        type: "enum",
        enums: ["text", "textarea"]
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
    },
    TextArea: {
      autosize: {
        label: "自适应内容高度",
        defaultValue: true,
        value: true,
        type: "boolean|object".split("|")
      },
      defaultValue: {
        label: "输入框默认值",
        defaultValue: "",
        value: "",
        type: "string"
      },
      value: {
        label: "输入框值",
        defaultValue: "",
        value: "",
        type: "string"
      },
      onPressEnter: {
        label: "回车按键回调",
        type: "func",
        value: null,
        defaultValue: null
      }
    },
    Search: {
      enterButton: {
        label: "是否有确认按钮",
        type: "boolean|ReactNode".split("|"),
        defaultValue: false,
        value: false
      },
      onSearch: {
        label: "搜索或按下回车键时的回调",
        type: "func",
        defaultValue: null,
        value: null
      }
    },
    Group: {
      compact: {
        label: "是否用紧凑模式",
        type: "boolean",
        defaultValue: false
      },
      size: {
        label: "Input.Group 中所有的 Input 的大小",
        type: "enum",
        enums: ["large", "default", "small"],
        defaultValue: "default",
        value: "default"
      }
    }
  }
};

export default flexibleConfigurationLists;
