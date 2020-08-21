import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Nav/Navbar";

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      keys: [],
    };
  }
  componentDidMount() {
    this.getAllData();
  }
  async getAllData() {
    let { data, keys } = this.state;
    const fetch_resp = await fetch("/search");
    const json_resp = await fetch_resp.json();
    console.log(json_resp);
    let dataKeys = json_resp.data;
    data = Object.values(dataKeys);
    keys = Object.keys(dataKeys);
    this.setState({ data, keys });
  }
  render() {
    let { data, keys } = this.state;
    return (
      <div>
        <Navbar />
        {data.map((val, idx) => (
          <div key={idx} className="card">
            <div className="card-body">
              <h4 className="card-title">{val.questionName}</h4>
              <hr></hr>
              <h5>
                {val.funcDescp}
                <br />
                <span className="badge badge-danger m-2">{val.difficulty}</span>
                <span className="badge badge-warning m-2">{val.language}</span>
              </h5>
              <Link className="btn btn-primary" to={`/editor/${keys[idx]}`}>
                Try Code
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Questions;
