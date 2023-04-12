package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/gorilla/websocket"
    "encoding/json"
)

type Message struct {
    ID        string `json:"id,omitempty"`
    Message   string `json:"message,omitempty"`
    CreatedBy string `json:"created_by,omitempty"`
}

var messages []Message

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

func main() {
    router := mux.NewRouter()

    // API endpoint to retrieve all messages
    router.HandleFunc("/messages", getMessages).Methods("GET")

    // API endpoint to add a new message
    router.HandleFunc("/messages", addMessage).Methods("POST")

    // Websocket endpoint to handle real-time updates
    router.HandleFunc("/ws", websocketHandler)

    // Serve the frontend content
    router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "index.html")
    })

    // Serve the main.js file
  // Serve the main.js file
router.HandleFunc("/client/main.js", func(w http.ResponseWriter, r *http.Request) {
    http.ServeFile(w, r, "./client/main.js")
})


    log.Fatal(http.ListenAndServe(":8080", router))
    log.Println("Server is running on port 8080")
}

func getMessages(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(messages)
}

func addMessage(w http.ResponseWriter, r *http.Request) {
    var message Message
    _ = json.NewDecoder(r.Body).Decode(&message)
    messages = append(messages, message)
    json.NewEncoder(w).Encode(message)
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
    // Upgrade the HTTP connection to a WebSocket connection
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
    
    // Add the new connection to the list of connections
    connections := make(map[*websocket.Conn]bool)
    
    defer func() {
        // Close the WebSocket connection and remove it from the list of connections
        conn.Close()
        delete(connections, conn)
    }()
    
    // Send the list of messages to the newly connected client
    err = conn.WriteJSON(messages)
    if err != nil {
        log.Println(err)
        return
    }
    
    for {
        // Listen for new messages and push them to connected clients
        var message Message
        err = conn.ReadJSON(&message)
        if err != nil {
            if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
                log.Printf("error: %v", err)
            }
            break
        }
        
        messages = append(messages, message)
        
        for conn := range connections {
            err = conn.WriteJSON(messages)
            if err != nil {
                log.Println(err)
                return
            }
        }
    }
}
