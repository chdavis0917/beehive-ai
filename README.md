## Introduction

Welcome to the chatroom!

This is a simple chat web application based on WebSockets. The application supports one chat room, and users must provide a password that is validated on the server side before accessing the chat.

Once inside the chat, users can immediately send messages that will be displayed to other users. New users joining the chat will have access to a message history, although the history doesn't persist in case of a server restart.

In case of errors, users will receive a message, and the error will be logged on the server side. The backend for this project makes use of Go, while the frontend uses TypeScript/JavaScript.