import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class TextEditor extends Component {
  render() {
    const { handleChange, currentDescription } = this.props;
    return (
      <div className="App">
        <CKEditor
          editor={ClassicEditor}
          data={currentDescription}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "codeBlock",
              "blockQuote",
              "undo",
              "redo",
            ],
          }}
          onReady={(editor) => {
            console.log(editor);
          }}
          onChange={(event, editor) => {
            let isData = true;
            const data = editor.getData();
            console.log(event);
            handleChange(event, editor, data, isData);
          }}
        />
      </div>
    );
  }
}

export default TextEditor;
