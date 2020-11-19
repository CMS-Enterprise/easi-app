package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateFileUploadURL is our handler for creating pre-signed S3 upload URLs
type CreateFileUploadURL func(ctx context.Context) (*models.PreSignedURL, error)

// NewFileUploadHandler is a constructor for FileUploadHandler
func NewFileUploadHandler(base HandlerBase, createURL CreateFileUploadURL) FileUploadHandler {
	return FileUploadHandler{
		HandlerBase:         base,
		CreateFileUploadURL: createURL,
	}
}

// FileUploadHandler is the handler for operations related
// to file uploads
type FileUploadHandler struct {
	HandlerBase
	CreateFileUploadURL CreateFileUploadURL
}

// Handle handles a request for file uploading
func (h FileUploadHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			url, err := h.CreateFileUploadURL(r.Context())
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			responseBody, err := json.Marshal(url)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}

			w.WriteHeader(http.StatusCreated)
			_, err = w.Write(responseBody)
			if err != nil {
				h.WriteErrorResponse(r.Context(), w, err)
				return
			}
			return
		}
	}
}
