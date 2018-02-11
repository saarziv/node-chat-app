const moment = require('moment');

//gets the timestamp with moment.
console.log(moment().valueOf());

//print the timestamp with a nice format of hours.
console.log(moment(moment().valueOf()).format('h:mm a'));
//this func gives me a human readable date. - js built in function.
var j = new Date().toLocaleDateString();
console.log('date now :',j);

var now = moment();

//using moment library its easy to display date in millions of different way (great docs.)
now = now.format('D-M-YY');
console.log('now :',now);

//and we can add and subtract as well.
let sevenDaysLater = moment().add(7,'days');
console.log('seven days later :',sevenDaysLater.format('D-M-YY'));


let freedom = moment(new Date(2018,2,22));

console.log("Ad matay :",freedom.format('D-M-YY'));


console.log(`kama od :${freedom.diff(moment(),'d',true)} days.`);

console.log(moment().format('h:mm a'));