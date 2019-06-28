import React, {Component} from 'react';
import {Form, Input, Tree} from 'antd';
import PropTyeps from 'prop-types';

//左侧菜单栏的数据，设置角色权限就是设置展示哪几个页面
//左侧菜单的数据结构和‘antd中Tree树形控件’中展示的数据结构相同，只需要把数据替换就能实现功能
import menuList from '../../config/menu-config'

const Item = Form.Item;
const { TreeNode } = Tree;

class UpdateRoleForm extends Component {
  static propTypes = {
    name: PropTyeps.string.isRequired
  };

  state = {
    checkedKeys: [],
  };

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };
  
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
  
  render () {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form>
        <Item label='角色名称'>
          {
            getFieldDecorator(
              'name',
              {
                //默认值，在index.jsx中通过标签属性的方式传入
                initialValue: this.props.name
              }
            )(
              <Input placeholder='请输入角色名称' disabled/>
            )
          }
        </Item>
        <Item>
          <Tree
            checkable
            //点击复选框触发
            //返回值是一个数组，被选中的那一项，路由地址会添加到数组中
            // 但是只有一级目录下的二级目录全部被选中，该一级分类的地址才会被添加进去
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            defaultExpandAll={true}  // 默认展开所有树节点,要将上面设置所有的Expand相关的值全部取消
          >
            {this.renderTreeNodes(menuList)}
          </Tree>
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateRoleForm);