import React, { Component } from "react";
import Navbar from "../Nav/Navbar";
class AddQuestion extends Component {
  state = {};

  handleAddQuestion(event) {
    event.preventDefault();
    event.persist();
    let inputs = [];

    for (let i of event.target.elements) {
      inputs.push(i.value);
    }

    let data = {
      questionName: inputs[0],
      language: inputs[1],
      difficulty: inputs[2],
      funcCall: inputs[3],
      funcAns: inputs[4],
      funcDescp: inputs[5],
      funcCode: inputs[6],
    };

    fetch("/addQuestion", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((val) => val.json())
      .then((val) => alert(val.status));
  }
  render() {
    return (
      <div>
        <Navbar />
        <form onSubmit={this.handleAddQuestion}>
          <div className="jumbotron text-center ">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  Question Name:
                </span>
              </div>
              <input
                type="text"
                id="QuestionName"
                className="form-control"
                placeholder="Question Name"
              ></input>
            </div>

            <select className="browser-default custom-select">
              <option value="" disabled selected>
                Choose your Language
              </option>
              <option value="java">Java</option>
              <option value="c++">C++</option>
              <option value="pyhton">Python</option>
              <option value="javascript">Javascript</option>
            </select>
            <br></br>
            <br></br>
            <select className="browser-default custom-select">
              <option value="" disabled selected>
                Choose your Difficuly
              </option>
              <option value="easy">Easy</option>
              <option value="meduim">Meduim</option>
              <option value="hard">Hard</option>
            </select>
            <br></br>
            <br></br>

            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon3">
                  Enter Call Function
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="CallFunction"
              ></input>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon3">
                  Enter Correct Answer
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="CallFunction"
              ></input>
            </div>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  Enter Function Description
                </span>
              </div>
              <textarea
                className="form-control"
                aria-label="With textarea"
                id="questionDescp"
              ></textarea>
            </div>

            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Enter Function Code</span>
              </div>
              <textarea
                className="form-control"
                aria-label="With textarea"
                id="FunctionCode"
              ></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-danger">
            Add Question
          </button>
        </form>
      </div>
    );
  }
}

export default AddQuestion;
