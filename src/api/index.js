import ajax from './ajax';

//用分别暴露
export  const reqLogin = (username, password) =>{
  return ajax('/login', { username, password }, 'post')
}