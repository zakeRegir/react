import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal} from 'antd';
import dayjs from 'dayjs';

import './index.less';
import MyButton from '../my-button';
import {getItem, removeItem} from '../../utils/storage-tools';
import {reqWeather} from '../../api';
import menuList from '../../config/menu-config';


class HeaderMain extends Component {
  //更新页面必须使用状态数据
  //状态没更新时，默认显示晴天的信息
  state = {
    sysTime: Date.now(),
    weather: '晴',
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png'
  }

  componentWillMount() {
    //读取storage中存储的用户名，生命周期函数是一个异步函数，返回值不能直接拿到，所以要挂载到this上
    this.username = getItem().username;
    this.title = this.getTitle(this.props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    //参数是当前页面的props属性，nextProps上保存的是当前的props，nextContext保存的是上一次的
    this.title = this.getTitle(nextProps)
  }

  //发送请求使用promise处理的，所以要用async/await读取数据
  //更新时间一定要在请求天气数据之前，这样才能更新时间，如果在请求天气之后，时间不会更新
  async componentDidMount() {
    //更新时间，但是时间的格式需要下载一个dayjs库来处理
    //{ dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss') }
    this.timer = setInterval(() => {
      this.setState({
        sysTime: Date.now()
      })
    }, 1000)

    // 发送请求，请求天气
    //cancel：取消请求的方法，promise;请求回来的数据
    const { cancel, promise } = reqWeather();
    this.cancel = cancel;
    const result = await promise;

    if (result) {
      this.setState(result);
    }
  }

  //退出登录
  logout = () => {
    //蚂蚁金服的提示框，有确认和取消两个状态
    Modal.confirm({
      title: '您确定要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      //点击确认触发的回调
      onOk: () => {
        // 清空本地storage中的数据
        removeItem();
        // 退出登录
        this.props.history.replace('/login');
      }
    })
  }

  //清除定时器，和请求天气数据的ajax请求
  //只要组件整体在页面上没有任何体现，就相当于被卸载了
  // 退出登录之后，因为组件被卸载了，但是定时器和ajax没有被取消，所以会产生内存泄漏
  componentWillUnmount() {
    clearInterval(this.timer);
    // 取消了ajax请求
    this.cancel();
  }

  //根据路径，切换头部右上角的文字
  /*初始化渲染和更新都需要切换
  如果在render中调用可以做到，但是因为上面componentDidMount中有一个定时器，用来更新时间，放在render中的代码会更新多次
  路径代码只需要渲染一次就可以了，所以需要分别在componentWillMount和componentWillReceiveProps中调用，才能满足需求
  */
  getTitle = (nextProps) => {
    //当前页面路径,路由组件的三大属性，props上的三大属性history、location、match
    let {pathname} = nextProps.location;

    //处理product上的三级路由路径
    const pathnameReg = /^\/product\//;
    if(pathnameReg.test(pathname)){
      pathname = pathname.slice(0,8);
    }


    //因为有二级目录，所以要使用双层for循环嵌套的方式
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      //二级目录
      if (menu.children) {
        for (let j = 0; j < menu.children.length; j++) {
          const item = menu.children[j];
          if (item.key === pathname) {
            return item.title;
          }
        }
      } else {
        //一级目录
        if (menu.key === pathname) {
          return menu.title;
        }
      }
    }
  }

  render() {
    const {sysTime, weather, weatherImg} = this.state;

    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg} alt="weatherImg"/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(HeaderMain);