package storage

import (
	"encoding/json"
)

type extractTRBRequestID struct {
	TRBRequestID string `json:"trb_request_id"`
}

func extractTRBRequestIDs(paramsAsJSON string) ([]string, error) {
	var extracted []extractTRBRequestID
	if err := json.Unmarshal([]byte(paramsAsJSON), &extracted); err != nil {
		return nil, err
	}

	out := make([]string, len(extracted))

	for i := range extracted {
		out[i] = extracted[i].TRBRequestID
	}

	return out, nil
}
