package models

//PreSignedURL is the model to return S3 pre-signed URLs
type PreSignedURL struct {
	URL string `json:"URL"`
}
