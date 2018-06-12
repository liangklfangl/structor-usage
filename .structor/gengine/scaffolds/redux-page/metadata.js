"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	metaData: {
		"componentType": "ES6 Class",
		"reducerKeyProperty": "containerComponent",
		// reducer的key以componentName为准
		"hasChildrenIncluded": true,
		"isPropertiesExample": true
	},
	metaHelp: {
		"componentType": {
			"description": "请选择组件类型",
			"options": [{ "label": "ES6 Class (Pure)", "value": "ES6 Class (Pure)" }, { "label": "ES6 Class", "value": "ES6 Class" }]
		},
		"reducerKeyProperty": {
			"description": "指定在redux的store中的key值"
		},
		"hasChildrenIncluded": {
			"description": "Inject children into the source code of the component:"
		},
		"isPropertiesExample": {
			"description": "Add an example of the property declaration in the source code:"
		}
	}
};