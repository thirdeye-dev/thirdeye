package utils

import (
	"os"
	"encoding/json"
	"log"
	"github.com/bradfitz/gomemcache/memcache"
)

var mc *memcache.Client

func init() {
	mc = memcache.New(os.Getenv("THIRDEYE_MEMCACHED_URL"))
}

func GetThirdeyeAddresses() ([]ThirdeyeAddress, error) {
	item, err := mc.Get("thirdeye_addresses")
	if err == memcache.ErrCacheMiss {
		return []ThirdeyeAddress{}, nil
	}
	if err != nil {
		log.Printf("[ERROR] Failed to get thirdeye addresses: %v", err)
		return nil, err
	}

	var addresses []ThirdeyeAddress
	if err := json.Unmarshal(item.Value, &addresses); err != nil {
		log.Printf("[ERROR] Failed to unmarshal thirdeye addresses: %v", err)
		return nil, err
	}

	return addresses, nil
}

func AppendThirdeyeAddress(newAddress ThirdeyeAddress) error {
	addresses, err := GetThirdeyeAddresses()
	if err != nil {
		log.Printf("[ERROR] Failed to get existing addresses: %v", err)
		return err
	}

	for _, addr := range addresses {
		if addr.Network == newAddress.Network &&
			addr.Chain == newAddress.Chain &&
			addr.Address == newAddress.Address {
			return err
		}
	}

	addresses = append(addresses, newAddress)

	jsonData, err := json.Marshal(addresses)
	if err != nil {
		log.Printf("[ERROR] Failed to marshal addresses: %v", err)
		return err
	}

	err = mc.Set(&memcache.Item{
		Key:   "thirdeye_addresses",
		Value: jsonData,
	})
	if err != nil {
		log.Printf("[ERROR] Failed to store updated addresses: %v", err)
		return err
	}

	return nil
}

func DeleteThirdeyeAddresses() error {
	err := mc.Delete("thirdeye_addresses")
	if err == memcache.ErrCacheMiss {
		return nil
	}
	if err != nil {
		log.Printf("[ERROR] Failed to delete thirdeye addresses: %v", err)
		return err
	}
	return nil
}