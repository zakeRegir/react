import ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';

//调用之前，先将确定的参数传入，在页面中调用时，只需要传入数据就可以了


//用分别暴露
export const reqLogin = (username, password) => {
  return ajax('/login', {username, password}, 'post')
}

//请求验证用户信息
export const reqValidateUserInfo = (id) => {
  /*
  在服务器中加入验证用户信息的方法，用户名和其他信息都可以作假，id是一个哈希值，很难被命中
  所以判断一下id是否存在
  */
  //请求路径、数据、方式
  return ajax('/validate/user', {id}, 'post')
}

//一定要用函数包裹起来，否则只要加载文件就会发送请求，如果使用函数，就可以在需要用到数据的时候直接调用函数
export const reqWeather = function () {
  // jsonp：发送的请求是一个异步回调函数
  //异步回调会在同步代码执行完之后再执行，不能直接得到返回值
  // 想要得到异步回调函数返回值，需要使用promise处理
  return new Promise((resolve, reject) => {
    //请求天气，天气的api接口规定必须要用jsonp来发送请求
    return jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'),{}, function(err, data){
      if(!err){
        const { dayPictureUrl, weather } = data.result[0].weather_data[0];
        //返回成功状态的数据
        resolve({
          weatherImg: dayPictureUrl,
          weather
        });
      }else{
        //message：蚂蚁金服中的错误提示
        message.error('请求天气信息失败~请刷新试试~ ');
        resolve();
      }
    }
  })
};

//请求服务器上的数据，api文档中有详细数据
export  const reqCategories = (parentId) => ajax('/manage/category/list',{parentId});