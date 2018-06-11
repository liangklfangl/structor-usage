const flexibleConfigurationLists = {
  Table: {
    // Table组件有columns和dataSource
    props: {
      columns: {
        label: "自定义列",
        defaultValue: [],
        value: [],
        type: "arrayObject",
        // props属性
        props: [
          {
            label: "列的className",
            name: "className",
            type: "string",
            index: 1,
            defaultValue: "container"
          },
          {
            label: "表头列合并,设置为0时，不渲染",
            type: "number",
            name: "colSpan",
            index: 2,
            defaultValue: 2
          },
          {
            label: "表头列合并,设置为0时，不渲染",
            type: "number",
            name: "dataIndex",
            index: 3,
            defaultValue: 3
          },
          {
            label: "表头列合并,设置为0时，不渲染",
            type: "number",
            name: "title",
            index: 4,
            defaultValue: 4
          },
          {
            label: "表头列合并,设置为0时，不渲染",
            type: "number",
            name: "key",
            index: 5,
            defaultValue: 5
          }
        ]
      },
      dataSource: {
        label: "数据源",
        defaultValue: [],
        value: [],
        type: "array"
      }
    }
  }
};

export default flexibleConfigurationLists;
