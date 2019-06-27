import React, {Component} from 'react';
import {Upload, Icon, Modal, message} from 'antd';

import { reqDeleteProductImg } from "../../../api";

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,// 预览图显示和隐藏
    previewImage: '',// 预览图
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  };

  //取消预览
  handleCancel = () => this.setState({previewVisible: false});

  //点击预览
  handlePreview = async file => {
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  // 删除/上传
  handleChange = ({fileList}) => this.setState({fileList});

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          // 上传的服务器地址
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          // 展示图片文件
          fileList={fileList}
          // 点击预览的回调
          onPreview={this.handlePreview}
          // 点击删除/上传的回调
          onChange={this.handleChange}
        >
          {
            //fileList：存放图片的数组，最多展示三张图片
            //uploadButton：上传按钮
            fileList.length >= 3 ? null : uploadButton
          }
        </Upload>

        <Modal
          // 显示预览图的模态框
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    );
  }
}
