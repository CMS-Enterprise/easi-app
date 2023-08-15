package easiencryption

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
)

// DecodeBase64File returns a ReadSeeker after decoding a from base 64
func DecodeBase64File(encodedSeeker *io.ReadSeeker) (io.ReadSeeker, error) {
	decodedFile := []byte{}
	buf := new(bytes.Buffer)
	_, err := buf.ReadFrom(*encodedSeeker)

	if err != nil {
		return nil, fmt.Errorf("unable to read file data for ")
	}
	inputFile := buf.Bytes()
	_, err = base64.StdEncoding.Decode(decodedFile, inputFile)
	if err != nil {
		return nil, fmt.Errorf("unable to decode file data for ")
	}

	decodedReader := bytes.NewReader(decodedFile)

	return decodedReader, nil

}
