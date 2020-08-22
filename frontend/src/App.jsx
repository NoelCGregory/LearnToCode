import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Editor from "./components/Questions/Editor/EditorWorkspace";
import Questions from "./components/Questions/Questions";
import "mdbootstrap/css/bootstrap.min.css";
import "mdbootstrap/css/mdb.min.css";
import AddQuestion from "./components/Nav/AddQuestion";
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/questions" component={Questions} />
        <Route path="/editor/:id/:name" component={Editor} />
        <Route path="/addquestion" component={AddQuestion} />
      </Switch>
    </Router>
  );
};
{
  /* <SplitPane
split="horizontal"
minSize={window.screen.width}
maxSize={window.screen.width}
primary="second"
> */
}

export default App;
