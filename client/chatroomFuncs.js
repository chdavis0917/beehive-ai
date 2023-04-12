//GET REQUEST
const socket = new WebSocket('endpoint');

//scroll to bottom to display most recent messages
const scrollToBottom = () => {
  $('#chatroom').scrollTop($('#chatroom')[0].scrollHeight - $('#chatroom')[0].clientHeight);
}

//append messages to chatroom
const appendMessage = (msg) => {
  let jQuerySelection = $(`#${msg._id}`);
  if (!jQuerySelection.length) {
    let div = $('<div/>').attr('id', msg._id).addClass('msg-div');
    let username = $('<span/>').addClass('username').text(`${msg.created_by}:`);
    let message = $('<span/>').addClass('message').text(msg.message);
    div.append(username, message);
    $('#chatroom').append(div);
    scrollToBottom();
  }
}

const getMessages = () => {
  socket.send(JSON.stringify({ type: 'getMessages' }));
}

//POST REQUEST
const postMessage = () => {
  //create msg object to post to server
  let message = $('#msg-body').val();
  let created_by = 'test';
  let msgObj = JSON.stringify({ message, created_by });
  //make AJAX post request
  socket.send(JSON.stringify({ type: 'postMessage', message: msgObj }));
}

// Handle incoming WebSocket messages
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'messages':
      const messages = JSON.parse(message.data);
      // reverse order of messages to display most recent ones last
      const revMessages = messages.reverse();
      revMessages.forEach((msg) => {
        appendMessage(msg);
      });
      break;
    case 'message':
      const msg = JSON.parse(message.data);
      appendMessage(msg);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

setInterval(getMessages, 300);

//SUBMIT HANDLER
$('#chatroom-form').on('submit', (e) => {
  //prevents page from reloading (default behavior of submit)
  e.preventDefault();
  postMessage();
  //clear input
  $('#msg-body').val('');
});
