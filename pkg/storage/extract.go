package storage

import "encoding/json"

type (
	extractSystemIntakeID struct {
		SystemIntakeID string `json:"system_intake_id"`
	}

	extractTRBRequestID struct {
		TRBRequestID string `json:"trb_request_id"`
	}
)

func extractSystemIntakeIDs(paramsAsJSON string) ([]string, error) {
	var extracted []extractSystemIntakeID
	if err := json.Unmarshal([]byte(paramsAsJSON), &extracted); err != nil {
		return nil, err
	}

	out := make([]string, len(extracted))

	for i := range extracted {
		out[i] = extracted[i].SystemIntakeID
	}

	return out, nil
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
