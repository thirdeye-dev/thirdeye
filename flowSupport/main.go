package main

import (
	"fmt"
	"encoding/json"
	"strings"
	"os"

	"github.com/r3labs/sse/v2"
	"github.com/lib/pq"
	"database/sql"
)

type LatestTransaction struct {
	Hash          string     `json:"hash"`
	Height        int        `json:"height"`
	Index         int        `json:"index"`
	Status        string     `json:"status"`
	KeyIndex      int        `json:"keyIndex"`
	SequenceNumber int        `json:"sequenceNumber"`
	GasLimit      int        `json:"gasLimit"`
	Script        string     `json:"script"`
	Arguments     []struct {
		Type     string     `json:"type"`
		Value    interface{} `json:"value"`
	} `json:"arguments"`
	HasError     bool       `json:"hasError"`
	Error       interface{} `json:"error"`
	EventCount   int        `json:"eventCount"`
	Time         string     `json:"time"`
	Payer        struct {
		Address string `json:"address"`
	} `json:"payer"`
	Proposer    struct {
		Address string `json:"address"`
	} `json:"proposer"`
	Authorizers []struct {
		Address string `json:"address"`
	} `json:"authorizers"`
	Events struct {
		Edges []struct {
			Node struct {
				Type struct {
					ID string `json:"id"`
				} `json:"type"`
				Fields []struct {
					Type  string      `json:"type"`
					Value interface{} `json:"value"`
				} `json:"fields"`
			} `json:"node"`
		} `json:"edges"`
	} `json:"events"`

}

type Data struct {
	LatestTransaction LatestTransaction `json:"latestTransaction"`
}

type Root struct {
	Data Data `json:"data"`
}


func connectToDatabase() (*sql.DB, error) {
	dbName := os.Getenv("POSTGRES_DB")
	if dbName == "" {
		dbName = "main"
	}

	dbUser := os.Getenv("POSTGRES_USER")
	if dbUser == "" {
		dbUser = "admin"
	}

	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	if dbPassword == "" {
		dbPassword = "admin"
	}

	dbHost := os.Getenv("POSTGRES_HOST")	
	if dbHost == "" {
		dbHost = "postgres"
	}

	pgConn := fmt.Sprintf("postgres://%s:%s@%s/%s", dbUser, dbPassword, dbHost, dbName)
	conn, err := pq.NewConnector(pgConn)
	if err != nil {
		panic(err)
	}

	db := sql.OpenDB(conn)
	fmt.Println("[INFO] Connected to database")
	return db, err
}

func main() {
	db, err := connectToDatabase()
	if err != nil {
		panic(err)
	}


	fmt.Println("[INFO] Starting SSE client")
    url := "https://query.flowgraph.co/?query=subscription%20TransactionStreamSubscription%20%7B%20%20%20%20%20%20%20%20%20%20%20%20%20latestTransaction%20%7B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20...TransactionStreamItemFragment%20%20%20%20%7D%20%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20fragment%20TransactionStreamItemFragment%20on%20Transaction%20%7B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20hash%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20height%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20index%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20status%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20keyIndex%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20sequenceNumber%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20gasLimit%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20script%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20arguments%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20hasError%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20error%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20eventCount%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20time%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20payer%20%7B%20address%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20proposer%20%7B%20%20%20%20%20%20address%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20authorizers%20%7B%20address%20%7D%20%20events%20%7B%20%20%20%20%20%20edges%20%7B%20%20%20%20%20%20%20%20node%20%7B%20%20%20%20%20%20%20%20%20%20type%20%7B%20%20%20%20%20%20%20%20%20%20%20%20id%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%20%20%20%20fields%20%20%20%20%20%20%20%20%7D%20%20%20%20%20%20%7D%20%20%20%20%7D%20%20%20%20%20%7D&token=5a477c43abe4ded25f1e8cc778a34911134e0590"

	// query:
	// subscription TransactionStreamSubscription {             
	// latestTransaction {                   
	// ...TransactionStreamItemFragment    }  }                 
	// fragment TransactionStreamItemFragment on Transaction {                  
	// hash                  height                  index                  
	// status                  keyIndex                  sequenceNumber                  
	// gasLimit                  script                  arguments                  
	// hasError                  error                  eventCount                  
	// time                  payer { address }                    proposer {      
	// address    }   authorizers { address }  events { edges {        node {          
	// type {            id          }          
	// fields        }      }    }     }

	client := sse.NewClient(url)

	client.SubscribeRaw(func(msg *sse.Event) {
		// Got some data!
		dataString := string(msg.Data)
		fmt.Println("[DEBUG] Data: ", dataString)

		decoder := json.NewDecoder(strings.NewReader(dataString))
		var root Root

		// Unmarshal the JSON string into the struct.
		err := decoder.Decode(&root)
		if err != nil {
			fmt.Println("Error decoding JSON: ", err)
		}

	})
}
