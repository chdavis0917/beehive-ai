let input: HTMLInputElement = document.getElementById("input") as HTMLInputElement;
let output: HTMLDivElement = document.getElementById("output") as HTMLDivElement;
let socket: WebSocket = new WebSocket("ws://localhost:8080/echo");

socket.onopen = function (): void {
  output.innerHTML += "Status: Connected\n";
};

socket.onmessage = function (e: MessageEvent): void {
  // Create a new message element
  let message: HTMLDivElement = document.createElement("div");
  message.classList.add("message");
  message.innerText = e.data as string;

  // Add the message element to the chatbox
  output.appendChild(message);

  // Scroll to the bottom of the chatbox
  output.scrollTop = output.scrollHeight;
};

function send(): void {
  if (input.value.trim() === "") {
    return;
  }

  socket.send(input.value);

  input.value = "";
}


function handleKeyPress(event: KeyboardEvent): void {
  if (event.keyCode === 13) {
    send();
  }
}
