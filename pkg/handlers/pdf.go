package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
)

// PDFHandler handles PDFs
type PDFHandler struct {
	HandlerBase
}

// NewPDFHandler returns a new PDFHandler
func NewPDFHandler() *PDFHandler {
	return &PDFHandler{}
}

// Handle returns an http.HandlerFunc
func (h PDFHandler) Handle() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type GenerateRequest struct {
			HTML     string `json:"html"`
			Filename string `json:"filename"`
		}

		var data GenerateRequest

		body, readErr := ioutil.ReadAll(r.Body)
		if readErr != nil {
			h.WriteErrorResponse(r.Context(), w, readErr)
			return
		}

		parseErr := json.Unmarshal(body, &data)
		if parseErr != nil {
			h.WriteErrorResponse(r.Context(), w, parseErr)
			return
		}

		postBody := new(bytes.Buffer)
		writer := multipart.NewWriter(postBody)

		header := make(textproto.MIMEHeader)
		header.Set("Content-Disposition", `form-data; name="file"; filename="input.html"`)
		header.Set("Content-Type", "text/html")

		part, partErr := writer.CreatePart(header)
		if partErr != nil {
			h.WriteErrorResponse(r.Context(), w, partErr)
			return
		}
		if _, partWriteErr := part.Write([]byte(data.HTML)); partWriteErr != nil {
			h.WriteErrorResponse(r.Context(), w, partWriteErr)
			return
		}

		if closeErr := writer.Close(); closeErr != nil {
			h.WriteErrorResponse(r.Context(), w, closeErr)
			return
		}

		// TODO This should use the logger
		fmt.Println("making request to lambda")

		uri := os.Getenv("PDF_GENERATOR_LAMBDA_URL")

		client := &http.Client{}
		request, reqErr := http.NewRequest("POST", uri, postBody)
		if reqErr != nil {
			h.WriteErrorResponse(r.Context(), w, reqErr)
			return
		}
		request.Header.Add("Content-Type", "text/html")

		response, respErr := client.Do(request)
		if respErr != nil {
			h.WriteErrorResponse(r.Context(), w, respErr)
			return
		}

		// If we were sending the response to a non-XHR, these headers would be necessary
		//
		// w.Header().Set("Content-Length", response.Header.Get("Content-Length"))
		// w.Header().Set("Content-Disposition", "attachment; filename=generated.pdf")
		// w.Header().Set("Content-Type", "application/pdf")

		if _, copyErr := io.Copy(w, response.Body); copyErr != nil {
			h.WriteErrorResponse(r.Context(), w, copyErr)
			return
		}
	}
}
