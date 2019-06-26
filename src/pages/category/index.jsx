import React, {Component} from 'react';
import {Card, Button, Icon, Table, Modal, message} from 'antd';

import './index.less';
import MyButton from "../../components/my-button";
import {reqCategories, reqAddCategory, reqUpdateCategoryName} from "../../api";
import AddCategoryForm from "./add-category-form";
import UpdateCategoryNameForm from './update-category-name';

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    subCategories:[],// 二级分类列表
    isShowSubCategories: false,//是否展示二级分类数据
    isShowAddCategory: false,//显示添加品类弹框
    isShowUpdateCategoryName: false //修改分类名称
  }

//用到了category.属性，所以之必须为一个对象。如果没有数据时，category为undefined，会报错，
  category = {};

  async componentDidMount() {
    //api中提供的数据
    /*
    |参数     |是否必选 |类型     |说明
    |parentId    |Y       |string   |父级分类的ID
    一级分类:
    {
      "status": 0,
      "data": [{
        "parentId": "0",
        "_id": "5c2ed631f352726338607046",
        "name": "分类001",
        "__v": 0
      }]
    }*/

    //reqCategories在api/index.js中请求parentId，传入参数调用
    //parentId值为0，代表请求的是一级分类
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }

  //reqCategories：请求分类数据

  //添加品类，点击确认时，先保存数据再隐藏
  addCategory = () => {
    /*1. 表单校验
    2. 收集表单数据*/
    /*每一个Form表单都是独立的，只与当前的表单组建相关，与内部的组件无关
    如果内部组件需要用到form属性，可以通过wrappedComponentRef属性，将组件中的form挂载到this上的自定义方法上面
    */
    const {form} = this.addCategoryForm.props;

    // 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
    form.validateFields(async (err, values) => {
      if (!err) {
        //校验通过，会返回两个值
        const {parentId, categoryName} = values;

        //3、发送请求,请求回来的数据要刷新一次才会渲染到页面上
        const result = await reqAddCategory(parentId, categoryName);

        //请求数据成功
        if (result) {
          // 提示
          message.success('添加分类成功~', 2);
          // 清空表单数据
          form.resetFields(['parentId', 'categoryName']);

          /*
            如果是一级分类：就在一级分类列表中展示
            如果是二级分类：就在二级分类中展示，而一级分类是不需要的
           */

          const options = {
            isShowAddCategory: false
          };

          //一级分类
          if (result.parentId === '0') {
            //将数据添加到一级分类数组的后面，不会改变原数组
            options.categories = [...this.state.categories, result];
          }

          // 统一更新，更新之后会重新渲染，将新添加的数据渲染到页面上
          this.setState(options);
        }
      }
    })

    this.setState({
      isShowAddCategory: false
    })
  }

  /*  //显示添加品类，点击添加品类按钮时触发
    ShowAddCategory = () =>{
      this.setState({
        isShowAddCategory: true
      })
    }

    //隐藏添加品类，点击取消时触发
    hideAddCategory = () =>{
      this.setState({
        isShowAddCategory: false
      })
    }*/

  /*  //显示修改分类名称
    isShowUpdateCategoryName = () =>{
      this.setState({
        isShowUpdateCategoryName: true
      })
    }

    //隐藏修改分类名称
    hideUpdateCategoryName = () =>{
      this.setState({
        hideUpdateCategoryName: false
      })
    }*/

  toggleDisplay = (stateName, stateValue) => {
    return () => {
      this.setState({
        [stateName]: stateValue
      })
    }
  }

  //修改分类名称
  updateCategoryName = () => {
    const {form} = this.updateCategoryNameForm.props;

    // 校验表单，收集数据
    form.validateFields(async (err, values) => {
      if (!err) {
        const { categoryName, parentId } = values;
        const categoryId = this.category._id;
        // 发送请求
        const result = await reqUpdateCategoryName(categoryId, categoryName);

        //判断是一级分类还是二级分类
        //默认处理一级分类数据
        let categoryDate = this.state.categories;
        //默认更新一级分类,属性名一定是字符串类型
        let stateName = 'categories'
        //如果是二级分类就处理二级分类的数据
        //更新时的数据也要改成二级分类的数据
        if( parentId !== '0' ){
          categoryDate = this.state.subCategories;
          stateName = 'subCategories';
        }
        //在ajax请求中修改返回数据，return data.data || {};
        //因为api文档中请求更新分类名称的，返回值是一个代表成功的状态码{"status": 0 }，没有返回具体数值
        //返回的是一个undefined，进不了这个判断，没有更新状态不能直接渲染到页面上，必须要手动刷新
        //在ajax请求的返回值中，如果没有值就返回一个空对象，这样就可以进入条件判断
        if (result) {
          // 不想修改原数据，将对象中的属性复制，返回一个新数组
          const categories = categoryDate.map((category) => {
            let {_id, name, parentId } = category;
            // 找到对应id的category，修改分类名称
            if (_id === categoryId ) {
              name = categoryName;
              return {
                _id,
                name,
                parentId
              }
            }
            // 没有修改的数据直接返回
            return category;
          });
          // 清空表单项的值 隐藏对话框
          form.resetFields(['categoryName']);

          message.success('更新分类名称成功~', 2);

          this.setState({
            isShowUpdateCategoryName: false,
            //更新的数据可能时一级分类也可能是二级分类
            [stateName]: categories
          })
        }
      }

    })

  }

  //保存要更新的分类数据
  saveCategory = (category) => {
    return () => {
      this.category = category;
      this.setState({
        isShowUpdateCategoryName: true
      })
    }
  }

  //查看子品类
  showSubCategory = (category) =>{
    return async () =>{
      //保存一级分类的数据，在调用的时候作为参数传入的
      //展示二级数据时需要使用一级分类的名称，所以挂载到this上
      this.parentCategory = category;
      //请求二级分类数据,reqCategories：请求分类数据，参数是parentId。
      // 二级分类的parentId 等于一级分类的id
      //ajax请求的返回值是一个promise对象，一定要用async/await处理
      const result = await reqCategories(category._id);

      //请求成功
      if(result) {
        //所有的数据都展示在<Table>组件中，dataSource属性决定展示的数据
        //要缓存一下一级分类的数据，因为展示二级分类时，可能要返回一级分类。所以不能修改原数据
        //初始化一个新数据，保存二级分类请求回来的数据
        this.setState({
          subCategories: result,
          //是否展示二级分类，添加一个标识,在<Table>组件中，根据标识来决定展示一级分类还是二级分类
          //只有点击‘查看其子品类’的时候 才变成true，默认为false
          isShowSubCategories: true
        })
      }
    }
  }

  //点击以及返回一级分类列表
  goBack = () =>{
    //只要修改不展示二级数据，就会返回一级分类列表
    this.setState({
      isShowSubCategories: false
    })
  }
  render() {
    const {
      isShowAddCategory, //是否展示添加品类
      categories, //一级分类数据
      isShowUpdateCategoryName, //是否展示修改名称
      subCategories,//二级分类数据
      isShowSubCategories //是否展示二级分类
    } = this.state;

    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        //dataIndex:如果不写，就显示所有请求回来的数据。写一个数据中存在的属性名，就只显示一条数据。写一个不存在的，就返回undefined
        // dataIndex: 'operation',
        className: 'category-operation',
        // 改变当列的显示，render会将数据返回出去
        //category: 一级分类的数据
        render: category => {
          return <div>
            <MyButton onClick={this.saveCategory(category)}>修改名称</MyButton>
            {
              //二级分类页面不需要'查看其子品类'的按钮，所以根据是否展示二级数据来判断。一定要返回null或者一个虚拟dom对象，才不会报错
              isShowSubCategories ? null : <MyButton onClick={this.showSubCategory(category)}>查看其子品类</MyButton>
            }
          </div>
        },
      },
    ];

    /*visible：对话框是否可见，true是显示，false是隐藏*/
    return <div>
      <Card title={ isShowSubCategories ? <div><MyButton onClick={this.goBack}>一级分类</MyButton><Icon type='arrow-right'/>&nbsp;{ this.parentCategory.name }</div> : "一级分类列表" }
            extra={<Button type='primary' onClick={this.toggleDisplay('isShowAddCategory', true)}><Icon type="plus"/>添加品类</Button>}>
        <Table
          columns={columns}
          dataSource= { isShowSubCategories ? subCategories : categories }
          bordered
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            defaultPageSize: 3,
            showQuickJumper: true
          }}
          rowKey='_id'
        />

        <Modal
          title="添加分类"
          visible={isShowAddCategory}
          onOk={this.addCategory}
          onCancel={this.toggleDisplay('isShowAddCategory', false)}
          okText="确认"
          cancelText="取消"
        >
          {/*wrappedComponentRef：将AddCategoryForm组件的实例对象form(或者是一个dom元素)。挂载到this.addCategoryForm上*/}
          <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
        </Modal>

        <Modal
          title="修改分类名称"
          visible={isShowUpdateCategoryName}
          onOk={this.updateCategoryName}
          onCancel={this.toggleDisplay('isShowUpdateCategoryName', false)}
          okText="确认"
          cancelText="取消"
          width={300}
        >
          <UpdateCategoryNameForm categoryName={this.category.name}
                                  wrappedComponentRef={(form) => this.updateCategoryNameForm = form}/>
        </Modal>
      </Card>

    </div>
  }
}