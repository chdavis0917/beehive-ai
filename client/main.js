let input = document.getElementById("input");
let output = document.getElementById("output");
let socket = new WebSocket("ws://localhost:8080/echo");

socket.onopen = function () {
  output.innerHTML += "Status: Connected\n";
};

socket.onmessage = function (e) {
  output.innerHTML = "Server: " + e.data + "\n" + output.innerHTML;
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
