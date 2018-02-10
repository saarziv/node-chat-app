const chai = require('chai');
const {generateMessage} = require('./message');

describe("Test generate message",() =>{
   it("Should test that the parameter supplied return correct object.",() =>{
       let from= "Admin";
       let text = "hello world.";
       let obj = generateMessage(from,text);

       chai.expect(obj).to.include({from,text});
       chai.expect(typeof obj.createdAt).to.equal('number');

   })
});