package resolvers

import (
	"context"
	"time"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	cedarcore "github.com/cms-enterprise/easi-app/pkg/cedar/core"
	"github.com/cms-enterprise/easi-app/pkg/email"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

func SetRolesForUserOnCEDARSystem(
	ctx context.Context,
	fetchUserInfos func(context.Context, []string) ([]*models.UserInfo, error),
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

	principalID := appcontext.Principal(ctx).ID()

	if emailClient != nil {
		users, err := fetchUserInfos(ctx, []string{principalID, input.EuaUserID})
		if err != nil {
			appcontext.ZLogger(ctx).Error("failed to lookup user infos for CEDAR notification email", zap.Error(err))
			return nil, err
		}
		requesterUserInfo, targetUserInfo := users[0], users[1]

		// _Always_ send an email to CEDAR with role change information
		// This is used as an audit trail by the CEDAR team to help keep an eye on changes
		if err := emailClient.SendCedarRolesChangedEmail(ctx, requesterUserInfo.DisplayName, targetUserInfo.DisplayName, rs.DidAdd, rs.DidDelete, rs.RoleTypeNamesBefore, rs.RoleTypeNamesAfter, rs.SystemName, time.Now()); err != nil {
			appcontext.ZLogger(ctx).Error("failed to send CEDAR notification email", zap.Error(err))
			return nil, err
		}

		if rs.IsNewUser {
			if err := emailClient.SendCedarYouHaveBeenAddedEmail(ctx, rs.SystemName, input.CedarSystemID, rs.RoleTypeNamesAfter, targetUserInfo.Email); err != nil {
				appcontext.ZLogger(ctx).Error("failed to send email to user who was added to CEDAR system", zap.Error(err))
				return nil, err
			}
			if err := emailClient.SendCedarNewTeamMemberEmail(ctx, targetUserInfo.DisplayName, targetUserInfo.Email.String(), rs.SystemName, input.CedarSystemID, rs.RoleTypeNamesAfter, preExistingRoles); err != nil {
				appcontext.ZLogger(ctx).Error("failed to send CEDAR email for new team member added", zap.Error(err))
				return nil, err
			}
		}
	}
	resp := "Roles changed successfully"
	return &resp, nil
}
