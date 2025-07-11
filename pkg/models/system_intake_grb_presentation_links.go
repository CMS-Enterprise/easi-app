package models

import (
	"github.com/google/uuid"
)

type SystemIntakeGRBPresentationLinks struct {
	BaseStructUser
	SystemIntakeID           uuid.UUID `json:"systemIntakeId" db:"system_intake_id"`
	RecordingLink            *string   `json:"recordingLink" db:"recording_link"`
	RecordingPasscode        *string   `json:"recordingPasscode" db:"recording_passcode"`
	TranscriptLink           *string   `json:"transcriptLink" db:"transcript_link"`
	TranscriptS3Key          *string   `db:"transcript_s3_key"`
	TranscriptFileName       *string   `json:"transcriptFileName" db:"transcript_file_name"`
	PresentationDeckS3Key    *string   `db:"presentation_deck_s3_key"`
	PresentationDeckFileName *string   `json:"presentationDeckFileName" db:"presentation_deck_file_name"`
}

func (s SystemIntakeGRBPresentationLinks) GetMappingKey() uuid.UUID {
	return s.SystemIntakeID
}

func (s SystemIntakeGRBPresentationLinks) GetMappingVal() *SystemIntakeGRBPresentationLinks {
	return &s
}

func NewSystemIntakeGRBPresentationLinks(createdByUserAcctID uuid.UUID) *SystemIntakeGRBPresentationLinks {
	return &SystemIntakeGRBPresentationLinks{
		BaseStructUser: NewBaseStructUser(createdByUserAcctID),
	}
}

// IsEmpty returns true if the *SystemIntakeGRBPresentationLinks is nil, or if the required (nullable) fields are ALL nil
func (s *SystemIntakeGRBPresentationLinks) IsEmpty() bool {
	if s == nil {
		return true
	}

	if s.RecordingLink == nil && s.TranscriptLink == nil && s.TranscriptS3Key == nil && s.PresentationDeckS3Key == nil {
		return true
	}

	return false
}
