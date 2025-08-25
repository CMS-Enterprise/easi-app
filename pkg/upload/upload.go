package upload

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"

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
	client *s3.Client
	config Config
}

// NewS3Client creates a new s3 service client
func NewS3Client(ctx context.Context, s3Config Config) S3Client {
	var (
		configOpts []func(*config.LoadOptions) error
		s3Opts     []func(options *s3.Options)
	)

	configOpts = append(configOpts, config.WithRegion(s3Config.Region))

	// if we are in a local dev environment we use Minio for s3
	if s3Config.IsLocal {
		configOpts = append(configOpts, config.WithBaseEndpoint(os.Getenv(appconfig.LocalMinioAddressKey)))
		configOpts = append(configOpts, config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				os.Getenv(appconfig.LocalMinioS3AccessKey),
				os.Getenv(appconfig.LocalMinioS3SecretKey),
				""),
		))

		// MinIO by default uses path-style access, which puts the bucket name in the URL, i.e. https://s3.region-code.amazonaws.com/bucket-name/key-name.
		// It's possible to configure MinIO to use virtual-hosted style, but it's tricky to get working with our current Docker Compose setup, so we don't bother with it.
		// See https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-bucket-intro.html and https://github.com/minio/minio/tree/master/docs/config#domain.
		s3Opts = append(s3Opts, func(options *s3.Options) {
			options.UsePathStyle = true
		})
	}

	awsConfig, err := config.LoadDefaultConfig(ctx, configOpts...)
	if err != nil {
		panic(fmt.Errorf("problem creating aws config when creating new s3 s3Client: %w", err))
	}

	s3Client := s3.NewFromConfig(awsConfig, s3Opts...)

	return NewS3ClientUsingClient(s3Client, s3Config)
}

// NewS3ClientUsingClient creates a new s3 wrapper using the specified s3 client
// This is most useful for testing where the s3 client needs to be mocked out.
func NewS3ClientUsingClient(s3Client *s3.Client, config Config) S3Client {
	return S3Client{
		client: s3Client,
		config: config,
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
func (c S3Client) NewGetPresignedURL(ctx context.Context, key string) (*PreSignedURL, error) {
	objectInput := &s3.GetObjectInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	}

	req, err := s3.NewPresignClient(c.client).PresignGetObject(ctx, objectInput, func(options *s3.PresignOptions) {
		options.Expires = 90 * time.Minute
	})
	if err != nil {
		return nil, err
	}

	return &PreSignedURL{URL: req.URL, Filename: key}, nil

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
func (c S3Client) TagValueForKey(ctx context.Context, key string, tagName string) (string, error) {
	input := &s3.GetObjectTaggingInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
	}
	tagging, taggingErr := c.client.GetObjectTagging(ctx, input)
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
func (c S3Client) SetTagValueForKey(ctx context.Context, key string, tagName string, tagValue string) error {

	input := &s3.PutObjectTaggingInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
		Tagging: &types.Tagging{
			TagSet: []types.Tag{
				{
					Key:   &tagName,
					Value: &tagValue,
				},
			},
		},
	}
	_, taggingErr := c.client.PutObjectTagging(ctx, input)
	if taggingErr != nil {
		return taggingErr
	}

	return nil
}

// UploadFile uploads a file to the configured bucket for saving documents.
// Note that no file extension will be added to the key by this method; it assumes the caller has already added an extension, if desired.
func (c S3Client) UploadFile(ctx context.Context, key string, body io.ReadSeeker) error {
	_, err := c.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: &c.config.Bucket,
		Key:    &key,
		Body:   body,
	})

	return err
}
