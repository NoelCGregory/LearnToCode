import React, { Component } from "react";
import {
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
} from "mdbreact";
import Notepad from "./Notepad";

class Instructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      tabNum: "1",
    };
  }
  handleChange = (editor, data, value) => {
    const { tabNum } = this.state;
    this.setState({
      value,
      tabNum,
    });
  };
  switchTab = (tab) => () => {
    this.setState({
      tabNum: tab,
    });
  };

  render() {
    const { size, question } = this.props;
    const { value, tabNum } = this.state;
    return (
      <div
        style={{ height: window.screen.height, width: size }}
        class="question-container"
      >
        <MDBNav style={{ backgroundColor: "#272727" }}>
          <MDBNavItem>
            <MDBNavLink
              link
              className="link text-white"
              active={tabNum === "1"}
              onClick={this.switchTab("1")}
            >
              Instruction
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink
              link
              className="link text-white"
              active={tabNum === "2"}
              onClick={this.switchTab("2")}
            >
              Notepad
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
        <MDBTabContent style={{ color: "white" }} activeItem={tabNum}>
          <MDBTabPane tabId="1" style={{ margin: "3%" }}>
            <h4>{question.questionName}</h4>
            <p>{question.funcDescp}</p>
          </MDBTabPane>
          <MDBTabPane tabId="2">
            <Notepad
              mode={"text/plain"}
              value={value}
              handleChange={this.handleChange}
              size={{ height: window.screen.height, width: size }}
            />
          </MDBTabPane>
        </MDBTabContent>
      </div>
    );
  }
}

export default Instructions;
