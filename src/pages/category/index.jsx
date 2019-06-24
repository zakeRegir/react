import React, {Component} from 'react';
import {Card, Button, Icon, Table} from 'antd';

import './index.less';
import MyButton from "../../components/my-button";
import {reqCategories} from "../../api";
import ajax from "../../api/ajax";

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
  }

  async componentDidMount() {
    /*
    //api中提供的数据
    一级分类:
    {
      "status": 0,
      "data": [
      {
        "parentId": "0",
        "_id": "5c2ed631f352726338607046",
        "name": "分类001",
        "__v": 0
      }
    ]
    }*/

    //reqCategories在api/index.js中请求parentId，传入参数调用
    //parentId值为0，代表请求的是一级分类
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }

  render() {
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        className: 'category-operation',
        // 改变当列的显示
        render: text => {
          return <div>
            <MyButton>修改名称</MyButton>
            <MyButton>查看其子品类</MyButton>
          </div>
        },
      },
    ];

    return <div>
      <Card title="一级分类列表" extra={<Button type='primary'><Icon type="plus" />添加品类</Button>} >
        <Table
          columns={columns}
          dataSource={this.state.categories}
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
          />
      </Card>

    </div>
  }
}