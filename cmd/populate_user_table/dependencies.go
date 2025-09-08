package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/jmoiron/sqlx"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/oktaapi"
	"github.com/cms-enterprise/easi-app/pkg/storage"
)

// getResolverDependencies takes a Viper config and returns a Store and Logger object to be used
// by various resolver functions.
func getResolverDependencies(config *viper.Viper) (
	*sqlx.DB,
	*storage.Store,
	*zap.Logger,
	*oktaapi.ClientWrapper,
) {
	// Create the logger
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	// Create LD Client, which is required for creating the store
	// ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	// if err != nil {
	// 	panic(err)
	// }

	oktaClient, oktaClientErr := oktaapi.NewClient(config.GetString(appconfig.OKTAAPIURL), config.GetString(appconfig.OKTAAPIToken))
	if oktaClientErr != nil {
		logger.Fatal("failed to create okta api client", zap.Error(oktaClientErr))
	}
	// Create the DB Config & Store
	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	store, err := storage.NewStore(dbConfig, nil)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		panic(err)
	}

	db, err := newDB(dbConfig)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		panic(err)
	}

	return db, store, logger, oktaClient
}

func newDB(dbConfig storage.DBConfig) (*sqlx.DB, error) {

	var db *sqlx.DB
	var err error
	if dbConfig.UseIAM {
		//// Connect using the IAM DB package
		awsConfig, err := config.LoadDefaultConfig(context.TODO())
		if err != nil {
			return nil, err
		}

		db = newConnectionPoolWithIam(awsConfig, dbConfig)
		err = db.Ping()
		if err != nil {
			return nil, err
		}
	} else {
		// Connect via normal user/pass
		dataSourceName := fmt.Sprintf(
			"host=%s port=%s user=%s "+
				"password=%s dbname=%s sslmode=%s",
			dbConfig.Host,
			dbConfig.Port,
			dbConfig.Username,
			dbConfig.Password,
			dbConfig.Database,
			dbConfig.SSLMode,
		)

		db, err = sqlx.Connect("postgres", dataSourceName)
		if err != nil {
			return nil, err
		}
	}

	db.SetMaxOpenConns(dbConfig.MaxConnections)
	return db, nil
}

func writeObjectToJSONFile(object interface{}, path string) {
	entryBytes, err := json.Marshal(object)
	if err != nil {
		panic("Can't serialize the object")
	}

	file, err := os.Create(filepath.Clean(path))
	if err != nil {
		fmt.Printf("Error creating file: %v\n", err)

		panic("Can't create the file")
	}
	_, err = file.Write(entryBytes)
	if err != nil {
		panic("Can't write the file")
	}
}

func readJSONFromFile[anyType interface{}](file string, obj *anyType) error {

	f, err := os.Open(file) //nolint
	if err != nil {
		log.Fatal(err)
		return err
	}
	defer f.Close() //nolint

	byteValue, _ := io.ReadAll(f)
	err = json.Unmarshal(byteValue, &obj)

	return err

}
