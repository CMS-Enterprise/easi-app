package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// CreateFileUploadURL is our handler for creating pre-signed S3 upload URLs
type CreateFileUploadURL func(ctx context.Context) (*models.PreSignedURL, error)

// CreateFileDownloadURL is a handler for creating pre-signed S3 download URLs
type CreateFileDownloadURL func(ctx context.Context, key string) (*models.PreSignedURL, error)

// CreateUploadedFile is a handler for storing file upload metadata
type CreateUploadedFile func(ctx context.Context, file *models.UploadedFile) (*models.UploadedFile, error)

// FetchUploadedFile is a handler for fetching file upload metadata
type FetchUploadedFile func(ctx context.Context, id uuid.UUID) (*models.UploadedFile, error)

// NewFileUploadHandler is a constructor for FileUploadHandler
func NewFileUploadHandler(
	base HandlerBase,
	createUploadURL CreateFileUploadURL,
	createFileDownloadURL CreateFileDownloadURL,
	createFile CreateUploadedFile,
	fetchFile FetchUploadedFile,
) FileUploadHandler {
	return FileUploadHandler{
		HandlerBase:           base,
		CreateFileUploadURL:   createUploadURL,
		CreateFileDownloadURL: createFileDownloadURL,
		CreateUploadedFile:    createFile,
		FetchUploadedFile:     fetchFile,
	}
}

// FileUploadHandler is the handler for operations related
// to file uploads
type FileUploadHandler struct {
	HandlerBase
	CreateFileUploadURL   CreateFileUploadURL
	CreateFileDownloadURL CreateFileDownloadURL
	CreateUploadedFile    CreateUploadedFile
	FetchUploadedFile     FetchUploadedFile
}

// Handle handles a request for file uploading
func (h FileUploadHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			h.createFileMetadata(w, r)
			return
		default:
			h.WriteErrorResponse(r.Context(), w, &apperrors.MethodNotAllowedError{Method: r.Method})
			return

		}
	}
}

// GenerateUploadPresignedURL is our handler that handles generating pre-signed URLs for file uploading
func (h FileUploadHandler) GenerateUploadPresignedURL(w http.ResponseWriter, r *http.Request) {
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

// GenerateDownloadPresignedURL handles generating pre-signed URLs for file downloading
func (h FileUploadHandler) GenerateDownloadPresignedURL(w http.ResponseWriter, r *http.Request) {
	fileID, err := requireFileUploadID(mux.Vars(r))
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, err)
		return
	}

	url, err := h.CreateFileDownloadURL(r.Context(), fileID.String())
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

// createFileMetadata saves an uploaded file's metadata to our data store
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

// requireFileUploadID does validation on the ID string received by the API
func requireFileUploadID(reqVars map[string]string) (uuid.UUID, error) {
	valErr := apperrors.NewValidationError(
		errors.New("file upload fetch failed validation"),
		models.UploadedFile{},
		"",
	)

	id := reqVars["file_id"]
	if id == "" {
		valErr.WithValidation("path.fileID", "is required")
		return uuid.UUID{}, &valErr
	}

	fileID, err := uuid.Parse(id)
	if err != nil {
		valErr.WithValidation("path.fileID", "must be UUID")
		return uuid.UUID{}, &valErr
	}
	return fileID, nil
}

// FetchFileMetadata returns metadata for a saved file based on ID
func (h FileUploadHandler) FetchFileMetadata(w http.ResponseWriter, r *http.Request) {
	fileID, err := requireFileUploadID(mux.Vars(r))
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, err)
		return
	}

	uploadedFile, err := h.FetchUploadedFile(r.Context(), fileID)
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, err)
		return
	}

	responseBody, err := json.Marshal(uploadedFile)
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, err)
		return
	}

	_, err = w.Write(responseBody)
	if err != nil {
		h.WriteErrorResponse(r.Context(), w, err)
		return
	}
}
