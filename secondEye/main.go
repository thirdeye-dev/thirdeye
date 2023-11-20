package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"log"
	"encoding/json"
)

type User struct {
	Username string
	UserId       int
}

func handleMeApi(resp http.ResponseWriter, req *http.Request) {
	// return User struct
	user := User{
		Username: "aviral",
		UserId:       1,
	}

	// get user from a handlAuth function which returns a user struct
	// and an error!
	
	// marshal user struct to json
	json, err := json.Marshal(user)
	if err != nil {
		log.Println(err)
	}
	
	resp.Write([]byte(json))
	resp.WriteHeader(http.StatusOK)
}

func initHandlers() {
	r := mux.NewRouter()
	r.HandleFunc("/api/v2/me", handleMeApi)

	http.Handle("/", r)
}

func main() {
	initHandlers()

	log.Println("Server started on port 8080")
	http.ListenAndServe(":8080", nil)
}
