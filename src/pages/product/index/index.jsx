import React, {Component} from 'react';
import {Card, Button, Select, Icon, Table} from 'antd';
import './index.less'
import Input from "antd/lib/input";
import MyButton from '../../../components/my-button';
import {reqProducts} from '../../../api';

const {Option} = Select;

export default class Index extends Component {
  state = {
    products: []
  }

  //获取商品分页列表
  async componentDidMount() {
    //参数是请求哪一页的数据和每页显示的商品数量
    const result = await reqProducts(1, 3);

    if (result) {
      this.setState({
        products: result.list
      })
    }
  }

  showAddProduct = () => {
    this.props.history.push('/product/saveupdate')
  }

  render() {
    const {products} = this.state;
    /*console.log(products);
    console.log(products._id);*/

    //columns:每一列的表头  dataIndex:对应<Table>要展示哪一项数据，如果不写，就全部展示
    //参照api接口给出的数据来决定每一项值的命名，要与数据一一对应
    //如果要渲染虚拟dom对象，必须用render,render的值是一个函数
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        className: 'product-status',
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          return status === 1
            ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        className: 'product-status',
        title: '操作',
        //没有定义dataIndex，会将所有的商品数据都传进来
        render: (product) => {
          return <div>
            <MyButton>详情</MyButton>
            <MyButton>修改</MyButton>
          </div>
        }
      },
    ]

    // extra:卡片右上角的操作区域
    //<Option>中必须有一个value，<Select>中的defaultValue的值，与其对应，表示默认显示哪一项
    /*dataSource:要渲染的数据，会根据columns中每一列的定义去渲染
      bordered:变框，有默认值
      pagination：分页
    * */
    return <Card
      title={
        <div>
          <Select defaultValue={0}>
            <Option key={0} value={0}>根据商品名称</Option>
            <Option key={1} value={1}>根据商品描述</Option>
          </Select>
          <Input placeholder='关键字' className='search-input'/>
          <Button>搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={this.showAddProduct}><Icon type="plus"/>添加产品</Button>}
    >

      <Table
        columns={columns}
        dataSource={products}
        bordered
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3
        }}
        rowKey='_id'
      />
    </Card>;
  }
}