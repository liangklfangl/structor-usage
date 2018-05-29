import React from "react";
import HomePage from "./HomePage";
import Page7 from "./Page7";

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default {
  path: "/",
  component: App,
  indexRoute: { component: HomePage },
  childRoutes: [
    {
      path: "/home",
      name: "/home",
      component: HomePage
    },
    {
      path: "/index",
      name: "/index",
      component: Page7
    },
    {
      path: "*",
      name: "notfound",
      component: HomePage
    }
  ]
};
