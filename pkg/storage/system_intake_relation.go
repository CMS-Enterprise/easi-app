package storage

import (
	"encoding/json"
)

type extract struct {
	SystemIntakeID string `json:"system_intake_id"`
}

func extractSystemIntakeIDs(paramsAsJSON string) ([]string, error) {
	var extracted []extract
	if err := json.Unmarshal([]byte(paramsAsJSON), &extracted); err != nil {
		return nil, err
	}

	out := make([]string, len(extracted))

	for i := range extracted {
		out[i] = extracted[i].SystemIntakeID
	}

	return out, nil
}
