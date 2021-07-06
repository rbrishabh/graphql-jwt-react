import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Search from "./Components/Search";

type routesProps = {};

const Routes: React.FC<routesProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Home} />
        <Route exact path="/" component={Search} />
      </Switch>
    </BrowserRouter>
  );
};
export default Routes;
