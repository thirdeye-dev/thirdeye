package main

import (
	"fmt"
	"encoding/json"
	"strings"
	"strconv"
    "context"
	"os"
	"log"

	"github.com/r3labs/sse/v2"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

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


func connectToRedis() (*redis.Client, error) {
	port := os.Getenv("REDIS_PORT")
	if port == "" {
		port = "6379"
	}

	host := os.Getenv("REDIS_HOST")
	if host == "" {
		host = "redis"
	}

	redisDb := os.Getenv("REDIS_DB")
	if redisDb == "" {
		redisDb = "0"
	}

	// convert redisDb to int
	redisDbInt, err := strconv.Atoi(redisDb)
	if err != nil {
		redisDbInt = 0
		fmt.Println("[ERROR] Failed to convert REDIS_DB to int, defaulting to 0")
	}

	// Create a new Redis client
	client := redis.NewClient(&redis.Options{
		Addr: host + ":" + port,
		Password: "",               // Replace with your Redis server password
		DB:       redisDbInt,                // Replace with your Redis database number
	})

	fmt.Println("[INFO] Trying to ping Redis on:", host + ":" + port)
	// Ping the Redis server to check if the connection is successful
	pong, err := client.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("[ERROR] Failed to ping the database:", err)
		return nil, err
	}

	fmt.Println("[INFO] Connected to Redis:", pong)
	return client, nil
}

func setTestValues(rdb *redis.Client) {
	fmt.Println("[INFO] Setting test values")
	// array of smart contract ids
	var smartContracts = [...]string{"A.0b2a3299cc857e29.TopShot"}
	
	marshaledSmartContracts, err := json.Marshal(smartContracts)
	if err != nil {
		fmt.Println("[ERROR] Failed to marshal test contracts:", err)
		return
	}

	err = rdb.RPush(ctx, "smart_contracts:flow", marshaledSmartContracts, 0).Err()
	if err != nil {
		fmt.Println("[ERROR] Failed to set test contracts:", err)
	} else {
		fmt.Println("[INFO] Successfully set test smart contracts")
	}
}

func main() {
	rdb, err := connectToRedis()
	setTestValues(rdb)

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

		decoder := json.NewDecoder(strings.NewReader(dataString))
		var root Root

		// Unmarshal the JSON string into the struct.
		err := decoder.Decode(&root)
		if err != nil {
			fmt.Println("Error decoding JSON: ", err)
		}
		
		fmt.Println("[INFO] Checking for matches in redis values")
		// check all the values in redis for key "smart_contracts:flow"
		values, err := rdb.LRange(ctx, "smart_contracts:flow", 0, -1).Result()

		var fetchedSmartContracts []string
		err = json.Unmarshal([]byte(values[0]), &fetchedSmartContracts)

		if err != nil {
			fmt.Println("[Error] Error getting values from redis: ", err)
		}

		if values == nil {
			fmt.Println("[INFO] No values found in redis")
		} else {
			fmt.Println("[INFO] Values found in redis")
			// Print the values
			for _,  smartContract := range fetchedSmartContracts {
				smartContractID := string(smartContract)
				if strings.Contains(dataString, smartContractID) {
					fmt.Println("[INFO] Found a match: ", smartContractID)
				} else {
					fmt.Println("[INFO] No match found for this value")
				}
			}
		}
	})
}
