import React from 'react';

import './index.less';

/*// 组件内包含的内容会挂载到组件的 props.children
在LeftNav 组件中引入了MyButton
例如：
    1、<MyButton>退出</MyButton>
props.children: '退出'
2、<MyButton>
  <span>退出</span>
</MyButton>
props.children:{
  虚拟对象上有一个props.children: '退出'
}*/
export default function MyButton(props) {
  return <button className="my-button" {...props}/>
}