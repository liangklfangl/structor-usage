'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.preProcess = preProcess;
exports.process = process;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _structorCommons = require('structor-commons');

var _metadata = require('./metadata.js');

var _metadata2 = _interopRequireDefault(_metadata);

var _dependencies = require('./dependencies.js');

var _dependencies2 = _interopRequireDefault(_dependencies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templateNames = ['index', 'constants', 'docs', 'actions', 'selectors', 'reducer', 'sagas', 'defaultModels', 'test', 'testActions', 'testReducer', 'testSagas', 'testSelectors'];

var mergeScripts = ['componentsFile', 'moduleIndexFile', 'reducersFile', 'moduleReducerFile', 'sagasFile', 'moduleSagasFile'];

/**
 * 
 * @param {*} currentDir 
 * @param {*} dataObject 
 * preProcess方法,调用方法
 * this.props.pregenerate(
      generatorName,
      generatorDirPath,
      namespace,
      componentName,
      selectedComponentModel
	);
	// 下面是参数
	 "generatorName": "redux-page",
    "generatorDirPath": "/Users/qinliang.ql/Desktop/structor-starter/.structor/gengine/scaffolds/redux-page",
    "selectedComponentModel": {
      "type": "Input",
      "variant": "default",
      "children": [],
      "namespace": "antd",
      "props": {
        "key": "5",
        "x": 616,
        "width": 213,
        "height": 28,
        "y": 14,
        "name": "name",
        "style": {
          "width": "213px",
          "height": "28px"
        },
        "defaultValue": "覃亮啊",
        "addonBefore": "http://",
        "disabled": false
      }
	}
	currentDir:generatorDirPath
 */
function preProcess(currentDir, dataObject) {
	var componentName = dataObject.componentName;
	var newMetaData = (0, _lodash.cloneDeep)(_metadata2.default);
	// metadata来自于本地的metadata.js
	newMetaData.metaData.reducerKeyProperty = (0, _lodash.camelCase)(componentName);
	// reducer的key以componentName的值为准
	return newMetaData;
}


/**
 * 
 * @param {*} currentDir :脚手架的地址
 * @param {*} dataObject : {
    namespace,
    componentName,
    model,
    project: config.getProjectConfig()
  };
 */
function process(currentDir, dataObject) {
	var templateDatas = {};
	var templateReaders = [];
	// 存储文件内容
	templateNames.forEach(function (name) {
		templateReaders.push(_structorCommons.commons.readFile(_path2.default.join(currentDir, 'templates', name + '.tpl')).then(function (fileData) {
			templateDatas[name] = fileData;
		}));
	});
	// 文件内容都读取成功
	return Promise.all(templateReaders).then(function () {
		var newDependencies = (0, _lodash.cloneDeep)(_dependencies2.default);
		// 依赖的新第三方模块
		var files = [];
		var file = void 0;
		var defaults = [];
		templateNames.forEach(function (name) {
			var generatorModule = require(_path2.default.join(currentDir, 'scripts', name + '.js'));
			// 这里是查找脚手架scripts下的js
			file = generatorModule.getFile(dataObject, templateDatas[name]);
			if (file.outputFilePath) {
				file.outputFileName = _path2.default.basename(file.outputFilePath);
				files.push(file);
			}
			if (file.defaults && file.defaults.length > 0) {
				defaults = defaults.concat(file.defaults);
			}
		});
		// files输出文件内容
		mergeScripts.forEach(function (script) {
			var mergeModule = require(_path2.default.join(currentDir, 'merge', script + '.js'));
			file = mergeModule.getFile(dataObject, _dependencies2.default);
			if (file.outputFilePath) {
				file.outputFileName = _path2.default.basename(file.outputFilePath);
				files.push(file);
			}
		});
		// 找到文件files,依赖dependencies,defaults默认
		return { files: files, dependencies: newDependencies, defaults: defaults };
	});
}