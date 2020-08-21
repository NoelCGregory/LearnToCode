import React, { Component } from "react";
import CodeEditor from "./CodeEditor";
import Console from "./Console";
import SplitPane from "react-split-pane";
import Navbar from "../../Nav/Navbar";
import "./Editor.css";
import Instructions from "./Instruction";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItemClassicTabs1: "1",
      value: "",
      id: "",
      functionCall: "",
      language: "",
      log: [],
      testCases: [],
      functionAns: "",
      size: {
        vertical:
          Math.floor(window.screen.width / 2) -
          Math.floor(window.screen.width / 10),
        horizontal:
          Math.floor(window.screen.height / 2) -
          Math.floor(window.screen.height / 7),
      },

      switchPanel: false,
    };
  }
  toggleClassicTabs1 = (tab) => () => {
    this.setState({
      activeItemClassicTabs1: tab,
    });
  };

  componentDidMount() {
    this.getQuestionInfo();
    document.getElementById("loaderConsole").style.display = "none";
  }

  componentWillUnmount() {
    let { id, language } = this.state;
    fetch(`/destroyCode`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, language }),
    });
  }

  async getQuestionInfo() {
    let {
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    } = this.state;
    id = this.props.match.params.id;
    const fetch_resp = await fetch(`/getQuestionInfo/${id}`);
    const json_resp = await fetch_resp.json();
    value = json_resp.data.function;
    functionCall = json_resp.data.funcCall;
    functionAns = json_resp.data.funcAns;
    language = json_resp.data.language;
    this.setState({
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    });
  }

  handleChange = (editor, data, value) => {
    const {
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    } = this.state;
    this.setState({
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    });
  };
  handleRun = async () => {
    let startTime = new Date();
    document.getElementById("loaderConsole").style.display = "block";
    document.getElementById("log").style.display = "none";
    let {
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    } = this.state;
    testCases = [];
    log = [];
    const json = {
      id: id,
      functionCode: value,
      functionAns: functionAns,
      functionCall: functionCall,
      language: language,
    };
    const fetch_resp = await fetch("/code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });
    const json_resp = await fetch_resp.json();
    console.log(json_resp);
    if (json_resp.data.length === 0) {
      log = json_resp.err;
      testCases.push("There something wrong with your Code");
    } else {
      log = json_resp.data;
      testCases = json_resp.testCases;
    }

    let endTime = new Date();
    var timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");

    document.getElementById("loaderConsole").style.display = "none";
    document.getElementById("log").style.display = "block";
    this.setState({
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    });
  };
  handleSplitVertical = (splitSize) => {
    let {
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    } = this.state;
    size.vertical = splitSize;
    this.setState({
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    });
  };
  handleSplitHorizontal = (splitSize) => {
    let {
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
      c,
    } = this.state;
    size.horizontal = splitSize;
    this.setState({
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    });
  };
  handleSwitch = () => {
    let {
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    } = this.state;
    if (switchPanel === false) {
      let temp = testCases;
      testCases = log;
      log = temp;
      switchPanel = true;
    } else {
      let temp = log;
      log = testCases;
      testCases = temp;
      switchPanel = false;
    }
    this.setState({
      value,
      id,
      functionCall,
      language,
      log,
      functionAns,
      size,
      testCases,
      switchPanel,
    });
  };

  render() {
    const { value, language, log, size, activeItemClassicTabs1 } = this.state;
    return (
      <div>
        <SplitPane
          split="horizontal"
          minSize={window.screen.width}
          maxSize={window.screen.width}
          primary="second"
        >
          <Navbar />
          <SplitPane
            className="ss"
            split="vertical"
            onChange={this.handleSplitVertical}
            minSize={
              Math.floor(window.screen.width / 2) -
              Math.floor(window.screen.width / 10)
            }
            maxSize={
              Math.floor(window.screen.width / 2) +
              Math.floor(window.screen.width / 10)
            }
          >
            <Instructions
              size={size.vertical}
              activeItemClassicTabs1={activeItemClassicTabs1}
              onToggle={this.toggleClassicTabs1}
            />
            <SplitPane
              split="horizontal"
              onChange={this.handleSplitHorizontal}
              minSize={
                Math.floor(window.screen.height / 2) -
                Math.floor(window.screen.height / 7)
              }
              maxSize={
                Math.floor(window.screen.height / 2) +
                Math.floor(window.screen.height / 7)
              }
            >
              <CodeEditor
                id="code"
                mode={
                  language === "java" || language === "c++"
                    ? "text/x-java"
                    : language
                }
                value={value}
                size={size}
                handleChange={this.handleChange}
                onRun={this.handleRun}
              />
              <Console
                onSwitch={this.handleSwitch}
                size={size}
                logConsole={log}
              />
            </SplitPane>
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

// <CodeEditor
//           mode={
//             language === "java" || language === "c++" ? "text/x-java" : language
//           }
//           value={value}
//           handleChange={this.handleChange}
//           onRun={this.handleRun}
//         />
//         <Console onClear={this.handleClear} logConsole={log} />

export default Editor;
