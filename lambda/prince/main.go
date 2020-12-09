package main

import (
	"bytes"
	"fmt"
	"log"
	"os/exec"
	"regexp"

	"github.com/aws/aws-lambda-go/lambda"
)

// GenerateEvent is the request send to the lambda function
type GenerateEvent struct {
	HTML []byte `json:"html"`
}

// PDFResponse is the response returned by the lambda function upon success
type PDFResponse struct {
	Content []byte `json:"content"`
}

// HandleLambdaEvent is a function
func HandleLambdaEvent(event GenerateEvent) (PDFResponse, error) {
	log.Printf("%s", event.HTML)

	cmd := exec.Command("./prince", "-", "--output=-", "--pdf-profile=PDF/UA-1")
	cmd.Stdin = bytes.NewReader(event.HTML)

	var out bytes.Buffer
	cmd.Stdout = &out

	var err bytes.Buffer
	cmd.Stderr = &err

	runErr := cmd.Run()
	if runErr != nil {
		log.Printf("%s", err.Bytes())
		return PDFResponse{}, fmt.Errorf("prince run failed: %w", runErr)
	}

	var princeErrorRegex = regexp.MustCompile(`prince:\s+error:\s+([^\n]+)`)

	errorString := err.String()
	if princeErrorRegex.MatchString(errorString) {
		log.Printf("%s", err.Bytes())
		return PDFResponse{}, fmt.Errorf("prince run had error: %v", errorString)
	}

	return PDFResponse{Content: out.Bytes()}, nil
}

func main() {
	lambda.Start(HandleLambdaEvent)
}
