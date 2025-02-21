package easiencoding

import (
	"bytes"
	"encoding/base64"
	"errors"
	"io"
)

// DecodeBase64File returns a ReadSeeker after decoding a from base 64
func DecodeBase64File(encodedSeeker *io.ReadSeeker) (io.ReadSeeker, error) {
	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(*encodedSeeker); err != nil {
		return nil, errors.New("unable to read file data when decoding base 64 file")
	}

	inputFile := buf.Bytes()
	decodedFile := make([]byte, base64.StdEncoding.DecodedLen(len(inputFile)))
	if _, err := base64.StdEncoding.Decode(decodedFile, inputFile); err != nil {
		return nil, errors.New("unable to decode file data")
	}

	return bytes.NewReader(decodedFile), nil

}

// EncodeBase64String returns a string encoded in base 64
func EncodeBase64String(stringToEncode string) string {
	return base64.StdEncoding.EncodeToString([]byte(stringToEncode))
}
