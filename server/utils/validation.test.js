const chai = require('chai');
const {isRealString} = require('./validation');

describe("check of returns real string",() =>{
   it("Should check if its a string and non empty word",() =>{
       chai.expect(isRealString("   ")).to.be.false;
       chai.expect(isRealString("")).to.be.false;
       chai.expect(isRealString(3)).to.be.false;
       chai.expect(isRealString("hi there")).to.be.true;

   })
});