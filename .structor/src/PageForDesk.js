import React, { Component } from "react";
import { isEqual } from "lodash";
import { getPagePathName } from "./commons/constants.js";
import pageDefaultModel from "./commons/model.js";
import { createElements } from "./commons/pageUtils.js";
import GridLayout from "react-grid-layout";
import MouseOverOverlay from "./MouseOverOverlay.js";
import SelectedOverlay from "./SelectedOverlay.js";
import HighlightedOverlay from "./HighlightedOverlay.js";
import ClipboardOverlay from "./ClipboardOverlay.js";

/**
 * 桌面工作区设置
 */
class PageForDesk extends Component {
  constructor(props, content) {
    super(props, content);
    this.state = {
      isEditModeOn: true,
      updateCounter: 0
    };
    this.elementTree = [];
    this.initialState = { elements: {} };
    this.updatePageModel = this.updatePageModel.bind(this);
    this.bindGetPagePath = this.bindGetPagePath.bind(this);
    this.bindGetPageModel = this.bindGetPageModel.bind(this);
    this.bindGetMarked = this.bindGetMarked.bind(this);
    this.bindGetShowBlueprintButtons = this.bindGetShowBlueprintButtons.bind(
      this
    );
    this.bindOnComponentMouseDown = this.bindOnComponentMouseDown.bind(this);
    this.getModelByPathname = this.getModelByPathname.bind(this);
    this.updateMarks = this.updateMarks.bind(this);
  }

  /**
   * 
   * @param {*} func 
   */
  bindGetPagePath(func) {
    this.getPagePath = func;
  }

  /**
   * 
   * @param {*} func 
   */
  bindGetPageModel(func) {
    this.getPageModel = func;
  }
  /**
 * 
 * @param {*} func 
 */
  bindGetMarked(func) {
    this.getMarked = func;
  }

  /**
   * 
   * @param {*} func 
   * 绑定dragSize改变
   */
  bindDragSizeChange = func => {
    this.onDragSizeChange = func;
  };

  /**
   * 直接设置属性:没有弹出提示
   */
  settingPropsDirectly = func => {
    this.settingPropsDirectly = func;
  };
  /**
   * 枚举类型的contextMenu被选择
   */
  bindEnumContextMenuSelect = func => {
    this.bindEnumContextMenuSelect = func;
  };

  /**
   * 右键选中一个值的时候触发
   */
  bindPropSelectChange = func => {
    this.bindPropSelectChange = func;
  };
  /**
 * 
 * @param {*} func 
 */
  bindGetMode(func) {
    this.getMode = func;
  }
  /**
    * 
    * @param {*} func 
    */
  bindGetShowBlueprintButtons(func) {
    this.getShowBlueprintButtons = func;
  }
  /**
   * 
   * @param {*} func 
   * 组件鼠标按下组件的回调函数
   * 阻止鼠标点击组件的编辑逻辑
   */
  bindOnComponentMouseDown(func) {
    this.onComponentMouseDown = func;
  }

  /**
   * 
   * @param {*} func 
   * Table.columns等复杂props的修改
   */
  settingArrayObjectProps(func) {
    this.settingArrayObjectProps = func;
  }
  /**
   * 
   * @param {*} func
   * 组件的pathname改变后 
   */
  bindOnPathnameChanged(func) {
    this.onPathnameChanged = func;
  }

  /**
   * 
   * @param {*} signature 
   * @param {*} func 
   * 将字段绑定到state中并提供回调函数
   */
  bindToState(signature, func) {
    this.initialState[signature] = func;
  }

  /**
   * getContexf
   */
  getContext() {
    return {};
  }

  /**
   * 组件挂载
   */
  componentDidMount() {
    // https://github.com/ipselon/structor/issues/97
    if (window.onPageDidMount) {
      window.onPageDidMount(this);
      if (this.updatePageModel) {
        const pathname = getPagePathName(this.props.location.pathname);
        // 得到页面的pathname
        const nextPagePath = this.getPagePath(pathname);
        // 获取下一个pagepath
        this.updatePageModel({
          pathname: nextPagePath
        });
        if (this.onPathnameChanged) {
          this.onPathnameChanged(nextPagePath);
        }
      }
    }
  }

  componentWillUnmount() {
    this.initialState = undefined;
    this.elementTree = undefined;
  }

  /**
   * 
   * @param {*} nextProps 
   * 监听pathname改变，比如工作区要加载不同的router
   */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location.pathname !== this.props.location.pathname ||
      isEqual(nextProps.location.query, this.props.location.query)
    ) {
      const pathname = getPagePathName(nextProps.location.pathname);
      const nextPagePath = this.getPagePath(pathname);
      this.updatePageModel({
        pathname: nextPagePath
      });
      if (this.onPathnameChanged) {
        this.onPathnameChanged(nextPagePath);
      }
    }
  }

  /**
   * 
   * @param {*} nextProps 
   * @param {*} nextState 
   * 如果updateCounter改变就重新渲染
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.updateCounter !== nextProps.updateCounter;
  }

  /**
   * 根据当前页面的Model,每次设置了值以后我们都会重新渲染，从而所有的子组件被重新渲染
   */
  updatePageModel(options) {
    let { pathname } = options;
    let pageModel = this.getModelByPathname(pathname);
    // 也就是desk/model.json的数据
    console.log("Page model,即页面数据为: ", pageModel);
    const isEditModeOn = this.getMode();
    // 是否编辑，动态创建组件树
    this.elementTree = createElements(
      pageModel,
      this.initialState,
      // 默认state
      this.onComponentMouseDown,
      {
        isEditModeOn: isEditModeOn
      },
      this.onDragSizeChange,
      // 拖动修改props属性
      this.bindPropSelectChange,
      // context menu的弹出输入类型,
      this.bindEnumContextMenuSelect,
      // 右键直接选择类型
      {
        propsUtils: {
          settingArrayObjectProps: this.settingArrayObjectProps,
          settingPropsDirectly: this.settingPropsDirectly
        }
      }
    );

    this.setState({
      pathname: pathname,
      isEditModeOn: isEditModeOn,
      updateCounter: this.state.updateCounter + 1
    });
  }

  /**
   * 
   * @param {*} options 
   * 更新updateCounter
   */
  updateMarks(options) {
    let { pathname } = options;
    this.setState({
      pathname: pathname,
      updateCounter: this.state.updateCounter + 1
    });
  }

  /**
   * 根据pathname获取这个页面的model数据
   */
  getModelByPathname(pathname) {
    let pageModel = this.getPageModel(pathname);
    console.log("getModelByPathname得到的数据为===", pageModel);
    if (!pageModel) {
      pageModel = pageDefaultModel;
      pageModel.children[0].children[0].modelNode.text =
        "Route was not found: " + pathname + ". Try to select another route.";
    }
    return pageModel;
  }

  render() {
    let boundaryOverlays = [];
    let selectedKeys = undefined;
    if (this.state.isEditModeOn && this.state.pathname) {
      const showBlueprintButtons = this.getShowBlueprintButtons
        ? this.getShowBlueprintButtons()
        : true;
      const { selected, highlighted, forCutting, forCopying } = this.getMarked(
        this.state.pathname
      );
      if (selected && selected.length > 0) {
        selectedKeys = selected;
        selected.forEach(key => {
          boundaryOverlays.push(
            <SelectedOverlay
              key={"selected" + key}
              initialState={this.initialState}
              selectedKey={key}
              isMultipleSelected={selected.length > 1}
              showBlueprintButtons={showBlueprintButtons}
            />
          );
        });
      }
      if (forCutting && forCutting.length > 0) {
        forCutting.forEach(key => {
          boundaryOverlays.push(
            <ClipboardOverlay
              key={"forCutting" + key}
              initialState={this.initialState}
              bSize="2px"
              bStyle="dotted #f0ad4e"
              selectedKey={key}
            />
          );
        });
      }
      if (forCopying && forCopying.length > 0) {
        forCopying.forEach(key => {
          boundaryOverlays.push(
            <ClipboardOverlay
              key={"forCopying" + key}
              initialState={this.initialState}
              bSize="2px"
              bStyle="dotted #5cb85c"
              selectedKey={key}
            />
          );
        });
      }
      if (highlighted && highlighted.length > 0) {
        highlighted.forEach(key => {
          boundaryOverlays.push(
            <HighlightedOverlay
              key={"highlighted" + key}
              initialState={this.initialState}
              selectedKey={key}
            />
          );
        });
      }
    }
    // 选中区域，也就是我们组建好的页面的那一块区域
    return (
      <div
        id="pageContainer"
      >
        {this.elementTree}
        {boundaryOverlays}
        {this.state.isEditModeOn ? (
          <MouseOverOverlay
            key="mouseOverBoundary"
            ref="mouseOverBoundary"
            initialState={this.initialState}
            selectedKeys={selectedKeys}
            bSize="1px"
          />
        ) : null}
      </div>
    );
  }
}

export default PageForDesk;
