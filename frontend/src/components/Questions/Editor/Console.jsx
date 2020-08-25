import React from "react";
import "./Editor.css";
import {
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
} from "mdbreact";

const Console = (props) => {
  const { logConsole, onSwitch, size } = props;
  function pickColor(item) {
    if (
      item.includes("passed") === false &&
      item.includes("failed") === false &&
      item.includes("Traceback") === false &&
      item.includes("AssertionError:") === false &&
      item.includes("ReferenceError") === false
    ) {
      return { color: "#00AF32" };
    } else if (item.includes("passed") === true) {
      return { color: "#00AF32" };
    } else {
      return { color: "#FF0000" };
    }
  }
  function errFormat(err) {
    if (err.includes("[91m") == true) {
      err = replaceAll(err, "[91m");
      err = replaceAll(err, "[0m");
    }
    return err;
  }
  function replaceAll(err, str) {
    while (true) {
      if (err.includes(str) == true) {
        err = err.replace(str, "");
      } else {
        break;
      }
    }
    return err;
  }
  console.log(size.vertical, size.horizontal);
  console.log(window.screen.width, window.screen.height);
  const horizontalSize =
    window.screen.height -
    size.horizontal -
    Math.floor(window.screen.height / 7);
  const verticalSize = window.screen.width - size.vertical;

  console.log(verticalSize, horizontalSize);
  return (
    <div>
      <MDBNav style={{ backgroundColor: "#272727" }} classicTabs>
        <MDBNavItem>
          <MDBNavLink
            link
            className="link text-white RunCode "
            onClick={onSwitch}
          >
            Switch
          </MDBNavLink>
        </MDBNavItem>
      </MDBNav>
      <MDBTabContent>
        <MDBTabPane>
          <div className="playground-console-container">
            <div
              className="playground-console"
              style={{ height: horizontalSize, width: verticalSize }}
            >
              <ul id="loaderConsole">
                <li className="console-line">
                  <span className="console-carrot">{">"}</span>
                  <span className="whiteSpace">
                    <div className="center">
                      {" "}
                      <div className="loader "></div>
                    </div>
                  </span>
                </li>
              </ul>

              <ul id="log">
                {logConsole.map((item, index) => (
                  <li key={index} className="console-line">
                    <span className="console-carrot">{">"}</span>
                    <span style={pickColor(item)} className="whiteSpace">
                      {errFormat(item)}
                    </span>
                  </li>
                ))}
                <li>
                  <span className="console-carrot">{">"}</span>
                </li>
              </ul>
            </div>
          </div>
        </MDBTabPane>
      </MDBTabContent>
    </div>
  );
};

export default Console;
