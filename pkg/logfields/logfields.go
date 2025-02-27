// Package logfields provides a standard location for field names we expect in logs
package logfields

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

//TODO: refactor the app to use this package to standardize log field declarations

// TraceFieldKey is the key to check the trace of a logging chain
const TraceFieldKey string = "traceID"

func TraceField(traceID string) zapcore.Field {
	return zap.String(TraceFieldKey, traceID)
}
