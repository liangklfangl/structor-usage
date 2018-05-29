/**
*
* Counter
*
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, LayoutContainer, LayoutItem } from "modules/MUI";
import { Button } from "antd";
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1em"
};

class Counter extends Component {
  constructor(props) {
    super(props);
    this.handleIncrease = this.handleIncrease.bind(this);
    this.state = {
      counterValue: 0
    };
  }

  handleIncrease(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ counterValue: this.state.counterValue + 1 });
  }

  render() {
    const { counterValue } = this.state; // eslint-disable-line
    console.log("Menu组件被重新reRender", this.props);
    return (
       <div>
       <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        {...this.props}
      >
        <Menu.Item key="mail">
          <Icon type="mail" />Navigation One
        </Menu.Item>
        <Menu.Item key="app" disabled>
          <Icon type="appstore" />Navigation Two
        </Menu.Item>
        <SubMenu title={<span><Icon type="setting" />Navigation Three - Submenu</span>}>
          <MenuItemGroup title="Item 1">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Item 2">
            <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <Menu.Item key="alipay">
          <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
        </Menu.Item>
      </Menu>
      </div>
    );
  }
}

export default Counter;
