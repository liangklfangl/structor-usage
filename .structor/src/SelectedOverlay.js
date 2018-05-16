import { isEqual } from 'lodash';
import React, { Component } from 'react';

const nullPx = '0px';
const px = 'px';
const nonePos = {top: 0, left: 0, width: 0, height: 0};

function isVisible (element) {
  let invisibleParent = false;
  if ($(element).css('display') === 'none') {
    invisibleParent = true;
  } else {
    $(element).parents().each(function (i, el) {
      if ($(el).css('display') === 'none') {
        invisibleParent = true;
        return false;
      }
      return true;
    });
  }
  return !invisibleParent;
}

class SelectedOverlay extends Component {

  constructor (props) {
    super(props);
    this.isSubscribed = false;
    this.state = {
      newPos: null,
      mousePos: undefined,
      contextMenuType: null,
      contextMenuItem: null,
      isOverlay: false,
    };
    this.startRefreshTimer = this.startRefreshTimer.bind(this);
    this.refreshPosition = this.refreshPosition.bind(this);
    this.subscribeToInitialState = this.subscribeToInitialState.bind(this);
    this.setSelectedPosition = this.setSelectedPosition.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.handleMouseEnterLine = this.handleMouseEnterLine.bind(this);
    this.handleMouseLeaveLine = this.handleMouseLeaveLine.bind(this);
    this.handleComponentMouseDown = this.handleComponentMouseDown.bind(this);
    this.clearMousePosition = this.clearMousePosition.bind(this);
  }

  componentDidMount () {
    this.bodyWidth = document.body.clientWidth;
    this.bodyHeight = document.body.clientHeight;
    this.subscribeToInitialState();
    const {initialState, selectedKey} = this.props;
    if (initialState && selectedKey) {
      initialState.onMouseDown[selectedKey] = this.handleComponentMouseDown;
    }
  }

  componentWillUnmount () {
    if (this.refreshTimerId) {
      clearTimeout((this.refreshTimerId));
      this.refreshTimerId = undefined;
    }
    this.$DOMNode = undefined;
    const {initialState, selectedKey} = this.props;
    if (initialState && selectedKey) {
      delete initialState.onMouseDown[selectedKey];
    }
  }

  componentWillUpdate () {
    this.subscribeToInitialState();
  }

  componentWillReceiveProps (nextProps) {
    this.isSubscribed = false;
  }

  shouldComponentUpdate (nextProps, nextState) {
    const {selectedKey, isMultipleSelected, showBlueprintButtons} = this.props;
    const {newPos, isOverlay, mousePos} = this.state;
    return selectedKey !== nextProps.selectedKey ||
      (newPos !== nextState.newPos && !isEqual(newPos, nextState.newPos) && !isEqual(nonePos, nextState.newPos)) ||
      isOverlay !== nextState.isOverlay ||
      isMultipleSelected !== nextProps.isMultipleSelected ||
      showBlueprintButtons !== nextProps.showBlueprintButtons ||
      mousePos !== nextState.mousePos;
  }

  subscribeToInitialState () {
    if (!this.isSubscribed) {
      const {selectedKey, initialState} = this.props;
      if (selectedKey && initialState) {
        const element = initialState.elements[selectedKey];
        if (element) {
          const targetDOMNode = element.getDOMNode();
          this.isSubscribed = true;
          this.setSelectedPosition({targetDOMNode});
          this.setState({
            componentName: element.type
          });
        } else {
          this.resetTimer();
          this.setState({
            newPos: null
          });
        }
      }
      this.isSubscribed = true;
    }
  }

  startRefreshTimer () {
    this.refreshTimerId = setTimeout(() => {
      this.refreshPosition();
    }, 500);
  }

  refreshPosition () {
    const $DOMNode = this.$DOMNode;
    if ($DOMNode) {
      const {newPos: oldPos} = this.state;
      if (isVisible($DOMNode)) {
        let pos = $DOMNode.offset();
        let newPos = {
          top: pos.top,
          left: pos.left,
          width: $DOMNode.outerWidth(),
          height: $DOMNode.outerHeight()
        };
        if (!oldPos ||
          newPos.top !== oldPos.top ||
          newPos.left !== oldPos.left ||
          newPos.width !== oldPos.width ||
          newPos.height !== oldPos.height) {
          this.setState({newPos});
        }
      } else {
        if (oldPos) {
          this.setState({newPos: null});
        }
      }
    }
    this.startRefreshTimer();
  }

  resetTimer () {
    if (this.refreshTimerId) {
      clearTimeout((this.refreshTimerId));
      this.refreshTimerId = undefined;
    }
    this.$DOMNode = undefined;
  }

  setSelectedPosition (options) {
    let targetDOMNode = options.targetDOMNode;
    this.resetTimer();
    if (targetDOMNode) {
      this.$DOMNode = $(targetDOMNode);
      this.refreshPosition();
    } else {
      console.error('');
    }
  }

  handleButtonClick = (selectedKey, func) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (func) {
      func(selectedKey, e.metaKey || e.ctrlKey);
    }
  };

  handleMouseEnterLine (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.isOverlay) {
      this.setState({isOverlay: true});
    }
  }

  handleMouseLeaveLine (e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.isOverlay) {
      this.setState({isOverlay: false});
    }
  }

  handleComponentMouseDown (e) {
    const {pageX, pageY} = e;
    this.setState({mousePos: {pageX, pageY}});
  }

  clearMousePosition (e) {
    this.props.initialState.lastMousePos = undefined;
    this.setState({mousePos: null});
  }

  render () {
    const {newPos, isOverlay, mousePos, componentName} = this.state;
    const {selectedKey, isMultipleSelected, showBlueprintButtons, initialState: {lastMousePos}} = this.props;
    const {initialState: {
      onCopy,
      onCut,
      onBefore,
      onFirst,
      onLast,
      onAfter,
      onReplace,
      onSelectParent,
      onDelete,
      onClone
    }} = this.props;
    let content;
    if (newPos) {
      const endPoint = {
        top: newPos.top + px,
        left: newPos.left + px,
      };
      const topLine = {
        top: nullPx,
        left: nullPx,
        width: (newPos.width - 2) + 'px',
      };
      const leftLine = {
        top: nullPx,
        left: nullPx,
        height: (newPos.height - 2) + px,
      };
      const bottomLine = {
        top: (newPos.height - 2) + px,
        left: nullPx,
        width: (newPos.width - 2) + px,
      };
      const rightLine = {
        left: (newPos.width - 2) + px,
        top: nullPx,
        height: (newPos.height - 2) + px,
      };

      let overlay;
      let titleStyle = {};
      if (isOverlay) {
        overlay = {
          top: nullPx,
          left: nullPx,
          width: newPos.width + px,
          height: newPos.height + px,
          opacity: 0.2,
          backgroundColor: '#35b3ee',
        };
        titleStyle.backgroundColor = '#35b3ee';
        titleStyle.opacity = 1;
      }

      const validMousePos = mousePos || lastMousePos;
      let centerPointX;
      let centerPointY;
      if (validMousePos && !isMultipleSelected && showBlueprintButtons) {
        const topLeftY = newPos.top;
        const topLeftX = newPos.left;
        const bottomRightY = topLeftY + newPos.height;
        const bottomRightX = topLeftX + newPos.width;
        if (validMousePos.pageX > topLeftX &&
          validMousePos.pageX < bottomRightX &&
          validMousePos.pageY > topLeftY &&
          validMousePos.pageY < bottomRightY) {
          centerPointX = validMousePos.pageX - topLeftX;
          centerPointY = validMousePos.pageY - topLeftY;
        } else {
          if (topLeftY > 40) {
            centerPointY = newPos.height / 2;
          } else {
            centerPointY = 35;
          }
          if (topLeftX > 60) {
            centerPointX = newPos.width / 2;
          } else {
            centerPointX = 60;
          }
        }
      }

      content = (
        <div
          className="selection-border-center-point"
          style={endPoint}
        >
          {isOverlay && !isMultipleSelected && <div style={overlay}/>}
          <div className="selection-border-top-line" style={topLine}/>
          <div className="selection-border-left-line" style={leftLine}/>
          <div className="selection-border-bottom-line" style={bottomLine}/>
          <div className="selection-border-right-line" style={rightLine}/>
          {!isMultipleSelected && validMousePos && showBlueprintButtons &&
          <div className="mouse-center-point" style={{top: centerPointY, left: centerPointX}}>
            <div
              className="mouse-title"
              style={titleStyle}
            >
              <span>{componentName}</span>
            </div>
            <div
              className="mouse-top-left-second-btn mouse-rectangle-btn umy-icon-cancel-circle"
              onClick={this.clearMousePosition}
            >
            </div>
            <div
              className="mouse-top-left-btn mouse-rectangle-btn umy-icon-arrow-up-left"
              title="Select parent component"
              onClick={this.handleButtonClick(selectedKey, onSelectParent)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            >
            </div>
            <div
              className="mouse-top-center-btn mouse-circle-btn umy-icon-arrow-plus-down"
              title="Append before selected"
              onClick={this.handleButtonClick(selectedKey, onBefore)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-top-right-btn mouse-circle-btn umy-icon-replace"
              title="Replace selected"
              onClick={this.handleButtonClick(selectedKey, onReplace)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-right-center-btn mouse-circle-btn umy-icon-arrow-plus-down rotate-clockwise"
              title="Insert into selected as last child"
              onClick={this.handleButtonClick(selectedKey, onLast)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-bottom-right-btn mouse-rectangle-btn umy-icon-cut"
              title="Cut selected into clipboard"
              onClick={this.handleButtonClick(selectedKey, onCut)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-bottom-center-btn mouse-circle-btn umy-icon-arrow-plus-up"
              title="Append after selected"
              onClick={this.handleButtonClick(selectedKey, onAfter)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-bottom-left-btn mouse-rectangle-btn umy-icon-copy"
              title="Copy selected into clipboard"
              onClick={this.handleButtonClick(selectedKey, onCopy)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-bottom-left-second-btn mouse-rectangle-btn umy-icon-duplicate"
              title="Clone selected"
              onClick={this.handleButtonClick(selectedKey, onClone)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-left-center-btn mouse-circle-btn umy-icon-arrow-plus-up rotate-clockwise"
              title="Insert into selected as first child"
              onClick={this.handleButtonClick(selectedKey, onFirst)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
            <div
              className="mouse-left-center-second-btn mouse-rectangle-btn umy-icon-delete mouse-button-warning"
              title="Delete selected"
              onClick={this.handleButtonClick(selectedKey, onDelete)}
              onMouseOver={this.handleMouseEnterLine}
              onMouseOut={this.handleMouseLeaveLine}
            />
          </div>
          }
        </div>
      );
    } else {
      const style = {
        display: 'none'
      };
      content = (<span style={style}/>);
    }
    return content;
  }

}

export default SelectedOverlay;
