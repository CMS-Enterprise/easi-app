package upload

import (
	"io"
	"mime"
	"net/url"
	"os"
	"strings"
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
		awsConfig.Endpoint = aws.String(os.Getenv(appconfig.LocalMinioAddressKey))
		awsConfig.Credentials = credentials.NewStaticCredentials(
			os.Getenv(appconfig.LocalMinioS3AccessKey),
			os.Getenv(appconfig.LocalMinioS3SecretKey),
			"")

		// MinIO by default uses path-style access, which puts the bucket name in the URL, i.e. https://s3.region-code.amazonaws.com/bucket-name/key-name.
		// It's possible to configure MinIO to use virtual-hosted style, but it's tricky to get working with our current Docker Compose setup, so we don't bother with it.
		// See https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html and https://github.com/minio/minio/tree/master/docs/config#domain.
		awsConfig.S3ForcePathStyle = aws.Bool(true)
	}

	s3Session := session.Must(session.NewSession(awsConfig))

	return NewS3ClientUsingClient(s3.New(s3Session), config)
}

// NewS3ClientUsingClient creates a new s3 wrapper using the specified s3 client
// This is most useful for testing where the s3 client needs to be mocked out.
func NewS3ClientUsingClient(s3Client s3iface.S3API, config Config) S3Client {
	return S3Client{
		s3Client,
		config,
	}
}

// NewPutPresignedURL returns a pre-signed URL used for PUT-ing objects
func (c S3Client) NewPutPresignedURL(fileType string) (*models.PreSignedURL, error) {
	// generate a uuid for file name storage on s3
	key := uuid.New().String()

	// get the file extension from the mime type
	extensions, err := mime.ExtensionsByType(fileType)
	if err != nil {
		return &models.PreSignedURL{}, err
	}
	if len(extensions) > 0 {
		key = key + extensions[0]
	}
	req, _ := c.client.PutObjectRequest(&s3.PutObjectInput{
		Bucket:      aws.String(c.config.Bucket),
		Key:         aws.String(key),
		ContentType: aws.String(fileType),
	})

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		return &models.PreSignedURL{}, err
	}

	result := models.PreSignedURL{URL: url, Filename: key}

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

// KeyFromURL strips the configured bucket name from a URL, returning only the S3 key.
//
// This isn't always necessary for working with S3 buckets if they use virtual-hosted-style access, i.e. https://bucket-name.s3.region-code.amazonaws.com/key-name.
// However, MinIO by default uses path-style access, which puts the bucket name in the URL, i.e. https://s3.region-code.amazonaws.com/bucket-name/key-name.
// It's possible to configure MinIO to use virtual-hosted style, but it's tricky to get working with our current Docker Compose setup, so we don't bother with it.
// See https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html and https://github.com/minio/minio/tree/master/docs/config#domain.
func (c S3Client) KeyFromURL(url *url.URL) (string, error) {
	return strings.Replace(url.Path, "/"+c.config.Bucket+"/", "", 1), nil
}

// TagValueForKey returns the tag value and if that tag was found for the
// specified key and tag name. If no value is found, returns an empty string.
func (c S3Client) TagValueForKey(key string, tagName string) (string, error) {
	input := &s3.GetObjectTaggingInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
	}
	tagging, taggingErr := c.client.GetObjectTagging(input)
	if taggingErr != nil {
		return "", taggingErr
	}

	for _, tagSet := range tagging.TagSet {
		if *tagSet.Key == tagName {
			return *tagSet.Value, nil
		}
	}
	return "", nil
}

// UploadFile uploads a file to the configured bucket for saving documents.
// Note that no file extension will be added to the key by this method; it assumes the caller has already added an extension, if desired.
func (c S3Client) UploadFile(key string, body io.ReadSeeker, contentType string) error {
	_, err := c.client.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(c.config.Bucket),
		Key:         aws.String(key),
		ContentType: aws.String(contentType),
	})

	return err
}
