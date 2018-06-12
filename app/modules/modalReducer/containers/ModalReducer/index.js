/**
 *
 * ModalReducer Redux Container
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectName } from "./selectors";
import { sampleAction } from "./actions";

import { Modal } from "modules/antd";

const style = { width: "100px", height: "50px" };

class ModalReducer extends Component {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.handleEvent = this.handleEvent.bind(this);
    this.state = {
      exampleValue: ""
    };
  }

  handleEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    const { dispatch, name } = this.props; // eslint-disable-line
    dispatch(sampleAction(name));
  }

  render() {
    const { exampleValue } = this.state; // eslint-disable-line
    const { exampleProp } = this.props; // eslint-disable-line
    return (
      <Modal
        width={100}
        height={50}
        x={8}
        y={10}
        visible={false}
        key="7"
        style={style}
      >

        <p><span>你确定提交吗</span></p>

      </Modal>
    ); // eslint-disable-line
  }
}

ModalReducer.propTypes = {
  dispatch: PropTypes.func,
  name: PropTypes.string,
  exampleProp: PropTypes.string
};

ModalReducer.defaultProps = {
  exampleProp: ""
};

const mapStateToProps = createStructuredSelector({
  name: selectName()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalReducer);
