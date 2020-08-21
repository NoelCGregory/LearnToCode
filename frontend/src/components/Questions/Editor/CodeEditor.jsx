import React, { Component } from "react";
import "./Editor.css";
import {
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
} from "mdbreact";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/theme/monokai.css";
require("codemirror/mode/css/css");
require("codemirror/mode/clike/clike");
require("codemirror/mode/python/python");
require("codemirror/mode/javascript/javascript");
require("codemirror/keymap/sublime");
require("codemirror/addon/scroll/simplescrollbars");
require("codemirror/addon/edit/closebrackets");
class CodeEditor extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.options = {
      lineNumbers: true,
      mode: "",
      scrollbarStyle: "overlay",
      theme: "monokai",
      keyMap: "sublime",
      lineWrapping: true,
      autoCloseBrackets: true,
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
    const horizontalSize = size.horizontal - 40;
    const verticalSize = window.screen.width - size.vertical - 10;

    if (this.editor != null) {
      this.editor.setSize(verticalSize, horizontalSize);
    }
  }

  render() {
    const { value, mode, onRun, handleChange, size } = this.props;
    this.options.mode = mode;
    return (
      <div>
        <MDBNav style={{ backgroundColor: "#272727" }} classicTabs>
          <MDBNavItem>
            <MDBNavLink
              link
              className="link text-white RunCode "
              onClick={onRun}
            >
              Run Code
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <MDBTabContent>
          <MDBTabPane>
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
          </MDBTabPane>
        </MDBTabContent>
      </div>
    );
  }
}

export default CodeEditor;
