'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFile = getFile;

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _structorCommons = require('structor-commons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 
 * @param {*} dataObject 
 * @param {*} templateText 
 * 调用方法:generatorModule.getFile(dataObject, templateDatas[name]);
 */
function getFile(dataObject, templateText) {
    var index = dataObject.index,
        model = dataObject.model,
        metadata = dataObject.metadata,
        project = dataObject.project,
        namespace = dataObject.namespace,
        componentName = dataObject.componentName;
    if (!(0, _lodash.has)(project, 'paths.appDirPath')) {
        throw Error('Wrong project configuration. "appDirPath" field is missing.');
    }

    var absoluteComponentDirPath = namespace && namespace.length > 0 ? _path2.default.join(project.paths.appDirPath, 'modules', namespace, 'containers', componentName) : _path2.default.join(project.paths.appDirPath, 'containers', componentName);
    // 可以看到我们有namespace的最终地址为:app/modules/modalReducer/containers/ModalReducer,其中modalReducer为namespace和componentName
    var absoluteComponentFilePath = _path2.default.join(absoluteComponentDirPath, 'actions.js');
    //   action.js内容
    var resultSource = void 0;
    try {
        // 使用lodash的template方法来对变量进行替换
        resultSource = (0, _lodash.template)(templateText)({
            model: model, namespace: namespace, componentName: componentName, metadata: metadata
        });
    } catch (e) {
        throw Error('lodash template error. ' + e);
    }

    try {
        resultSource = _structorCommons.commons.formatJs(resultSource);
        resultSource = resultSource.replace(/(^\s*[\r\n]){2,}/gm, "\n");
    } catch (e) {
        throw Error('JavaScript syntax error. ' + e + '\n[Source code:]\n' + resultSource);
    }

    return {
        outputFilePath: absoluteComponentFilePath,
        // 输出的文件地址
        sourceCode: resultSource
        // 输出的文件内容
    };
}