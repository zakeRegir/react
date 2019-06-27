import React, { Component } from 'react';
import { EditorState/*, convertToRaw */} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
/*import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';*/
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default class RichTextEdior extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  /*表单内容发生变化时触发，可以获取到表单内输入的内容
  但是需要转换成html字符串才能使用：draftToHtml(convertToRaw(editorState.getCurrentContent()))
      调用一个方法将editorState转换成可以使用的数据
  用这个方法可以在父组件中定义一个方法，然后在子组件调用，通过参数将数据传给父组件
  */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="editor" //输入框
          onEditorStateChange={this.onEditorStateChange}
        />

      </div>
    );
  }
}