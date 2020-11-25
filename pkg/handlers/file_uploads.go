package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateFileUploadURL is our handler for creating pre-signed S3 upload URLs
type CreateFileUploadURL func(ctx context.Context) (*models.PreSignedURL, error)

// CreateUploadedFile is a handler for storing file upload metadata
type CreateUploadedFile func(ctx context.Context, file *models.UploadedFile) (*models.UploadedFile, error)

// NewFileUploadHandler is a constructor for FileUploadHandler
func NewFileUploadHandler(base HandlerBase, createURL CreateFileUploadURL, createFile CreateUploadedFile) FileUploadHandler {
	return FileUploadHandler{
		HandlerBase:         base,
		CreateFileUploadURL: createURL,
		CreateUploadedFile:  createFile,
	}
}

// FileUploadHandler is the handler for operations related
// to file uploads
type FileUploadHandler struct {
	HandlerBase
	CreateFileUploadURL CreateFileUploadURL
	CreateUploadedFile  CreateUploadedFile
}

// Handle handles a request for file uploading
func (h FileUploadHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			h.createFileMetadata(w, r)
			return
		}
	}
}

// GeneratePresignedURL is our handler that handles generating pre-signed URLs
func (h FileUploadHandler) GeneratePresignedURL(w http.ResponseWriter, r *http.Request) {
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

func (h FileUploadHandler) createFileMetadata(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		h.WriteErrorResponse(
			r.Context(),
			w,
			&apperrors.BadRequestError{Err: errors.New("empty request not allowed")},
		)
		return
	}
	defer r.Body.Close()

	var file models.UploadedFile
	err := json.NewDecoder(r.Body).Decode(&file)
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, &apperrors.BadRequestError{Err: err})
		return
	}

	savedFile, err := h.CreateUploadedFile(r.Context(), &file)
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, err)
		return
	}

	responseBody, err := json.Marshal(savedFile)
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
}
