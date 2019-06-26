import React from 'react';
import {Form, Icon, Input, Button} from 'antd';

import {setItem} from '../../utils/storage-tools';

// import ajax from '../../api/ajax'
//用的是分别暴露，所以引入的时候要解构赋值
import {reqLogin} from '../../api';
import './index.less';
//在React中图片资源需要引入
//<img src={logo}/>   在标签中直接src属性中直接写变量
import logo from './logo.png';

const Item = Form.Item;

//工厂函数组件中，只有一个参数，就是props
//函数中没有this，所有的方法都要定义成变量
function Login(props) {
  //提交表单
  const login = (e) => {
    e.preventDefault();
    //validateFields:校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    props.form.validateFields(async (error, values) => {
      //校验通过
      if (!error) {
        const {username, password} = values;
        //我们请求的服务器接口是http://localhost:5000

        //1、直接在login中发请求
        /* axios.post('/login',{ username, password })
           .then((res) =>{
             const { data } = res;
             //status和msg是API接口文档给出的数据
             //status：为0 代表请求成功
             if(data.status === 0){
               this.props.history.replace('/');
             }else{
               //message.error：错误提示，第一个参数是提示的内容，第二个参数是提示的时间
               message.error(data.msg, 2);
               //请求失败时重置密码
               //resetFields:重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件
               this.props.form.resetFields('[password]');
             }
           })
           .catch((err) =>{
             message.error('网络出现异常，请刷新试试~',2);
             this.props.form.resetFields('[password]');
           })*/


        //2、直接引入定义好的ajax强求函数
        // const result = ajax('/login', {username, password}, 'post');

        //2、在外部封装函数，并在api/index.js文件中将路径和请求方式定死，直接引入调用
        const result = await reqLogin(username, password);

        if (result) {
          /*
          必须要先缓存数据再跳转，否则当跳转时发现没有用户信息，会重定向到登录页面，第二次登录才会成功
          */
          // 只有这里能拿到用户名密码。保存用户信息
          setItem(result);
          // 登录成功
          props.history.replace('/');

        } else {
          // 登录失败
          props.form.resetFields(['password']);
        }

      } else {
        console.log('登录表单校验失败:', error);
      }
    });
  }

  const validator = (rule, value, callback) => {
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
  const {getFieldDecorator} = props.form;

  return (
    <div className='login'>
      <header className='login-header'>
        <img src={logo} alt='logo'/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className='login-content'>
        <h2>用户登录</h2>
        <Form onSubmit={login} className='login-form'>
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
                <Input prefix={<Icon type="user"/>} placeholder='用户名' className='login-input'/>
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
                      validator: validator
                    }
                  ]
                }
              )(
                <Input prefix={<Icon type="lock"/>} placeholder='密码' type='password' className='login-input'/>
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

// Form:高阶组件，第一次调用可以传被返回出来的新组件的名字，第二次调用传一个组件
//通过这个方法，向组件中传入一个标签属性form
export default Form.create()(Login);