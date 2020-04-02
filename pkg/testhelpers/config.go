package testhelpers

import (
	"sync"

	"github.com/spf13/viper"
)

var lock = &sync.Mutex{}

// global config for testing
var viperConfig *viper.Viper

// NewConfig returns a global viper config for testing
func NewConfig() *viper.Viper {

	lock.Lock()
	defer lock.Unlock()

	if viperConfig == nil {
		viperConfig = viper.New()
		viperConfig.AutomaticEnv()
	}

	return viperConfig
}
