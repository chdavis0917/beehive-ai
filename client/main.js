var input = document.getElementById("input");
var output = document.getElementById("output");
var socket = new WebSocket("ws://localhost:8080/echo");
socket.onopen = function () {
    output.innerHTML += "Status: Connected\n";
};
socket.onmessage = function (e) {
    // Create a new message element
    var message = document.createElement("div");
    message.classList.add("message");
    message.innerText = e.data;
    // Add the message element to the chatbox
    output.appendChild(message);
    // Scroll to the bottom of the chatbox
    output.scrollTop = output.scrollHeight;
};
function send() {
    if (input.value.trim() === "") {
        return;
    }
    socket.send(input.value);
    input.value = "";
}
function handleKeyPress(event) {
    if (event.keyCode === 13) {
        send();
    }
}
