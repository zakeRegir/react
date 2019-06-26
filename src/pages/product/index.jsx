import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import SaveUpdate from "./save-update";
import Index from "./index/index";
import Detail from "./detail";

export default class Product extends Component {
  render() {
    return <Switch>
      <Route path='/product/index' component={Index}/>
      <Route path='/product/detail' component={Detail}/>
      <Route path='/product/saveupdate' component={SaveUpdate}/>
      <Redirect to='/product/index'/>
    </Switch>;
  }
}