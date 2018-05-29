/**
 *
 * Page7
 *
 */

import React, { Component } from "react";

import { IndexLink } from "react-router";
import { Button } from "antd";
import { ThemeProvider, LayoutContainer, LayoutItem } from "modules/MUI";

class Page7 extends Component {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1em"
          }}
        >
          <div />
        </div>

        <IndexLink to="/main"><span>IndexLink to /main</span></IndexLink>

        <Button
          label="Search"
          value="Text"
          type="primary"
          backgroundColor="red"
          style={{ backgroundColor: "red", width: "200px", height: "100px" }}
        />

        <div><Counter1 /></div>

        <ThemeProvider>
          <LayoutContainer gutter={24}><LayoutItem xs={12} /></LayoutContainer>
        </ThemeProvider>

      </div>
    ); // eslint-disable-line
  }
}

export default Page7;
