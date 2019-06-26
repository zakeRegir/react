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