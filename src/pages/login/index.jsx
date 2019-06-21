import React,{ Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';

import './index.less';

//在React中图片资源需要引入
//<img src={logo}/>   在标签中直接src属性中直接写变量
import logo from './logo.png';




const Item = Form.Item;
class Login extends Component{

  login = (e) =>{
    e.preventDefault();
  }

  validator = (rule, value, callback) => {
    // callback必须调用
    /*
    rule：组件的名字等信息
    value：输入的值
    */

    //rule.fullField：组件名
    const name = rule.fullField === 'username' ? '用户名' : '密码';

    if (!value) {
      // 没有输入
      callback(`必须输入${name}！`);
    } else if (value.length < 4) {
      callback(`${name}必须大于4位`);
    } else if (value.length > 15) {
      callback(`${name}必须小于15位`);
    } else if (!/^[a-zA-Z_0-9]+$/.test(value)) {
      callback(`${name}只能包含英文字母、数字和下划线`);
    } else {
      // 不传参代表校验通过，传参代表校验失败
      callback();
    }

  }

  //htmlType：原生的type类型
  /*getFieldDecorator:高阶组件，第一次调用传表单校验代码，第二次传组件
  第一次调用可以穿两个参数，第一个参数：代表将第二次调用传入的组件挂在到某个属性上，以后要操作该组件，就直接操作这个属性

  第二个参数：一个配置对象，表单校验的条件。约束条件，错误提示

  */
  //首先要调用Form.create()(Login)方法，得到一个form属性，然后才能获取getFieldDecorator方法
/*
  有两种校验方法：
  validator：自定义校验
  */
  render(){
    const { getFieldDecorator } = this.props.form;

    return(
      <div className='login'>
        <header className='login-header'>
          <img src={logo}/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.login} className='login-form'>
            <Item>
              {
                getFieldDecorator(
                  'username',
                  {
                    rules: [
                      {required: true, message: '请输入用户名！'},
                      {min: 4, message: '用户名必须大于4位'},
                      {max: 15, message: '用户名必须小于15位'},
                      {pattern: /^[a-zA-Z_0-9]+$/, message: '用户名只能包含英文字母、数字和下划线'}
                     /* {
                        validator: this.validator
                      }*/
                    ]
                  }
                )(
                  <Input prefix={<Icon type="user" />} placeholder='用户名' className='login-input'/>
                  )
              }
            </Item>
            <Item>
              {
                getFieldDecorator(
                  'password',
                  {
                    rules: [
                      {
                        validator: this.validator
                      }
                    ]
                  }
                )(
                  <Input prefix={<Icon type="lock" />} placeholder='密码' type='password' className='login-input'/>
                )
              }
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className='button'>登录</Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

// Form:高阶组件，第一次调用可以传被返回出来的新组件的名字，第二次调用传一个组件
//通过这个方法，向组件中传入一个标签属性form
export default Form.create()(Login);