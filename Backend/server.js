const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const execa = require("execa");
const server = app.listen(port, () => console.log("Listening"));
app.use(express.json({ limit: "1mb" })); //limiting json file size
const { exec } = require("child_process");
const fs = require("fs");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
const { request, response } = require("express");
const { start } = require("repl");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easycod-f1945.firebaseio.com",
});

const db = admin.database();

let initialCode = {
  python: {
    DockerImage: `FROM python:alpine
    COPY . ./
    CMD python -m unittest -v Main.py`,
  },
  javascript: {
    DockerImage: `FROM node:alpine
    RUN npm install -g mocha
    RUN npm install chai
    COPY package*.json .  ./
    CMD ["npm", "test"]`,
  },
};

app.get("/search", (request, response) => {
  let ref = db.ref("Questions");
  let searchQuery = {
    data: "no Search Data Found",
  };
  ref
    .once("value", function (data) {
      searchQuery.data = data.val();
    })
    .then(() => response.json(searchQuery));
});

app.post("/destroyCode", (request, response) => {
  let { id, language } = request.body;
  const codeId = id.toLowerCase().replace("-", "").replace("_", "");
  let extension = "js";

  if (language === "javascript") {
    extension = "js";
  }

  fs.unlink(`./DockerFiles/${codeId}/Dockerfile`, () => {
    fs.unlink(`./DockerFiles/${codeId}/Main.${extension}`, () => {
      fs.rmdir(`DockerFiles/${codeId}`, () => {
        console.log("Folder Deleted!");
        response.json({ status: "successfully" });
      });
    });
  });
});

app.post("/code", (request, response) => {
  let data = request.body;
  let { id, functionCode, functionCall, language, functionAns } = data;
  const codeId = id.toLowerCase().replace("-", "").replace("_", "");
  let functionCallAr;

  let functionAnswer = functionAns.split("?");
  let extension = "";
  console.log(codeId);
  let dir = `./DockerFiles/${codeId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  extension = "js";
  if (language === "javascript") {
    extension = "js";
    let dir = `./DockerFiles/${codeId}/test`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(
      `./DockerFiles/${codeId}/package.json`,
      `{
      "name": "Chai",
      "version": "1.0.0",
      "description": "",
      "main": "app.js",
      "directories": {
        "test": "test"
      },
      "scripts": {
        "test": "mocha || true  "
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "mocha": "^8.1.1"
      }
    }
    `
    );

    fs.writeFileSync(
      `./DockerFiles/${codeId}/test/test.js`,
      `const chai = require("chai");
      const r = require("../program");

      console.log('start');
     describe("Test Cases",function(){
          it("%", function () {
            try{
              let p = r(2);
              chai.expect(p).equal(4);
            }catch(err){
              console.log(err);
            }
          });
          it("%", function () {
            try{
              let p = r(2);
              chai.expect(p).equal(3);
            }catch(err){
              console.log(err);
            }
          });
          it("%", function () {
            try{
              let p = r(2);
              chai.expect(p).equal(2);
            }catch(err){
              console.log(err);
            }
          });
          it("end", function () {
          });
      })
    `
    );
  } else if (language === "python") {
    extension = "py";
    fs.writeFileSync(
      `./DockerFiles/${codeId}/Main.py`,
      `
import unittest
import program

class Main(unittest.TestCase):
    
    def test_Case1(self):
        print('=========')
        try:
            self.assertEqual(program.addVal(1,3), 4)
        except NameError:
            print(""+NameError)

    def test_Case2(self):
        print('=========')
        try:
            self.assertEqual(program.addVal(1,3), 3)
        except NameError:
            print(""+NameError)

    def test_Case3(self):
        print('=========')
        try:
            self.assertEqual(program.addVal(1,3), 3)
        except NameError:
            print(""+NameError)
    `
    );
  }

  let dockerStr = "";
  switch (language) {
    default:
      dockerStr = initialCode[language].DockerImage;
      fs.writeFileSync(
        `./DockerFiles/${codeId}/program.${extension}`,
        functionCode
      );
      break;
  }
  fs.writeFileSync(`./DockerFiles/${codeId}/Dockerfile`, dockerStr);
  let reply = {};
  exec(
    `docker build -t ${codeId} ./DockerFiles/${codeId}`,
    (error, stdout, stderr) => {
      console.log("alerted");

      exec(`docker run  ${codeId}`, (errorrRun, stdoutRun, stderrRun) => {
        let error = [];
        let output = [];

        let array = [];
        if (extension == "js") {
          array = stdoutRun
            .split("Test Cases")[1]
            .split("✓ end")[0]
            .split("%")
            .map((tempCases, idx) => {
              let testCase = "failed";
              if (tempCases.includes("ReferenceError:") == false) {
                let id = tempCases.indexOf("at Context.<anonymous>");
                if (id > -1) {
                  tempCases = tempCases.slice(0, id);
                }
              }

              if (tempCases.includes("AssertionError:") == true) {
                testCase = "✕ failed";
              } else if (tempCases.includes("ReferenceError:") == true) {
                testCase = "✕ failed";
                tempCases = tempCases.replace("✓", "");
              } else if (tempCases.includes("✓") == true) {
                testCase = "✓ passed";
                tempCases = tempCases.replace("✓", "");
              }

              output.push(
                `Test Case #${idx + 1} Output:\n  ${tempCases.trim()}`
              );
              return `<---- Test Case ${idx + 1} ---->\n  ${testCase}`;
            });

          array.pop();
          output.pop();
        } else {
          let userOutput = stdoutRun
            .split("=========")
            .filter((val) => val.length > 1);
          if (stderrRun.includes("AssertionError:") == false) {
            let startId = stderrRun.indexOf(
              `File "/usr/local/lib/python3.8/runpy.py"`
            );
            let endId = stderrRun.indexOf(`program`) + 10;
            let errOutput =
              stderrRun.slice(0, startId) +
              stderrRun.slice(endId, stderrRun.length);
            error.push(errOutput);
          } else {
            let temp = stderrRun
              .replace(
                "======================================================================",
                "cut"
              )
              .split("cut");
            let outputTemp = temp[1]
              .split("Ran")[0]
              .split(
                "======================================================================"
              )
              .map((val, idx) => {
                return val.split(
                  "----------------------------------------------------------------------"
                );
              });

            output = userOutput.map((val, idx) => {
              let idxPlus = idx + 1;
              for (let i = 0; i < outputTemp.length; i++) {
                let caseNum = outputTemp[i][0];
                if (caseNum.indexOf("test_Case" + idxPlus) > -1) {
                  let tempConsole = outputTemp[i][1];
                  return `Test Case Result ${idx}:${val}${tempConsole.trim()}`;
                }
              }
              return `Test Case Result ${idx}:${val}`;
            });
            array = temp[0]
              .split("\n")
              .map((val, idx) => {
                let testCase = "failed";
                tempCases = "undefined";
                if (val.length != 0) {
                  if (val.includes("ok") == true) {
                    testCase = "✓ passed";
                  } else if (val.includes("FAIL") == true) {
                    testCase = "✕ failed";
                  }
                  return `<---- Test Case ${idx + 1} ---->\n  ${testCase}`;
                }
                return null;
              })
              .filter((val) => {
                if (val != null) {
                  return val;
                }
              });
          }
        }

        reply = {
          data: output,
          err: error,
          testCases: array,
        };
        response.json(reply);
      });
    }
  );
});
app.post("/saveCode", (request, response) => {
  const {
    id,
    name,
    difficulty,
    questionName,
    funcDescp,
    functionCode,
    funcAns,
    funcCall,
    language,
  } = request.body;
  const saveData = {
    difficulty: difficulty,
    funcAns: funcAns,
    funcCall: funcCall,
    funcDescp: funcDescp,
    function: functionCode,
    language: language,
    questionName: questionName,
  };
  console.log("saved");
  let ref = db.ref(`Users/${name}/${id}`);
  ref.set(saveData);
});
app.get("/getQuestionInfo/:id/:name", (request, response) => {
  const id = request.params.id;
  const name = request.params.name;
  let ref = db.ref(`Users/${name}/${id}`);
  ref.once("value").then((snapshot) => {
    let result = snapshot.exists();
    let searchQuery = {
      data: "no Search Data Found",
    };
    if (result == true) {
      searchQuery.data = snapshot.val();
      response.json(searchQuery);
    } else {
      ref = db.ref(`Questions/${id}`);
      ref
        .once("value", (data) => {
          searchQuery.data = data.val();
        })
        .then(() => response.json(searchQuery));
    }
  });
});

function compareResult(funcOutput, orgOutput) {
  console.log(funcOutput, orgOutput);
  if (funcOutput == orgOutput) {
    return "passed";
  } else {
    return "failed";
  }
}

app.post("/addQuestion", (request, response) => {
  const data = request.body;
  let quesitonAdd = {
    questionName: data.questionName,
    language: data.language,
    difficulty: data.difficulty,
    funcCall: data.funcCall,
    funcAns: data.funcAns,
    funcDescp: data.funcDescp,
    function: data.funcCode,
  };

  let ref = db.ref("Questions");

  ref
    .push(quesitonAdd)
    .then(() => response.json({ status: "Success adding questions" }))
    .catch((err) => response.json({ status: err }));
});
