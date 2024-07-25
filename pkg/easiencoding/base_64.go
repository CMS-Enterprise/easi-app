package easiencoding

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"io"
)

// DecodeBase64File returns a ReadSeeker after decoding a from base 64
func DecodeBase64File(encodedSeeker *io.ReadSeeker) (io.ReadSeeker, error) {
	buf := new(bytes.Buffer)
	_, err := buf.ReadFrom(*encodedSeeker)

	if err != nil {
		return nil, fmt.Errorf("unable to read file data for ")
	}
	inputFile := buf.Bytes()
	decodedFile := make([]byte, base64.StdEncoding.DecodedLen(len(inputFile)))
	_, err = base64.StdEncoding.Decode(decodedFile, inputFile)
	if err != nil {
		return nil, fmt.Errorf("unable to decode file data for ")
	}

	decodedReader := bytes.NewReader(decodedFile)

	return decodedReader, nil

}

// EncodeBase64String returns a string encoded in base 64
func EncodeBase64String(stringToEncode string) string {

	encodedString := base64.StdEncoding.EncodeToString([]byte(stringToEncode))

	return encodedString

}
