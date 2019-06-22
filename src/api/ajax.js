import axios from 'axios';
import { message } from 'antd';


//封装一个发送axios请求校验的函数，在login中直接引入调用
/*参数：url  请求路径
     data 请求的数据，并设置默认参数为一个空对象，如果不传参就使用默认参数
     method 请求方式，默认是get
*/
/*
API接口给出的，请求成功和失败返回的数据

成功:
          {
            "status": 0,
            "data": {
            "_id": "5c3b297dea95883f340178b0",
              "username": "admin",
              "create_time": 1547381117891,
              "__v": 0,
              "role": {
              "menus": []
            }
          }
          }
          失败
          {
            "status": 1,
            "msg": "用户名或密码不正确!"
          }*/

//ajax函数的返回值是执行promise返回的结果
//如果执行.then 就会返回.then的返回值，.catch没有设置返回值，直接提示错误信息
export default function ajax(url, data={}, method='get') {
  //在axios请求中get请求和post请求传参不一样
  //先判断请求方式，再处理数据
  let reqParams = data;
  //转化成小写，请求方式严格区分大小写
  method = method.toLowerCase();

  if(method === 'get'){
    reqParams = {
      //get请求传参，第二个参数：params：{ }
      //post请求直接传入路径和数据
      params: data
    }
  }

  //[method]:变量要用对象[]的形式，不能用对象.
   return axios[method](url, reqParams)
      .then((res) => {
        const {data} = res;
        if (data.status === 0) {
          //data.data :第一个data是传入的参数，第二个data是API文档中给出的，请求成功会返回一个对象中的data属性，值是用户的信息
          return data.data;
        } else {
          message.error(data.msg, 2);
        }
      })
      .catch((err) => {
        // 请求失败：网络错误、服务器内部错误等
        message.error('网络出现异常，请刷新试试~', 2);
      })
 }