package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type AuthenticationUser struct {
	UserId         int  `gorm:"column:id"`
	Password      string `gorm:"column:password"`
	LastLogin     time.Time `gorm:"column:last_login"`
	IsSuperuser   bool   `gorm:"column:is_superuser"`
	Username      string `gorm:"column:username"`
	Email         string `gorm:"column:email"`
	IsStaff       bool   `gorm:"column:is_staff"`
	IsVerified    bool   `gorm:"column:is_verified"`
	CreatedAt     time.Time `gorm:"column:created_at"`
	UpdatedAt     time.Time `gorm:"column:updated_at"`
	AuthProvider string `gorm:"column:auth_provider"`
	Avatar        string `gorm:"column:avatar"`
}

type Organization struct {
	OrganizationId int `gorm:"column:id"`
	Name string `gorm:"column:name"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`

}

func getDatabaseConfig() string {
	host := "postgres"
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	name := os.Getenv("POSTGRES_DB")
	port := "5432"
	sslMode := "disable"
	timeZone := "Asia/Kolkata"

	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		host, user, password, name, port, sslMode, timeZone)
}

func handleAuth(req *http.Request) (AuthenticationUser, error) {
	tokenString := req.Header.Get("Authorization")
	user := AuthenticationUser{}

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
			log.Printf("[DEBUG] Unexpected signing method: %v", token.Header["alg"])
			return user, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		// Return the secret key
		return []byte(secretKey), nil
	})

	log.Printf("[DEBUG] tokenString: %s", tokenString)

	// Check for errors in parsing the token
	if err != nil {
		log.Printf("[ERROR] There was an error: %v", err)
		return user, err
	}

	// Check if the token is valid
	if !token.Valid {
		return user, errors.New("Invalid token")
	}

	log.Printf("[DEBUG] token: %v", token)

	// Get the claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return user, errors.New("Invalid token claims")
	}

	// Get the user id from the claims
	userId, ok := claims["user_id"].(float64)
	if !ok {
		return user, errors.New(fmt.Sprintf("invalid user id: %s", ok))
	}

	// overwrite user
	user.UserId = int(userId)

	// Return the user
	return user, nil
}

func handleMeApi(resp http.ResponseWriter, req *http.Request) {
	// Database configuration
	dsn := getDatabaseConfig()

	// Database connection
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("[ERROR] Failed to connect to the database: %v", err)
		http.Error(resp, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// JWT authentication
	user, err := handleAuth(req)
	if err != nil {
		log.Printf("[DEBUG] Error: %v", err)
		http.Error(resp, err.Error(), http.StatusUnauthorized)
		return
	}

	// Query the authentication_user table
	var authUser AuthenticationUser
	result := db.Table("authentication_user").Where("id = ?", user.UserId).First(&authUser)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			http.Error(resp, "User not found", http.StatusNotFound)
		} else {
			http.Error(resp, result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	// marshal user to json
	userJSON, err := json.Marshal(authUser)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	func HandleMeOrganization(resp http.ResponseWriter, req *http.Request) {
		// Database configuration
		dsn := getDatabaseConfig()
		
		// Database connection
		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf("[ERROR] Failed to connect to the database: %v", err)
			http.Error(resp, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		// JWT authentication
		user, err := handleAuth(req)
		if err != nil {
			log.Printf("[DEBUG] Error: %v", err)
			http.Error(resp, err.Error(), http.StatusUnauthorized)
			return
		}

		// query the organizations_organization table
		var org Organization
		result := db.Table("organizations_organization").Where("id = ?", org.OrganizationId).First(&org)
		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				http.Error(resp, "Organization not found", http.StatusNotFound)
			} else {
				http.Error(resp, result.Error.Error(), http.StatusInternalServerError)
			}
			return
		}

		// marshal user to json
		orgJSON, err := json.Marshal(org)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusInternalServerError)
			return
		}


	// return json
	resp.Header().Set("Content-Type", "application/json")
	resp.Write(userJSON)
	resp.WriteHeader(http.StatusOK)
}


func initHandlers() {
	r := mux.NewRouter()
	r.HandleFunc("/api/v2/me", handleMeApi)
	r.HandleFunc("/api/v2/me/organization", handleMeOrganization)

	http.Handle("/", r)
}

func main() {
	initHandlers()

	log.Println("Server started on port 8080")
	http.ListenAndServe(":8080", nil)
}