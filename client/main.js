// Chatroom solution with WebSocket API and vanilla DOM manipulation

// Variables to simplify references to HTML elements
const submit = document.querySelector('#submit');
const input = document.querySelector('input');
const mainContainer = document.querySelector('#chatroom');

// Create a new WebSocket object
const ws = new WebSocket('wss://ih2ozbmr1j.execute-api.us-east-2.amazonaws.com/default/beehiveWebsockets');

// Function for retrieving all messages
const getMessages = () => {
  // Send a message to the WebSocket server to retrieve all messages
  ws.send(JSON.stringify({ action: 'getMessages' }));
};

// Upon opening the WebSocket connection...
ws.addEventListener('open', () => {
  getMessages();
});

// Upon receiving a message from the WebSocket server...
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message && message.action === 'retrieveMessages') {
    mainContainer.innerHTML = null;

    for (let i = 0; i < message.data.length; i += 1) {
      new Message(message.data[i]);
    }
  }
});

// Function for posting a message
submit.addEventListener('click', (e) => {
  e.preventDefault();

  if (input.value) {
    // Send a message to the WebSocket server to post a new message
    ws.send(
      JSON.stringify({
        action: 'postMessage',
        data: {
          message: input.value,
          created_at: new Date(Date.now()),
          created_by: 'Beehive'
        },
      })
    );
  }

  input.value = '';
});

// Code for constructing an individual message component
class Message {
  constructor(msgData) {
    this.message = msgData['message'];
    this.author = msgData['created_by'];
    this.timestamp = msgData['created_at'];

    this.node = document.createElement('div');
    this.node.setAttribute('class', 'message');
    this.node.style.backgroundColor = 'whitesmoke';

    const msgPara = document.createElement('p');
    msgPara.innerText = `${this.author} at ${this.timestamp}: ${this.message}`;
    msgPara.style.padding = '10px';
    msgPara.style.marginTop = '5px';

    this.node.appendChild(msgPara);
    mainContainer.appendChild(this.node);
  }
}

// Styling
document.querySelector('body').style.fontFamily = '"Trebuchet MS", Helvetica, sans-serif';

mainContainer.style.height = '500px';
mainContainer.style.width = '80%';
mainContainer.style.margin = '30px auto 0 auto';
mainContainer.style.border = '1px solid black';
mainContainer.style.borderRadius = '5px';
mainContainer.style.padding = '10px';
mainContainer.style.overflowY = 'scroll';

document.querySelector('input').style.width = '80%';
document.querySelector('input').style.margin = '20px auto';
