package resolvers

import "github.com/cms-enterprise/easi-app/pkg/models"

func newLCIDMetadataChange(action *models.Action) *models.SystemIntakeLCIDMetadataChange {
	if action.LCIDTypeChangePreviousValue == nil &&
		action.LCIDTypeChangeNewValue == nil &&
		action.LCIDComponentChangePreviousValue == nil &&
		action.LCIDComponentChangeNewValue == nil &&
		action.LCIDIsShortenedChangePreviousValue == nil &&
		action.LCIDIsShortenedChangeNewValue == nil &&
		action.LCIDIsLowITChangePreviousValue == nil &&
		action.LCIDIsLowITChangeNewValue == nil {
		return nil
	}

	return &models.SystemIntakeLCIDMetadataChange{
		PreviousType:        action.LCIDTypeChangePreviousValue,
		NewType:             action.LCIDTypeChangeNewValue,
		PreviousComponent:   action.LCIDComponentChangePreviousValue,
		NewComponent:        action.LCIDComponentChangeNewValue,
		PreviousIsShortened: action.LCIDIsShortenedChangePreviousValue,
		NewIsShortened:      action.LCIDIsShortenedChangeNewValue,
		PreviousIsLowIt:     action.LCIDIsLowITChangePreviousValue,
		NewIsLowIt:          action.LCIDIsLowITChangeNewValue,
	}
}
