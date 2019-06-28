import React, {Component} from 'react';
import {Card, Button, Table, Radio, Modal,message} from 'antd';
import dayjs from 'dayjs';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import {reqGetRoles,reqAddRole} from "../../api";
import {getItem} from "../../utils/storage-tools";
import {reqUpdateRole} from "../../api";

const RadioGroup = Radio.Group;

export default class Role extends Component {
  state = {
    value: '',  //单选的默认值，也就是选中的某个角色的id值
    roles: [
      /*{
        "menus": [
          "/home",
          "/products",
          "/category",
          "/product",
          "/user",
          "/role"
        ],
        "_id": "5d0bb993f8ca7308982fe8ab",
        "name": "manager",
        "create_time": 1561049491919,
        "__v": 0,
        "auth_time": 1561049701194,
        "auth_name": "admin"
      }*/
    ], //权限数组
    isShowAddRoleModal: false, //是否展示创建角色的标识
    isShowUpdateRoleModal: false, //是否展示设置角色的标识
    isDisabled: true
  };

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
      isDisabled: false
    });
  };

  toggleDisplay = (stateName, stateValue) => {
    return () => this.setState({[stateName]: stateValue})
  };

  //创建角色的回调函数
  addRole = () => {
    //addRoleForm：创建角色的组件，通过Form.create()()暴露出来的
    //validateFields: 收集表单数据，form上的方法
    this.addRoleForm.props.form.validateFields(async (err,value)=>{
      if(!err){
        const result = await reqAddRole(value.name);
        if(result){
          message.success('添加角色成功');
          this.setState({
            roles: [...this.state.roles, result],
            isShowAddRoleModal:false
          })
        }
      }
    })
  };
  //设置角色权限的回调函数
  updateRole = async () => {
    //收集数据 roleId  authName menus
    const _id = this.state.value ;
    const auth_name = getItem().username;
    //从updateRoleForm中获取checkedKeys：一个包含被选中权限路径的数组
    const menus = this.updateRoleForm.state.checkedKeys;

    const result = await reqUpdateRole(_id, auth_name, menus);

    if(result){
      message.success('更新角色成功');
      this.setState({
        isShowUpdateRoleModal:false,
        roles: this.state.roles.map((role) =>{
          console.log(role);
          if(role._id === _id){
            //id相等就用最新的数据
            return result;
          }
          //不相等就用之前的数据
          return  role;
        })
      })
    }
  };

  //请求角色数据
  async componentDidMount() {
    const result = await reqGetRoles();
    if (result) {
      this.setState({
        roles: result,
      })
    }
  }

  render() {
    const {roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal} = this.state;

    //roles上有一个name属性，是选中的那一项的角色名称
    ////单选的默认值，也就是选中的某个角色的id值
    const role = roles.find((role) => role._id === value);

    const columns = [
      {
        dataIndex: '_id',
        render: id => <Radio value={id}/>
      }, {
        title: '角色名称',
        dataIndex: 'name',
      }, {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (time) => dayjs(time).format('YYYY-MM-DD HH-mm-ss')
      }, {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (time) => dayjs(time).format('YYYY-MM-DD HH-mm-ss')
      }, {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ];

    return (
      <Card
        title={
          <div>
            <Button type='primary' onClick={this.toggleDisplay('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled}
                    onClick={this.toggleDisplay('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </div>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
          <Table
            columns={columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>

        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.toggleDisplay('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm wrappedComponentRef={(form) => this.addRoleForm = form}/>
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.updateRole}
          onCancel={this.toggleDisplay('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm
            wrappedComponentRef={(form) => this.updateRoleForm = form}
            //选中某一项的时候才会有role，否则role为undefined
            //将name通过标签属性的方式传给UpdateRoleForm组件
            name = { role ? role.name : '' }
          />
        </Modal>

      </Card>
    )
  }
}
