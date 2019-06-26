import React, {Component} from 'react';
import {Layout} from 'antd';
import { Route,Switch, Redirect } from 'react-router-dom';

import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';

import {getItem} from "../../utils/storage-tools";
import {reqValidateUserInfo} from "../../api";

const {Header, Content, Footer, Sider} = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
    isLoading:true,
    success:false
  };
  onCollapse = collapsed => {
    this.setState({collapsed});
  };

// 判断登录是否成功
  async componentWillMount() {
    // getItem():读取localStorage的值
    const user = getItem();

    //如果localStorage中有值，并且有id属性
    if (user && user._id) {
      // 发送请求验证 用户信息是否合法
      // 如果用户是登录进来的，就不需要。如果用户是使用之前的值，刷新访问进行来，就需要
      // reqValidateUserInfo，调用封装好的ajax请求
      const result = await reqValidateUserInfo(user._id);

      //如果存在id就直接退出条件判断语句，不用再执行重定向到登录页面的代码
      //为了防止有人伪造用户信息，因为在浏览器的localStorage中可以手动添加用户信息
      // 但是id是服务返回的数据，一个哈希值。不能伪造，所以要再判断一下id是否匹配的上
      if (result) {
        //定义两个状态：isLoading：发送ajax请求    success：登录成功
        return this.setState({
          isLoading:false,
          success:true
        })
      }
    }
    // this.props.history.replace('/login');  直接重定向会被render中重定向的值给覆盖

    //登陆失败
    this.setState({
      isLoading: false,
      success:false
    })
  }

  render() {
    const {collapsed, isLoading, success} = this.state;

    //发送ajax请求时返回一个空白页面，return  null代表一个空白页面
    //必须返回一个虚拟dom对象，或者返回null才不会报错
    if(isLoading) return  null;

    //success为ture代表登陆成功，返回页面。登陆失败就重定向到/login登陆页面
    return success ? <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{background: '#fff', padding: 0, minHeight: 100}}>
            <HeaderMain/>
          </Header>
          <Content style={{margin: '25px 16px'}}>
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/category" component={Category}/>
                <Route path="/product" component={Product}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/charts/line" component={Line}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Redirect to="/home"/>
              </Switch>
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout> : <Redirect to='/login'/>
  }
}