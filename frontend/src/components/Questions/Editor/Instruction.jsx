import React, { Component } from "react";
import CodeEditor from "./CodeEditor";
import {
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
} from "mdbreact";

const Instructions = (props) => {
  const { size, onToggle, activeItemClassicTabs1 } = props;
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
            active={activeItemClassicTabs1 === "1"}
            onClick={onToggle("1")}
          >
            Instruction
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            className="link text-white"
            active={activeItemClassicTabs1 === "2"}
            onClick={onToggle("2")}
          >
            Notepad
          </MDBNavLink>
        </MDBNavItem>
      </MDBNav>
      <MDBTabContent
        style={{ color: "white" }}
        activeItem={activeItemClassicTabs1}
      >
        <MDBTabPane tabId="1">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo
          </p>
        </MDBTabPane>
        <MDBTabPane tabId="2">
          <CodeEditor
            mode={"text/plain"}
            value={"Write Here ..."}
            size={{ vertical: window.screen.height, horizontal: size }}
          />
        </MDBTabPane>
      </MDBTabContent>
    </div>
  );
};

export default Instructions;
