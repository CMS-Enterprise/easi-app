package graph

import (
	"github.com/guregu/null/zero"
)

// This function take a zero.Int (Int64 underneath) and converts/truncates it to an int pointer
//
// NOTE: This function has the potential to truncate the passed in value so should only be used for
//
//	converting values that are known to be in the int32 range (i.e. coming from CEDAR or another
//	source that is guaranteed to be int32)
func zeroIntToIntPtr(zeroInt zero.Int) *int {
	if zeroInt.Ptr() == nil {
		return nil
	}

	value64 := zeroInt.Int64
	value32 := int(value64)
	return &value32
}
