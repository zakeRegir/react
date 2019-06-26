/*
添加品类弹框中的表单

需要验证数据、收集数据：
    Form.create()(AddCategoryForm) :
          调用两次，第二次传入组件
          向组件中传入一个标签属性form

*/

import React, { Component } from 'react';
import {Form, Input, Select } from "antd";
const { Item } = Form;
const { Option } = Select;

class AddCategoryForm extends Component{
  //自定义校验
  validator = (rule, value, callback) => {
    if (!value) return callback('请输入分类名称~');
    const result = this.props.categories.find((category) => category.name === value);
    if (result) {
      callback('输入的分类名称已存在，请重新输入');
    } else {
      callback();
    }
  };

  render (){
    const { getFieldDecorator } = this.props.form;

    /*getFieldDecorator：form属性上的api，用于和表单进行双向绑定，常用于校验表单和收集表单数据
    调用两次：
        第一次调用：表单验证，两个参数
            1、值的名称
            2、一个对象，表单的限制条件。
                        initialValue：初始值
                        表单校验有两种写法：rules、validator自定义校验
        第二次调用：传入一个组件
    * */
    /*Option：下拉列表的每一项
                  value：代表选中的是哪一项，查看api文档，需要传入的参数是parentId和分类名称
                          所以value的赋值为parentId
                          一级分类的parentId是0，二级分类的parentId父级的id
                  */
    return <Form>
      <Item label="所属分类">
        {
          getFieldDecorator(
            'parentId', {
              initialValue: '0'
            }
          )(
            <Select style={{ width: '100%' }} onChange={this.handleChange}>

              <Option value="0" key="0">一级分类</Option>
              {
                //categories: 一级分类列表，从Category组件中传入的标签属性
                this.props.categories.map((category) => {
                  return <Option value={category._id} key={category._id}>{category.name}</Option>
                })
              }
            </Select>
          )
        }
      </Item>
      <Item label="分类名称">
        {
          getFieldDecorator(
            'categoryName',
            {
              // rules: [{required: true, message: '请输入分类名称'}]
              rules: [{validator: this.validator}]
            }
          )(
            <Input placeholder="请输入分类名称"/>
          )
        }
      </Item>
    </Form>;
  }
}

/*
经过 Form.create 包装的组件将会自带 this.props.form 属性，form属性中有很多api
*/
export default Form.create()(AddCategoryForm);