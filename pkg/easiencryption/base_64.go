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

// DecodeBase64String returns a string after decoding it from base 64
func DecodeBase64String(encodedString string) (io.ReadSeeker, error) {

	decodedString, err := base64.StdEncoding.DecodeString(encodedString)
	if err != nil {
		return nil, fmt.Errorf("unable to decode file data for ")
	}

	decodedReader := bytes.NewReader(decodedString)

	return decodedReader, nil

}

// EncodeBase64String returns a string encoded in base 64
func EncodeBase64String(stringToEncode string) string {

	encodedString := base64.StdEncoding.EncodeToString([]byte(stringToEncode))

	return encodedString

}
