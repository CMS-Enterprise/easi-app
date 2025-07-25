// Package s3testconfigs is a utility package that allows us to easily configure test S3 clients
package uploadtestconfigs

import (
	"os"

	"github.com/spf13/viper"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
	"github.com/cms-enterprise/easi-app/pkg/upload"
)

// S3TestClient returns an S3Test client for testing
func S3TestClient(viperConfig *viper.Viper) upload.S3Client {

	s3Cfg := upload.Config{
		Bucket:  viperConfig.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  viperConfig.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}
	//OS GetEnv(called in NewS3Client ) won't get environment variables set by VSCODE for debugging. Set here for testing
	_ = os.Setenv(appconfig.LocalMinioAddressKey, viperConfig.GetString(appconfig.LocalMinioAddressKey))
	_ = os.Setenv(appconfig.LocalMinioS3AccessKey, viperConfig.GetString(appconfig.LocalMinioS3AccessKey))
	_ = os.Setenv(appconfig.LocalMinioS3SecretKey, viperConfig.GetString(appconfig.LocalMinioS3SecretKey))

	return upload.NewS3Client(s3Cfg)
}
