const flexibleConfigurationLists = {
  TextArea: {
    props: {
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
    }
  }
};

export default flexibleConfigurationLists;
