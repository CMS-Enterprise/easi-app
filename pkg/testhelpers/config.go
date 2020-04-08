package testhelpers

import (
	"sync"

	"github.com/spf13/viper"
)

var configLock = &sync.Mutex{}

// global config for testing
var viperConfig *viper.Viper

// NewConfig returns a global viper config for testing
func NewConfig() *viper.Viper {
	configLock.Lock()
	defer configLock.Unlock()

	if viperConfig == nil {
		viperConfig = viper.New()
		viperConfig.AutomaticEnv()
	}

	return viperConfig
}
