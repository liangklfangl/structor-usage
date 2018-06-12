/**
*
* InputGen
*
*/

import React, { Component } from "react";

import PropTypes from "prop-types";

import { Input } from "modules/antd";

const style = { width: "119px", height: "30px" };

class InputGen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exampleValue: ""
    };
  }

  render() {
    const { exampleValue } = this.state; // eslint-disable-line
    const { exampleProp } = this.props; // eslint-disable-line
    return (
      <Input key="6" x={304} width={119} height={30} y={12} style={style} />
    );
  }
}

InputGen.propTypes = {
  exampleProp: PropTypes.string
};
InputGen.defaultProps = {
  exampleProp: ""
};

export default InputGen;
