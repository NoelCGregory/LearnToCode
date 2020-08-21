import React, { Component } from "react";
import "./Editor.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/scroll/simplescrollbars.css";
require("codemirror/mode/javascript/javascript");
require("codemirror/keymap/sublime");
require("codemirror/addon/display/placeholder");
require("codemirror/addon/scroll/simplescrollbars");
class Notepad extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.options = {
      mode: "",
      matchBrackets: true,
      scrollbarStyle: "overlay",
      placeholder: "Write Here...",
      theme: "monokai",
      keyMap: "sublime",
      autoClosingBrackets: true,
    };
  }
  componentDidUpdate() {
    this.setSize();
  }
  componentDidMount() {
    this.setSize();
  }

  setSize() {
    const { size } = this.props;
    const widthSize = size.width - 15;
    const heightSize = size.height;

    if (this.editor != null) {
      this.editor.setSize(widthSize, heightSize);
    }
  }

  render() {
    const { value, mode, handleChange } = this.props;
    this.options.mode = mode;
    return (
      <div>
        <div className="playground-editor">
          <CodeMirror
            ref="editor"
            editorDidMount={(editor) => {
              this.editor = editor;
            }}
            onBeforeChange={handleChange}
            value={value}
            options={this.options}
          />
        </div>
      </div>
    );
  }
}

export default Notepad;
