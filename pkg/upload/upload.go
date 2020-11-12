package upload

import (
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"

	"github.com/cmsgov/easi-app/pkg/models"
)

// Config holds the configuration to interact with s3
type Config struct {
	Bucket string
	Region string
}

// Client is an EASi s3 client wrapper
type Client struct {
	config Config
	client *s3.S3
}

// NewS3Client creates a new s3 service client
func NewS3Client(config Config) (Client, error) {
	s3Session := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(config.Region)},
	))

	// Create S3 service client
	client := Client{
		config: config,
		client: s3.New(s3Session),
	}
	return client, nil
}

// NewPutPresignedURL returns a pre-signed URL used for PUT-ing objects
func (c Client) NewPutPresignedURL(key string) (*models.PreSignedURL, error) {
	var result models.PreSignedURL
	req, _ := c.client.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
	})

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		return &result, err
	}
	result.URL = url

	return &result, nil
}
