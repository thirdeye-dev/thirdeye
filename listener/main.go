package main

import (
	"log"
	"time"

	"os"
	"fmt"

	router "thirdeye/router"

	fiber "github.com/gofiber/fiber/v2"
	cors "github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/bradfitz/gomemcache/memcache"
)

var memcachedClient *memcache.Client

func connectToMemcached() error {
	memcachedClient = memcache.New(os.Getenv("THIRDEYE_MEMCACHED_URL"))
	
	return memcachedClient.Ping()
}

func waitForMemcached(maxRetries int, retryInterval time.Duration) error {
	for i := 0; i < maxRetries; i++ {
		err := connectToMemcached()
		if err == nil {
			log.Println("[INFO] Successfully connected to Memcached")
			return nil
		}
		
		log.Printf("[WARN] Failed to connect to Memcached (attempt %d/%d): %v\n", 
			i+1, maxRetries, err)
		
		if i < maxRetries-1 {
			log.Printf("[INFO] Retrying in %v...\n", retryInterval)
			time.Sleep(retryInterval)
		}
	}
	
	return fmt.Errorf("failed to connect to Memcached after %d attempts", maxRetries)
}

func CreateServer() *fiber.App {
	app := fiber.New()
	return app
}

func main() {
	// Try to connect to Memcached with retries
	err := waitForMemcached(5, 5*time.Second)
	if err != nil {
		log.Fatal("[ERROR] Could not connect to Memcached: ", err)
	}
	
	app := CreateServer()
	app.Use(cors.New())
	
	// Add a test endpoint to verify Memcached connection
	app.Get("/memcached-test", func(c *fiber.Ctx) error {
		// Try to set and get a test value
		testKey := "test_key"
		testValue := "test_value"
		
		err := memcachedClient.Set(&memcache.Item{
			Key: testKey,
			Value: []byte(testValue),
			Expiration: 30, // 30 seconds
		})
		
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to set value in Memcached",
				"details": err.Error(),
			})
		}
		
		item, err := memcachedClient.Get(testKey)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get value from Memcached",
				"details": err.Error(),
			})
		}
		
		return c.JSON(fiber.Map{
			"status": "success",
			"value": string(item.Value),
		})
	})
	
	router.SetupRoutes(app)
	
	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404)
	})
	
	log.Println("[INFO] Server started on :5002")
	log.Fatal(app.Listen(":5002"))
}