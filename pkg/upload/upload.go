package upload

import (
	"io"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"

	"github.com/cms-enterprise/easi-app/pkg/appconfig"
)

// AVStatusTagName is the name of the tag that stores virus scan results for uploaded files
const AVStatusTagName = "av-status"

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

// GetBucket is a getter for the S3Client's configured bucket.
func (c S3Client) GetBucket() string {
	return c.config.Bucket
}

// PreSignedURL is the model to return S3 pre-signed URLs
type PreSignedURL struct {
	URL      string `json:"URL"`
	Filename string `json:"filename"`
}

// NewGetPresignedURL returns a pre-signed URL used for GET-ing objects
func (c S3Client) NewGetPresignedURL(key string) (*PreSignedURL, error) {
	objectInput := &s3.GetObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
	}
	req, _ := c.client.GetObjectRequest(objectInput)

	url, err := req.Presign(90 * time.Minute) // to match FE timeout in src/views/TimeOutWrapper/index.tsx
	if err != nil {
		return &PreSignedURL{}, err
	}

	result := PreSignedURL{URL: url, Filename: key}

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

// SetTagValueForKey sets the tag value and returns an error if any was encountered.
func (c S3Client) SetTagValueForKey(key string, tagName string, tagValue string) error {
	input := &s3.PutObjectTaggingInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
		Tagging: &s3.Tagging{
			TagSet: []*s3.Tag{
				{
					Key:   aws.String(tagName),
					Value: aws.String(tagValue),
				},
			},
		},
	}
	_, taggingErr := c.client.PutObjectTagging(input)
	if taggingErr != nil {
		return taggingErr
	}

	return nil
}

// UploadFile uploads a file to the configured bucket for saving documents.
// Note that no file extension will be added to the key by this method; it assumes the caller has already added an extension, if desired.
func (c S3Client) UploadFile(key string, body io.ReadSeeker) error {
	_, err := c.client.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(c.config.Bucket),
		Key:    aws.String(key),
		Body:   body,
	})

	return err
}
