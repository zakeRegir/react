import ajax from './ajax';
import jsonp from 'jsonp';
import {message} from 'antd';

//调用之前，先将确定的参数传入，在页面中调用时，只需要传入数据就可以了
//用分别暴露

//请求登录的用户名密码
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




//请求天气数据，用的是jsonp发送的请求
export const reqWeather = function () {
  /*
  * 一定要用函数包裹起来，否则只要加载文件就会发送请求，如果使用函数，就可以在需要用到数据的时候直接调用函数
  jsonp：发送的请求是一个异步回调函数
  异步回调会在同步代码执行完之后再执行，不能直接得到返回值
  想要得到异步回调函数返回值，需要使用promise处理
  * */
  //jsonp的返回值是一个cancel函数，只要调用这个函数，就可以取消jsonp
  //定义一个变量，保存一下jsonp的返回值
  let cancel = null;
  const promise = new Promise((resolve, reject) => {
    //请求天气，天气的api接口规定必须要用jsonp来发送请求
    cancel = jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,{}, function(err, data){
      /*
      try/catch : try里面放可能出错的代码，catch是出现异常之后的提示
      */
      try{
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
      } catch (e) {
        message.error('请求天气信息失败~请刷新试试~ ');
        resolve();
      }
    })
  })
  //将请求回来的数据，和取消jsonp请求的方法返回出去
  return {
    promise,
    cancel
  }
};

//请求服务器上的数据，api文档中有详细数据
/*|参数     |是否必选 |类型     |说明
|parentId    |Y       |string   |父级分类的ID*/
export  const reqCategories = (parentId) => ajax('/manage/category/list',{parentId});

//请求分类数据
export  const reqAddCategory = (parentId,categoryName) => ajax('/manage/category/add',{parentId,categoryName},'post');

//修改分类名称
export const reqUpdateCategoryName = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'post');

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list',{pageNum, pageSize});

//添加商品
export const reqAddProduct = ({name, desc, price, categoryId, pCategoryId,detail}) => ajax('/manage/product/add',{name, desc, price, categoryId, pCategoryId,detail}, 'post');

//删除图片
export const reqDeleteProductImg = (name, id) => ajax('/manage/img/delete', {name, id}, 'post');

//获取角色列表
export const reqGetRoles = () => ajax('/manage/role/list');

//添加角色
export const reqAddRole = (name) => ajax('manage/role/add',{name}, 'post' );

//设置角色权限
export const reqUpdateRole = (_id, auth_name, menus) => ajax('/manage/role/update', {_id, auth_name, menus: JSON.stringify(menus)}, 'post');