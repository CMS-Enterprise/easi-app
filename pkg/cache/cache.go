package cache

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var client *redis.Client

func CreateCacheConnection(ctx context.Context, connectionUrl string) {
	if client != nil {
		return
	}
	fmt.Println("connecting to " + connectionUrl)
	opts, err := redis.ParseURL(connectionUrl)
	if err != nil {
		panic(err)
	}
	client = redis.NewClient(opts)
}

// Get retrieves and parses a value
func Get[T any](ctx context.Context, key string) (T, error) {
	if client == nil {
		panic(errors.New("no connection!"))
	}
	str, err := client.Get(ctx, key).Result()
	var parsedValue T
	if err == redis.Nil {
		return parsedValue, nil
	} else if err != nil {
		return parsedValue, err
	}
	err = json.Unmarshal([]byte(str), &parsedValue)
	if err != nil {
		return parsedValue, err
	}
	return parsedValue, nil
}

type CacheSetOptions struct {
	expiration time.Duration
}

// Set is a function that assumes it is being passed a struct
func Set(ctx context.Context, key string, val any, opts *CacheSetOptions) error {
	if client == nil {
		panic(errors.New("no connection!"))
	}
	b, err := json.Marshal(val)
	if err != nil {
		return err
	}
	expiration := time.Hour * 24
	if opts != nil && opts.expiration != 0 {
		expiration = opts.expiration
	}
	err = client.Set(ctx, key, string(b), expiration).Err()
	if err != nil {
		return err
	}
	return nil
}

func Delete(ctx context.Context, key string) error {
	_, err := client.Del(ctx, key).Result()
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return err
	}
	return nil
}

func DeleteAll(ctx context.Context, keyPrefix string) error {
	var keys []string
	iter := client.Scan(ctx, 0, keyPrefix, 0).Iterator()
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		return err
	}
	_, err := client.Del(ctx, keys...).Result()
	if err == redis.Nil {
		return nil
	}
	if err != nil {
		return err
	}
	return nil
}
