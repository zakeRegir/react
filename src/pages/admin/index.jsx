import React, {Component} from 'react';
import {Layout} from 'antd';

import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';

import {getItem} from "../../utils/storage-tools";
import {reqValidateUserInfo} from "../../api";

const {Header, Content, Footer, Sider} = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };
  onCollapse = collapsed => {
    this.setState({collapsed});
  };

// 判断登录是否成功
  async componentWillMount() {
    const user = getItem();

    //如果存在用户，并且有id属性
    if (user && user._id) {
      // 发送请求验证 用户信息是否合法
      // 如果用户是登录进来的，就不需要。如果用户是使用之前的值，刷新访问进行来，就需要
      // reqValidateUserInfo，调用封装好的ajax请求
      const result = await reqValidateUserInfo(user._id);

      //如果存在id就直接退出条件判断语句，不用再执行重定向到登录页面的代码
      //为了防止有人伪造用户信息，因为在浏览器的localStorage中可以手动添加用户信息
      // 但是id是服务返回的数据，一个哈希值。不能伪造，所以要再判断一下id是否匹配的上
      if (result) return;
    }
    this.props.history.replace('/login');
  }

  render() {
    const {collapsed} = this.state;

    return (
      <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{background: '#fff', padding: 0, minHeight: 100}}>
            <HeaderMain/>
          </Header>
          <Content style={{margin: '25px 16px'}}>
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
              欢迎使用硅谷后台管理系统
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}