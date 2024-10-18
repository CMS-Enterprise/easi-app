package resolvers

import (
	"context"
	"time"

	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func SetRolesForUserOnCEDARSystem(
	ctx context.Context,
	fetchUserInfo func(context.Context, string) (*models.UserInfo, error),
	cedarCoreClient *cedarcore.Client,
	emailClient *email.Client,
	input models.SetRolesForUserOnSystemInput,
) (*string, error) {
	preExistingRoles, err := cedarCoreClient.GetRolesBySystem(ctx, input.CedarSystemID, nil)
	if err != nil {
		return nil, err
	}

	rs, err := cedarCoreClient.SetRolesForUser(ctx, input.CedarSystemID, input.EuaUserID, input.DesiredRoleTypeIDs)
	if err != nil {
		return nil, err
	}

	logger := appcontext.ZLogger(ctx)
	principalID := appcontext.Principal(ctx).ID()

	// Asynchronously send an email to the CEDAR team notifying them of the change
	go func() {
		if emailClient == nil {
			return
		}
		// make a new context and copy the logger to it, or else the request will cancel when the parent context cancels
		emailCtx := appcontext.WithLogger(context.Background(), logger)

		// Fetch user info for _both_ the requester _and_ the user whose roles were changed
		// We're using 2 calls to `FetchUserInfo` rather than 1 call to `FetchUserInfos` since we don't know what order they'll come back in with the latter function
		g := new(errgroup.Group)
		var requesterUserInfo *models.UserInfo
		var errRequester error
		g.Go(func() error {
			requesterUserInfo, errRequester = fetchUserInfo(emailCtx, principalID)
			return errRequester
		})

		var targetUserInfo *models.UserInfo
		var errTarget error
		g.Go(func() error {
			targetUserInfo, errTarget = fetchUserInfo(emailCtx, input.EuaUserID)
			return errTarget
		})

		// wait for both calls to complete
		if err := g.Wait(); err != nil {
			// don't fail the request if the lookup fails, just log and return from the go func
			appcontext.ZLogger(emailCtx).Error("failed to lookup user infos for CEDAR notification email", zap.Error(err))
			return
		}

		// _Always_ send an email to CEDAR with role change information
		// This is used as an audit trail by the CEDAR team to help keep an eye on changes
		if err := emailClient.SendCedarRolesChangedEmail(emailCtx, requesterUserInfo.DisplayName, targetUserInfo.DisplayName, rs.DidAdd, rs.DidDelete, rs.RoleTypeNamesBefore, rs.RoleTypeNamesAfter, rs.SystemName, time.Now()); err != nil {
			// don't fail the request if the email fails, just log and return from the go func
			appcontext.ZLogger(emailCtx).Error("failed to send CEDAR notification email", zap.Error(err))
			return
		}

		if rs.IsNewUser {
			if err := emailClient.SendCedarYouHaveBeenAddedEmail(emailCtx, rs.SystemName, input.CedarSystemID, rs.RoleTypeNamesAfter, targetUserInfo.Email); err != nil {
				// don't fail the request if the email fails, just log and return from the go func
				appcontext.ZLogger(emailCtx).Error("failed to send email to user who was added to CEDAR system", zap.Error(err))
				return
			}
		}
		if rs.DidAdd {
			if err := emailClient.SendCedarNewTeamMemberEmail(emailCtx, targetUserInfo.DisplayName, targetUserInfo.Email.String(), rs.SystemName, input.CedarSystemID, rs.RoleTypeNamesAfter, preExistingRoles); err != nil {
				appcontext.ZLogger(emailCtx).Error("failed to send CEDAR email for new team member added", zap.Error(err))
				return
			}
		}
	}()

	resp := "Roles changed successfully"
	return &resp, nil
}
