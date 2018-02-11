const chai = require('chai');
const {generateMessage,generateLocationMessage} = require('./message');

describe("Generate message",() =>{
   it("Should test that the parameter supplied return correct object.",() =>{
       let from= "Admin";
       let text = "hello world.";
       let obj = generateMessage(from,text);

       chai.expect(obj).to.include({from,text});
       chai.expect(typeof obj.createdAt).to.equal('number');

   })
});

describe("Generate location message",() =>{
   it("Should return valid location object",() =>{

       let from = "Admin";
       let latitude = 1;
       let longitude = 2;
       let obj = generateLocationMessage(from,latitude,longitude);

       chai.expect(typeof obj.createdAt).to.equal('number');
       chai.expect(obj.from).to.be.equal(from);
       chai.expect(obj.url).to.be.equal(`https://www.google.com/maps?q=1, 2`);
   });
});