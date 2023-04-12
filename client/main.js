let input = document.getElementById("input");
let output = document.getElementById("output");
let socket = new WebSocket("ws://localhost:8080/echo");

socket.onopen = function () {
  output.innerHTML += "Status: Connected\n";
};

socket.onmessage = function (e) {
  // Create a new message element
  let message = document.createElement("div");
  message.classList.add("message");
  message.innerText = e.data;

  // Add the message element to the chatbox
  output.appendChild(message);

  // Scroll to the bottom of the chatbox
  output.scrollTop = output.scrollHeight;
};

function send() {
  socket.send(input.value);
  input.value = "";
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    send();
  }
}
