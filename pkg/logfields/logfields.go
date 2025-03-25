// Package logfields provides a standard location for field names we expect in logs
package logfields

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

//TODO: refactor the app to use this package to standardize log field declarations

// TraceFieldKey is the key to check the trace of a logging chain
const TraceFieldKey string = "traceID"

func TraceField(traceID string) zapcore.Field {
	return zap.String(TraceFieldKey, traceID)
}

const (
	jobIDKey       string = "jobID"
	jobNameKey     string = "jobName"
	lastRunTimeKey string = "lastRunTime"
	nextRunTimeKey string = "nextRunTime"
)

// JobID returns a zap field for a job ID
func JobID(jobID uuid.UUID) zapcore.Field {
	return zap.Any(jobIDKey, jobID)
}

// JobName returns a zap field for a job name
func JobName(jobName string) zapcore.Field {
	return zap.String(jobNameKey, jobName)
}

// LastRunTime returns a zap field for a job's last run time
func LastRunTime(lastRunTime time.Time) zapcore.Field {
	return zap.Time(lastRunTimeKey, lastRunTime)
}

// NextRunTime returns a zap field for a job's next run time
func NextRunTime(nextRunTime time.Time) zapcore.Field {
	return zap.Time(nextRunTimeKey, nextRunTime)
}

func IntakeID(intakeID uuid.UUID) zapcore.Field {
	return zap.Any("intakeID", intakeID)
}
