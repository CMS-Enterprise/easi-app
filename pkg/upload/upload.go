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

// S3Client is an EASi s3 client wrapper
type S3Client struct {
	client *s3.S3
	config Config
}

// NewS3Client creates a new s3 service client
func NewS3Client(config Config) S3Client {
	s3Session := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(config.Region)},
	))
	// create the s3 service client
	client := s3.New(s3Session)

	return S3Client{client, config}
}

// NewPutPresignedURL returns a pre-signed URL used for PUT-ing objects
func (c S3Client) NewPutPresignedURL(key string) (*models.PreSignedURL, error) {
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
