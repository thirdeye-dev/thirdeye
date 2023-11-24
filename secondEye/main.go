package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"log"
	"os"
	"fmt"
	"strings"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"encoding/json"
)

type User struct {
	UserId       int
}

func handleAuth(req *http.Request) (User, error) {
	tokenString := req.Header.Get("Authorization")
	user := User{}

	// check for bearer "JWT"
	if strings.HasPrefix(tokenString, "JWT ") {
		tokenString = strings.TrimPrefix(tokenString, "JWT ")
		tokenString = strings.TrimSpace(tokenString)
	} else {
		return user, errors.New("Invalid token")
	}

	if tokenString == "" {
		return user, errors.New("Token not provided")
	}

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// get DJANGO_SECRET_KEY from env
		secretKey := os.Getenv("DJANGO_SECRET_KEY")
		if secretKey == "" {
			return user, errors.New("DJANGO_SECRET_KEY not provided")
		}

		// Validate the alg is what we expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Println("[DEBUG] Unexpected signing method: %v", token.Header["alg"])
			return user, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		// Return the secret key
		return []byte(secretKey), nil
	})

	log.Println("[DEBUG] tokenString: ", tokenString)

	// Check for errors in parsing the token
	if err != nil {
		log.Println("[ERROR] There was an error: ", err)
		return user, err
	}

	// Check if the token is valid
	if !token.Valid {
		return user, errors.New("Invalid token")
	}

	log.Println("[DEBUG] token: ", token)

	// Get the claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return user, errors.New("Invalid token claims")
	}

	// Get the user id from the claims
	userId, ok := claims["user_id"].(int)
	if !ok {
		return user, errors.New("Invalid user id")
	}

	// overwrite user
	user.UserId = userId

	// Return the user
	return user, nil
}

func handleMeApi(resp http.ResponseWriter, req *http.Request) {
	// return User struct
	user, err := handleAuth(req)

	if err != nil {
		log.Printf("[DEBUG] Error: %v", err)
		http.Error(resp, err.Error(), http.StatusUnauthorized)
		return
	}

	// marshal user to json
	json, err := json.Marshal(user)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	// return json
	resp.Header().Set("Content-Type", "application/json")
	resp.Write(json)
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
