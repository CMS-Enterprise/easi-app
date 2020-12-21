package upload

import (
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"

	"github.com/google/uuid"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/models"
)

// Config holds the configuration to interact with s3
type Config struct {
	Bucket  string
	Region  string
	IsLocal bool
}

// S3Client is an EASi s3 client wrapper
type S3Client struct {
	client s3iface.S3API
	config Config
}

// NewS3Client creates a new s3 service client
func NewS3Client(config Config) S3Client {
	awsConfig := &aws.Config{
		Region: aws.String(config.Region),
	}

	// if we are in a local dev environment we use Minio for s3
	if config.IsLocal {
		awsConfig.Endpoint = aws.String("http://localhost:9000")
		awsConfig.Credentials = credentials.NewStaticCredentials(
			os.Getenv(appconfig.LocalMinioS3AccessKey),
			os.Getenv(appconfig.LocalMinioS3SecretKey),
			"")
		awsConfig.S3ForcePathStyle = aws.Bool(true)
	}

	s3Session := session.Must(session.NewSession(awsConfig))

	// create the s3 service client
	client := s3.New(s3Session)

	return S3Client{client, config}
}

// NewPutPresignedURL returns a pre-signed URL used for PUT-ing objects
func (c S3Client) NewPutPresignedURL() (*models.PreSignedURL, error) {
	key := uuid.New()
	req, _ := c.client.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key.String()),
	})

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		return &models.PreSignedURL{}, err
	}

	result := models.PreSignedURL{URL: url, Filename: key.String()}

	return &result, nil
}

// NewGetPresignedURL returns a pre-signed URL used for GET-ing objects
func (c S3Client) NewGetPresignedURL(key string) (*models.PreSignedURL, error) {
	objectInput := &s3.GetObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
	}
	req, _ := c.client.GetObjectRequest(objectInput)

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		return &models.PreSignedURL{}, err
	}

	result := models.PreSignedURL{URL: url, Filename: key}

	return &result, nil

}
