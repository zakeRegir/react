import React, {Component} from 'react';
import {Icon, Menu} from "antd";
import {Link, withRouter} from 'react-router-dom';

//左边菜单栏的数据
import menuList from '../../config/menu-config'

import './index.less';
import logo from '../../assets/images/logo.png';

const {SubMenu, Item} = Menu;


class LeftNav extends Component {

  //一级菜单
  createMenu = (menuList) => {
    return <Item key={menuList.key}>
      <Link to={menuList.key}>
        <Icon type={menuList.icon}/>
        <span>{menuList.title}</span>
      </Link>
    </Item>
  }

  componentWillMount() {
    //页面路径
    const {pathname} = this.props.location;

    // 根据menuList生成菜单
    //先遍历数据，如果是二级菜单，要再遍历一次children中的数据
    //需要在render中渲染数据，但是生命周期函数不是由我们调用的，所以返回值拿不到，需要在this上添加一个属性
    this.menus = menuList.map((menu) => {
      //children中保存的是二级菜单的数据，所以根据对象上是否有children就可以判断是否是二级菜单
      const children = menu.children;
      //判断是一级菜单还是二级菜单
      if (children) {
        return <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon}/>
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            children.map((item) => {
              if (item.key === pathname) {
                // 说明当前地址是一个二级菜单，需要展开一级菜单
                // 初始化展开的菜单
                this.openKey = menu.key;
              }
              return this.createMenu(item)
            })
          }
        </SubMenu>
      } else {
        return this.createMenu(menu);
      }
    })

    //初始化选中菜单，切换到根据页面路径，决定左侧菜单栏选中哪一项
    // 再当前函数中的数据函数外部拿不到，所以给this上添加属性
    this.selectedKey = pathname;

    console.log(this.selectedKey)
  }

  render() {
    const {collapsed} = this.props;

    return <div>
      <Link className="left-nav-logo" to='/home'>
        <img src={logo} alt="logo"/>
        <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
      </Link>
      <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
        {
          this.menus
        }
        {/*<Item key="home">
          <Link to="/home">
            <Icon type="home"/>
            <span>首页</span>
          </Link>
        </Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="appstore"/>
              <span>商品</span>
            </span>
          }
        >
          <Item key="/category">
            <Link to="/category">
              <Icon type="bars"/>
              <span>品类管理</span>
            </Link>
          </Item>
          <Item key="4">
            <Icon type="tool"/>
            <span>商品管理</span>
          </Item>
        </SubMenu>
        <Item key="5">
          <Icon type="user"/>
          <span>用户管理</span>
        </Item>
        <Item key="6">
          <Icon type="user"/>
          <span>权限管理</span>
        </Item>
        <SubMenu
          key="sub2"
          title={
            <span>
                <Icon type="team"/>
                <span>图形图表</span>
              </span>
          }
        >
          <Item key="7">
            <Icon type="team"/>
            <span>柱形图</span>
          </Item>
          <Item key="8">
            <Icon type="team"/>
            <span>折线图</span>
          </Item>
          <Item key="9">
            <Icon type="team"/>
            <span>饼图</span>
          </Item>
        </SubMenu>*/}
      </Menu>
    </div>;
  }
}

// withRouter是一个高阶组件，向非路由组件传递三大属性：history、location、match
export default withRouter(LeftNav);