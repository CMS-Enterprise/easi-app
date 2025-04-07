package email

import (
	"context"
	"time"

	"github.com/google/uuid"
)

func (s *EmailTestSuite) TestSendGRBReviewerInvitedToVoteEmail() {
	ctx := context.Background()
	intakeID := uuid.MustParse("27883155-46ad-4c30-b3b0-30e8d093756e")

	startDate := time.Now().AddDate(0, 0, -1)
	endDate := time.Now().AddDate(0, 0, -1)
}
