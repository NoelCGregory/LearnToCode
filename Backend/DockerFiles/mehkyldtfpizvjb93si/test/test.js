const chai = require("chai");
const r = require("../app");

it("Test Case #1", function () {
  chai.expect(r(5)).equal(6);
});
it("Test Case #2", function () {
  chai.expect(r(6)).equal(5);
});
