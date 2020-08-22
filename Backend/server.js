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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easycod-f1945.firebaseio.com",
});

const db = admin.database();

let initialCode = {
  java: {
    initCode: `
    public class Main {
      public static void main(String[] args) {
        `,
    DockerImage: `FROM openjdk:alpine
    COPY . /
    WORKDIR ./
    RUN javac Main.java
    CMD ["java", "Main"]`,
  },
  "c++": {
    initCode: `
    #include <iostream>
    using namespace std;`,
    DockerImage: `FROM jianann/alpine-gcc
    COPY . /app
    WORKDIR /app
    RUN g++ -o Main Main.cpp
    CMD ["./Main"]`,
  },
  python: {
    DockerImage: `FROM python:alpine
    COPY Main.py ./Main.py
    CMD ["python","Main.py"]`,
  },
  javascript: {
    DockerImage: `FROM node:alpine
    WORKDIR /app
    RUN npm install
    COPY package*.json Main.js ./
    CMD ["node", "Main.js"] `,
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
  if (language === "c++") {
    extension = "cpp";
  } else if (language === "python") {
    extension = "py";
  } else if (language === "java") {
    extension = "java";
  } else if (language === "javascript") {
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
  if (language === "c++") {
    extension = "cpp";
    functionCallAr = functionCall.split("^").reduce((acc, val) => {
      return (acc += `
      try {
        cout << "-||" << ${val.replace(";", "")} << "||-" ;
        cout << "%";
      }catch (const std::exception& e)
      {
         std::cout << e.what();
      }`);
    }, "");
  } else if (language === "python") {
    extension = "py";
    functionCallAr = functionCall.split("^").reduce((acc, val) => {
      return (acc += `
try:
  print("-||"+str(${val})+ "||-")
  print("%")
except NameError:
  print(""+NameError)`);
    }, "");
  } else if (language === "java") {
    extension = "java";
    functionCallAr = functionCall.split("^").reduce((acc, val) => {
      return (acc += `
      try {
        System.out.println("-||"+${val.replace(";", "")}+ "||-");
        System.out.println("%");
      }
      catch(Exception e) {
        System.out.println(e);
      }`);
    }, "");
  } else if (language === "javascript") {
    extension = "js";
    functionCallAr = functionCall.split("^").reduce((acc, val) => {
      return (acc += `
      try {
        console.log("-||"+${val.replace(";", "")}+ "||-");
        console.log("%")
      }
      catch(e) { 
        console.log(e);
      }`);
    }, "");
  }

  let dockerStr = "";
  let codeStr = "";
  switch (language) {
    case "c++":
    case "java":
      dockerStr = initialCode[language].DockerImage;
      if (language == "c++") {
        codeStr = `${initialCode[language].initCode}${functionCode} int main ()
        { ${functionCallAr}}`;
      } else {
        codeStr = `${initialCode[language].initCode} 
        ${functionCallAr}
      }
      ${functionCode}
      }`;
      }
      fs.writeFileSync(`./DockerFiles/${codeId}/Main.${extension}`, codeStr);
      break;
    default:
      dockerStr = initialCode[language].DockerImage;
      codeStr = `
${functionCode}
${functionCallAr}`;
      fs.writeFileSync(`./DockerFiles/${codeId}/Main.${extension}`, codeStr);
      break;
  }
  fs.writeFileSync(`./DockerFiles/${codeId}/Dockerfile`, dockerStr);
  let reply = {};

  exec(
    `docker build -t ${codeId} ./DockerFiles/${codeId}`,
    (error, stdout, stderr) => {
      switch (language) {
        case "c++":
        case "java":
          let output = [];
          let error = [];
          let array = [];

          if (stdout.includes("error") == true) {
            error.push(
              stdout
                .split("Step 4/5")[1]
                .split("---> Running in")[1]
                .slice(14, stdout.length)
            );
            reply = {
              data: output,
              err: error,
              testCases: array,
            };
            response.json(reply);
          } else {
            exec(`docker run  ${codeId}`, (errorrRun, stdoutRun, stderrRun) => {
              if (errorrRun != null) {
                error.push(stderrRun);
              }
              let array = stdoutRun.split("%").map((val, idx, array) => {
                let temp = val.split("-||").pop().split("||-")[0];
                let tempConsole = val.replace(`-||${temp}||-`, "");
                if (array.length - 1 != idx) {
                  output.push(
                    `Test Case Result ${
                      idx + 1
                    }:\n  ${tempConsole.trim().replace("\n", "")}`
                  );
                  return `<---Test Case ${idx + 1} --->\n${compareResult(
                    temp,
                    functionAnswer[idx]
                  )}`;
                }
              });
              array.pop();
              reply = {
                data: output,
                err: error,
                testCases: array,
              };
              response.json(reply);
            });
          }
          break;
        default:
          exec(`docker run  ${codeId}`, (errorrRun, stdoutRun, stderrRun) => {
            let output = [];
            let error = [];
            if (errorrRun != null) {
              error.push(stderrRun);
            }
            let array = stdoutRun.split("%").map((val, idx, array) => {
              let temp = val.split("-||").pop().split("||-")[0];
              let tempConsole = val.replace(`-||${temp}||-`, "");
              if (array.length - 1 != idx) {
                output.push(
                  `Test Case Result ${idx + 1}:\n  ${tempConsole
                    .trim()
                    .replace("\n", "")}`
                );
                return `<---Test Case ${idx + 1} --->\n${compareResult(
                  temp,
                  functionAnswer[idx]
                )}`;
              }
            });
            array.pop();
            reply = {
              data: output,
              err: error,
              testCases: array,
            };
            response.json(reply);
          });
          break;
      }
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
  let ref = db.ref(`Users/${name}/${id}`);
  const saveData = {
    difficulty: difficulty,
    funcAns: funcAns,
    funcCall: funcCall,
    funcDescp: funcDescp,
    function: functionCode,
    language: language,
    questionName: questionName,
  };
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
