package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clients []websocket.Conn
var history []string

func main() {
	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		conn, _ := upgrader.Upgrade(w, r, nil)

		clients = append(clients, *conn)

		// Send chat history to new client
		for _, msg := range history {
			if err := conn.WriteMessage(websocket.TextMessage, []byte(msg)); err != nil {
				fmt.Printf("error sending message to client: %v\n", err)
			}
		}

		for {
			// Read message from browser
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}

			// Print the message to the console
			fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))

			// Add message to chat history
			history = append(history, string(msg))

			// Broadcast message to all clients
			for _, client := range clients {
				if err = client.WriteMessage(msgType, msg); err != nil {
					return
				}
			}
		}
	})

	// Serve the index.html file
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	// Serve the main.js script
	http.HandleFunc("/client/main.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "client/main.js")
	})

	http.ListenAndServe(":8080", nil)
}
