const USER_TIME = 'USER_TIME';
const USER_KEY = 'USER_KEY';

//有效期，七天
const EXPIRES_IN = 1000 * 3600 * 24 * 7;

//分别暴露，引入时要用解构赋值
//读取localStorage
//只有登录成功才能跳转到其他页面，否则就重定向到登录页面，Admin组件是其他页面组件的入口文件，在admin中判断
export const getItem = () => {
  const startTime = localStorage.getItem(USER_TIME);

  //时间超过七天过期了，清除用户信息
  if (Date.now() - startTime > EXPIRES_IN) {
    //removeItem 方法是在后面设置的，const声明的变量不会提前，是不能在声明之前调用的，但是在外部引入该方法时，会先读取所有方法再调用
    removeItem();

    //不能return false，因为在调用的时候是用对象. 的方式调用的，返回undefined可能会报错
    return {};
  }

  //没有过期
  return JSON.parse(localStorage.getItem(USER_KEY));
};

//设置,要将用户的信息传进来
//只有用户登录成功时才有收集用户信息，并保存设置的必要，所以在Login组件中，判断登录成功后再调用该方法
export const setItem = (data) => {
  //储存用户第一次登录时间
  localStorage.setItem(USER_TIME, Date.now());
  //储存用户数据
  //本地只能保存字符串数据，API文档中返回的data是一个对象
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};

export const removeItem = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_TIME);
}

