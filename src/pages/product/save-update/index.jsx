import React, {Component} from 'react';
import {Card, Icon, Form, Input, Cascader, InputNumber, Button} from 'antd';
import RichTextEdior from './rich-text-editor';

import './index.less';
import {reqAddProduct, reqCategories} from '../../../api'
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";

const {Item} = Form;


class SaveUpdate extends Component {
  state = {
    options: []
  }

  richTextEditorRef = React.createRef()

  //选择分类
  async componentDidMount() {
    //请求一级分类的数据
    const result = await reqCategories('0');

    if (result) {
      this.setState({
        options: result.map((item) => {
          return {
            value: item._id,//选中的值，要请求的是二级分类，所以这个值应该用id
            label: item.name,//显示的内容
            isLeaf: false//是否可以情求下一级的数据，false是可以请求
          }
        })
      })
    }
  }

  //加载二级分类的数据
  loadData = async (selectedOptions) => {
    //selectedOptions;选中的一级分类的数据
    //length - 1：数组中的最后一项数据，因为可能有多级分类，但是我们只有一项一级分类的数据
    //所以targetOption就是一级分类数据
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;  //发送请求的小图标，true代表显示，在请求完成时隐藏

    // 请求二级分类数据
    //二级分类数据的parentId等于一级分类的id
    //打印targetOption，其中的value代表的就是id
    const result = await reqCategories(targetOption.value);
    if (result) {
      targetOption.loading = false;

      //二级分类的数据，在一级分类上添加一个children属性保存
      targetOption.children = result.map((item) => {
        return {
          label: item.name,//内容
          value: item._id//选中的值
        }
      });
      this.setState({
        //请求一级分类和二级分类的数据，都是在options数组中添加值，将数据展开用一个新数组保存，保证每次修改之都会被更新
        options: [...this.state.options],
      });
    }
  };


  //提交表单
  addProduct = (e) => {
    //禁止默认事件
    e.preventDefault();

    // 验证表单和收集数据
    this.props.form.validateFields(async (err, values) => {
      //validateFields:只能收集antd定义表单组件的数据
      /*RichTextEdior：富文本编辑器是我们自定义的组件，需要自己收集数据
        要获取的是它的状态数据，组件外获取组建内的数据，两种方法：
            1、边输入边收集，表单内容发生变化时收集数据
            2、点击提交表单按钮时收集：用ref获取子组件中的数据：
                  ref获取普通标签，就是拿到真实DOM元素
                  获取组件，就是拿到组件的实例对象，拿到实例对象就可以用组建上的方法，也可以获取状态数据
      * */
      if (!err) {
        //拿到富文本编辑器中的状态数据，editorState：输入的内容
        const {editorState} = this.richTextEditorRef.current.state;
        //将输入的内容转换成html格式
        const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        //err:错误    values：收集的数据
        const { name, desc, price, categoriesId } = values;

        let pCategoryId = '0';  //parentId
        let categoryId = ''; //商品的id

        //categoriesId: 商品的id，是一个数组。如果只有一个值，表示是一级分类，一级分类的parentId默认为0
        if(categoriesId.length === 1){
          categoryId = categoriesId[0];
        }else{
          //两个值：第一个是parentId，第二个是商品的id
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }

        //发请求
        const result = reqAddProduct({name,desc,price,categoryId,pCategoryId,detail});

        if(result){
          //请求成功，返回index页面，并展示添加的商品
          //不用清除表单内容，因为路由组件切换，相当于卸载当前页，重新渲染另一个页面（初始化渲染）
          //例如：三级页面之间进行切换，一二级路由只会更新
          this.props.history.push('/product/index');
        }
      }
    })

  }

  goBack = () => {
    this.props.history.push('/product/index');
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    /*
    labelCol/ wrapperCol属性: 值是span和offset。
      labelCol代表<Form.Item>中的label属性所占的位置，wrapperCol：<Form.Item>中包裹的元素所占的大小
      将整个屏幕分成24份：span：占24份中的几份，offset：偏移量
      xs：超小屏，sm：小屏

      formItemLayout:在<Form>中展开作为标签属性
      在React中可以用...三点运算符，展开对象，因为Babel会将ES6的代码编译成ES5一下。最终是以for循环的方式展开的
    */
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 2},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
    };

    //<Item>上的label属性：输入框前面的文字
    return <Card
      title={<div className="product-title"><Icon type='arrow-left' className='arrow-icon' onClick={this.goBack}/>添加商品
      </div>}>
      <Form {...formItemLayout} onSubmit={this.addProduct}>
        <Item label="商品名称">
          {
            getFieldDecorator(
              'name',
              {
                rules: [
                  {required: true, message: '请输入商品名称'}
                ]
              }
            )(
              <Input placeholder="请输入商品名称"/>
            )
          }
        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              'desc',
              {
                rules: [
                  {required: true, message: '请输入商品描述'}
                ]
              }
            )(
              <Input placeholder="请输入商品描述"/>
            )
          }
        </Item>
        <Item label="选择分类" wrapperCol={{span: 5}}>
          {
            getFieldDecorator(
              'categoriesId',
              {
                rules: [
                  {required: true, message: '请选择分类'}
                ]
              }
            )(
              <Cascader
                // Cascader级联选择，动态加载选项
                options={this.state.options}
                loadData={this.loadData}
                changeOnSelect
              />
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator(
              'price',
              {
                rules: [
                  {required: true, message: '请输入商品价格'}
                ]
              }
            )(
              <InputNumber
                // 格式化，对输入的数据进行格式化，每个三位加一个逗号
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                //获取值的时候，将前面的￥转换成'',空字符串
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                className="input-number"
              />
            )
          }
        </Item>
        <Item label="商品详情" wrapperCol={{span: 20}}>
          <RichTextEdior ref={this.richTextEditorRef}/>
        </Item>
        <Item>
          <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);