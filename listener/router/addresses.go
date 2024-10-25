package router

import (
	utils "thirdeye/utils"

	"log"
	fiber "github.com/gofiber/fiber/v2"
)

func SetupAddressesRoutes() {
	ADDRESSES.Get("/get", HandleGetAddresses)
	ADDRESSES.Post("/create", HandleCreateAddress)
	ADDRESSES.Delete("/delete", HandleDeleteAddresses)
}

func HandleGetAddresses(c *fiber.Ctx) error {
	addresses, err := utils.GetThirdeyeAddresses()
	if err != nil {
		log.Printf("[ERROR] Failed to get addresses: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"addresses": addresses,
	})
}

func HandleCreateAddress(c *fiber.Ctx) error {
	var newAddress utils.ThirdeyeAddress
	
	if err := c.BodyParser(&newAddress); err != nil {
		log.Printf("[ERROR] Invalid request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if newAddress.Network == "" || newAddress.Chain == "" || newAddress.Address == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Network, Chain, and Address are required fields",
		})
	}

	if err := utils.AppendThirdeyeAddress(newAddress); err != nil {
		log.Printf("[ERROR] Failed to add address: %v", err)
		if err.Error() == "address already exists" {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Address added successfully",
		"address": newAddress,
	})
}

func HandleDeleteAddresses(c *fiber.Ctx) error {
	if err := utils.DeleteThirdeyeAddresses(); err != nil {
		log.Printf("[ERROR] Failed to delete addresses: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "All addresses deleted successfully",
	})
}