package ws

import "fmt"

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Hub struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Message, 5),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Register:
			if r, ok := h.Rooms[cl.RoomID]; ok {
				if _, ok := r.Clients[cl.ID]; !ok {
					r.Clients[cl.ID] = cl
				}
			}

		case cl := <-h.Unregister:
			if r, ok := h.Rooms[cl.RoomID]; ok {
				if c, ok := r.Clients[cl.ID]; ok {
					// broadcast a message saying that client has left the room
					if len(r.Clients) != 0 {
						h.Broadcast <- &Message{
							Content:  fmt.Sprintf("user '%s' left the chat", c.Username),
							RoomID:   cl.RoomID,
							Username: c.Username,
						}
					}

					delete(r.Clients, cl.ID)
					close(cl.Message)
				}
			}

		case m := <-h.Broadcast:
			if r, ok := h.Rooms[m.RoomID]; ok {
				for _, cl := range r.Clients {
					cl.Message <- m
				}
			}
		}
	}
}
