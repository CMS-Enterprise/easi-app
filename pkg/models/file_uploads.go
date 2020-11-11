package models

import "github.com/guregu/null"

//PreSignedURL is the model to return S3 pre-signed URLs
type PreSignedURL struct {
	URL null.String `json:"URL"`
}
