import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { getPagePathName } from './commons/constants.js';
import pageDefaultModel from './commons/model.js';
import { createElements } from './commons/pageUtils.js';

import MouseOverOverlay from './MouseOverOverlay.js';
import SelectedOverlay from './SelectedOverlay.js';
import HighlightedOverlay from './HighlightedOverlay.js';
import ClipboardOverlay from './ClipboardOverlay.js';

class PageForDesk extends Component {

  constructor (props, content) {
    super(props, content);

    this.state = {
      isEditModeOn: true,
      updateCounter: 0
    };
    this.elementTree = [];
    this.initialState = {elements: {}};

    this.updatePageModel = this.updatePageModel.bind(this);
    this.bindGetPagePath = this.bindGetPagePath.bind(this);
    this.bindGetPageModel = this.bindGetPageModel.bind(this);
    this.bindGetMarked = this.bindGetMarked.bind(this);
    this.bindGetShowBlueprintButtons = this.bindGetShowBlueprintButtons.bind(this);
    this.bindOnComponentMouseDown = this.bindOnComponentMouseDown.bind(this);
    this.getModelByPathname = this.getModelByPathname.bind(this);
    this.updateMarks = this.updateMarks.bind(this);
  }

  bindGetPagePath (func) {
    this.getPagePath = func;
  }

  bindGetPageModel (func) {
    this.getPageModel = func;
  }

  bindGetMarked (func) {
    this.getMarked = func;
  }

  bindGetMode (func) {
    this.getMode = func;
  }

  bindGetShowBlueprintButtons (func) {
    this.getShowBlueprintButtons = func;
  }

  bindOnComponentMouseDown (func) {
    this.onComponentMouseDown = func;
  }

  bindOnPathnameChanged (func) {
    this.onPathnameChanged = func;
  }

  bindToState (signature, func) {
    this.initialState[signature] = func;
  }

  componentDidMount () {
    if (window.onPageDidMount) {
      window.onPageDidMount(this);
      if (this.updatePageModel) {
        const pathname = getPagePathName(this.props.location.pathname);
        const nextPagePath = this.getPagePath(pathname);
        this.updatePageModel({
          pathname: nextPagePath
        });
        if (this.onPathnameChanged) {
          this.onPathnameChanged(nextPagePath);
        }
      }
    }
  }

  componentWillUnmount () {
    this.initialState = undefined;
    this.elementTree = undefined;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname
      || isEqual(nextProps.location.query, this.props.location.query)) {
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

  shouldComponentUpdate (nextProps, nextState) {
    return (this.state.updateCounter !== nextProps.updateCounter);
  }

  updatePageModel (options) {
    let {pathname} = options;
    let pageModel = this.getModelByPathname(pathname);
    // console.log('Page model: ', JSON.stringify(pageModel, null, 4));
    const isEditModeOn = this.getMode();
    this.elementTree = createElements(pageModel, this.initialState, this.onComponentMouseDown, {
      isEditModeOn: isEditModeOn
    });
    this.setState({
      pathname: pathname,
      isEditModeOn: isEditModeOn,
      updateCounter: this.state.updateCounter + 1
    });
  }

  updateMarks (options) {
    let {pathname} = options;
    this.setState({
      pathname: pathname,
      updateCounter: this.state.updateCounter + 1
    });
  }

  getModelByPathname (pathname) {
    let pageModel = this.getPageModel(pathname);
    if (!pageModel) {
      pageModel = pageDefaultModel;
      pageModel.children[0].children[0].modelNode.text =
        'Route was not found: ' + pathname + '. Try to select another route.';
    }
    return pageModel;
  }

  render () {
    let boundaryOverlays = [];
    let selectedKeys = undefined;
    if (this.state.isEditModeOn && this.state.pathname) {
      const showBlueprintButtons = this.getShowBlueprintButtons ? this.getShowBlueprintButtons() : true;
      const {selected, highlighted, forCutting, forCopying} = this.getMarked(this.state.pathname);
      if (selected && selected.length > 0) {
        selectedKeys = selected;
        selected.forEach(key => {
          boundaryOverlays.push(
            <SelectedOverlay
              key={'selected' + key}
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
              key={'forCutting' + key}
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
              key={'forCopying' + key}
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
              key={'highlighted' + key}
              initialState={this.initialState}
              selectedKey={key}
            />
          );
        });
      }
    }
    return (
      <div id="pageContainer" style={{padding: '0.1px'}}>
        {this.elementTree}
        {boundaryOverlays}
        {this.state.isEditModeOn ? <MouseOverOverlay
          key="mouseOverBoundary"
          ref="mouseOverBoundary"
          initialState={this.initialState}
          selectedKeys={selectedKeys}
          bSize="1px"
        />
          : null
        }
      </div>
    );
  }

}

export default PageForDesk;

