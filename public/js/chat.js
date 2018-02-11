let scrollMessages = function () {

    //there is a css property on the class chat__messages overflow-y: scroll that makes the message scrollable in the first place.
    let messages= jQuery('#messages-list');
    let newMessage = messages.children('li:last-child');
    let prevNewMessage = newMessage.siblings('li');

    //we access the properties of the scrollable DOM object - in this case <ol>.
    let scrollHeight = messages.prop('scrollHeight'); //all the scrollable height possible in the window.
    let scrollTop = messages.prop('scrollTop'); //from top to current scroll location.(the height we covered when scrolling )
    let clientHeight = messages.prop('clientHeight'); // the height that is visible in the screen at this current moment.
    let newMessageHeight = newMessage.innerHeight(); // the height of the last message.
    let prevNewMessageHeight = prevNewMessage.innerHeight(); // the height of one previous from the  last message.

    //we are scrolled all the way down when scrollTop + clientHeight = scrollHeight
    //we want the screen to automatically scroll when we are all the way down / or two messages away from being all the way down.
    if(scrollTop + clientHeight + newMessageHeight + prevNewMessageHeight>= scrollHeight){

        //making the scrollTop eq to the scroll height what makes the automatic scroll down.
        messages.prop(`scrollTop`,scrollHeight);
    }
};

// this function creates the socket to the server
// this socket will be the way the client and the server will communicate.
let socket = io();

//if suddenly the server shuts down the client will still try to keep this socket online and will keep sending req to the server.
//(visible in network tab of dev tools.)
//these to event listeners will fire when we connect / disconnect from the server.
//notice that im not using arrow functions on the client, because only chrome supports es6 (it will only work on chrome..)
socket.on('connect',function () {

    //using andrews 3rd library function jquery.deparam that takes a window.location.search which represents a query string info
    //and returns it decoded normally.
    let params = jQuery.deparam(window.location.search);
    socket.emit('join',params,function (err) {
        if(err){
            alert(err);
            window.location.href="/";
        } else {
            console.log("No Error");
        }
    })
});

//registers and event listener on newMessage
socket.on('newMessage',function (message) {

    //formatting the createdAt timestamp.
    let formattedCreatedAt = moment(message.createdAt).format('h:mm a');

    //getting reference to the html of the template.
    let MessageTemplate = jQuery('#message-template').html();

    //passing the template we wish to render with object data , and the object
    let renderedMessage = Mustache.render(MessageTemplate,{
        from: message.from,
        text: message.text,
        createdAt: formattedCreatedAt
    });

    //adding the rendered template to the #messages-list element.
    jQuery('#messages-list').append(renderedMessage);
    scrollMessages();
});

socket.on('newLocationMessage',function (message) {

    let formattedCreatedAt = moment(message.createdAt).format('h:mm a');

    let locationTemplate = jQuery('#locationMessage-template').html();
    let renderedLocationTemplate = Mustache.render(locationTemplate,{
        from:message.from,
        url:message.url,
        createdAt:formattedCreatedAt
    });
    jQuery('#messages-list').append(renderedLocationTemplate);

    scrollMessages();
    //using jQuery without  mustache.js..

    //target blank makes the pressing on the link open a new tab.
    // let a = jQuery("<a target='_blank'>My current location.</a>");
    // a.attr('href',message.url);
    // let li = jQuery("<li></li>");
    // li.text(`${message.from} ${moment(message.createdAt).format('h:mm a')}:`);
    // li.append(a);
    //
    // jQuery('#messages-list').append(li);
});

socket.on('disconnect',function (){
    console.log("disconnected from the server.");
});

let messageTextBox = jQuery('#message');

jQuery('#message-form').on('submit',function (e) {

    //default of jquery when the event of submit triggers, adds to the url a query parameter , this way we prevent it.
    e.preventDefault();
    let messageObj = {
        from: "User",
        text:messageTextBox.val()
    };

    //emits an event createMessage passing the input data from the user.
    //getting an ack callback from server after the message arrived to it, and when the cb is fired ,we delete the text on the text box.
    socket.emit('createMessage',messageObj,function () {
        messageTextBox.val('')
    });
});

let locationBtn = jQuery('#sendLocationBtn');
locationBtn.on('click',function (e) {

    //checks if the geolocation api works..(its supported by most browsers. no need to import some library)
    if(!navigator.geolocation){
        alert('geolocation does not work.');
        //disabling the send location btn , and changing his text.
        locationBtn.attr('disabled',true);
        locationBtn.text('Unable to send location..');
    } else {
            locationBtn.attr('disabled',true);
            locationBtn.text('Sending location...');
            navigator.geolocation.getCurrentPosition(function (position) {

            //emits an event called sendLocation ,with object that contains lat,lng
            //getting a cb from server, and enabling the btn in the callback.
            socket.emit('sendLocation',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },function () {
                locationBtn.attr('disabled',false);
                locationBtn.text('Send location');
            });

        });
    }
});