const chai = require("chai");
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
    