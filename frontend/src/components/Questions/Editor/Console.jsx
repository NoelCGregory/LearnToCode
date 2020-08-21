import React from "react";
import "./Editor.css";

const Console = (props) => {
  const { logConsole, onSwitch } = props;
  function pickColor(item) {
    if (
      item.includes("passed") === false &&
      item.includes("failed") === false &&
      item.includes("Traceback") === false &&
      item.includes("Main.java") === false &&
      item.includes("Main.cpp") === false
    ) {
      return { color: "white" };
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
  return (
    <div className="playground-console-container" style={{ height: "500px" }}>
      <div className="playground-console">
        <button
          onClick={onSwitch}
          style={{ float: "right" }}
          className="btn btn-outline-light btn-sm waves-effect "
        >
          Switch
        </button>
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
  );
};

export default Console;
