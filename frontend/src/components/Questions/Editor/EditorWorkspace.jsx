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
      id: "",
      log: [],
      testCases: [],
      question: {},
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
  unMount = (e) => {
    if (e != undefined) {
      e.preventDefault();
    }
    let { id, language, question } = this.state;
    fetch(`/destroyCode`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, language }),
    });
    let name = "noel";
    const jsonData = {
      id: id,
      name: name,
      difficulty: question.difficulty,
      questionName: question.questionName,
      funcDescp: question.funcDescp,
      functionCode: question.function,
      funcAns: question.funcAns,
      funcCall: question.funcCall,
      language: question.language,
    };
    fetch(`/saveCode`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    return;
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.unMount);
    this.getQuestionInfo();
    document.getElementById("loaderConsole").style.display = "none";
  }

  componentWillUnmount() {
    this.unMount();
  }

  async getQuestionInfo() {
    let { id, question } = this.state;
    id = this.props.match.params.id;
    let name = this.props.match.params.name;
    const fetch_resp = await fetch(`/getQuestionInfo/${id}/${name}`);
    const json_resp = await fetch_resp.json();
    question = json_resp.data;
    this.setState({
      id,
      question,
    });
  }

  handleChange = (editor, data, value) => {
    let { id, question } = this.state;
    question.function = value;
    this.setState({
      question,
    });
  };
  handleRun = async () => {
    let startTime = new Date();
    document.getElementById("loaderConsole").style.display = "block";
    document.getElementById("log").style.display = "none";
    let { id, question, log, testCases, switchPanel } = this.state;
    testCases = [];
    log = [];
    const json = {
      id: id,
      functionCode: question.function,
      functionAns: question.funcAns,
      functionCall: question.funcCall,
      language: question.language,
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
      id,
      question,
      log,
      testCases,
      switchPanel,
    });
  };
  handleSplitVertical = (splitSize) => {
    let { size } = this.state;
    size.vertical = splitSize;
    this.setState({
      size,
    });
  };
  handleSplitHorizontal = (splitSize) => {
    let { size } = this.state;
    size.horizontal = splitSize;
    this.setState({
      size,
    });
  };
  handleSwitch = () => {
    let { testCases, switchPanel, log } = this.state;
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
      testCases,
      switchPanel,
      log,
    });
  };

  render() {
    const { question, log, size } = this.state;
    const language = question.language;
    const value = question.function;
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
            className="background"
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
            <Instructions question={question} size={size.vertical} />
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
