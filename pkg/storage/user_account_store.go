package storage

import (
	"context"
	"database/sql"
	_ "embed"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
	"github.com/cms-enterprise/easi-app/pkg/helpers"
	"github.com/cms-enterprise/easi-app/pkg/sqlqueries"
	"github.com/cms-enterprise/easi-app/pkg/sqlutils"
)

// UserAccountGetByCommonName gets a user account by a give username
func (s *Store) UserAccountGetByCommonName(commonName string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := s.db.PrepareNamed(sqlqueries.UserAccount.GetByCommonName)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"common_name": commonName,
	}

	err = stmt.Get(user, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// UserAccountGetByUsername gets a user account by a give username
func (s *Store) UserAccountGetByUsername(ctx context.Context, np sqlutils.NamedPreparer, username string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	err := namedGet(ctx, np, user, sqlqueries.UserAccount.GetByUsername, args{
		"username": username,
	})
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// UserAccountGetByUsernames gets a user account by a give username
func (s *Store) UserAccountGetByUsernames(ctx context.Context, np sqlutils.NamedPreparer, usernames []string) ([]*authentication.UserAccount, error) {
	unmappedUsers := []*authentication.AcctByUsername{}

	err := namedSelect(ctx, np, &unmappedUsers, sqlqueries.UserAccount.GetByUsernames, args{
		"usernames": pq.Array(usernames),
	})
	if err != nil {
		return nil, err
	}
	users := helpers.OneToOne(usernames, unmappedUsers)

	return users, nil
}

// UserAccountGetByID gets a User account from the database by its internal id.
func (s *Store) UserAccountGetByID(ctx context.Context, np sqlutils.NamedPreparer, id uuid.UUID) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	err := namedGet(ctx, np, user, sqlqueries.UserAccount.GetByID, args{
		"id": id,
	})

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// UserAccountsByIDs gets user accounts by user ID
func (s *Store) UserAccountsByIDs(ctx context.Context, userIDs []uuid.UUID) ([]*authentication.UserAccount, error) {
	var accounts []*authentication.UserAccount
	return accounts, namedSelect(ctx, s.db, &accounts, sqlqueries.UserAccount.GetByIDs, args{
		"user_ids": pq.Array(userIDs),
	})
}

// UserAccountCreate creates a new user account for a given username
func (s *Store) UserAccountCreate(ctx context.Context, np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}
	err := namedGet(ctx, np, user, sqlqueries.UserAccount.Create, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountBulkCreate creates new user accounts for given usernames
func (s *Store) UserAccountBulkCreate(ctx context.Context, np sqlutils.NamedPreparer, userAccounts []*authentication.UserAccount) ([]*authentication.UserAccount, error) {
	for i := range userAccounts {
		if userAccounts[i].ID == uuid.Nil {
			userAccounts[i].ID = uuid.New()
		}
	}
	_, err := namedExec(ctx, np, sqlqueries.UserAccount.Create, userAccounts)
	if err != nil {
		return nil, err
	}

	return userAccounts, nil
}

// UserAccountUpdate updates an existing user account
func (s *Store) UserAccountUpdate(ctx context.Context, np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (
	*authentication.UserAccount,
	error,
) {
	user := &authentication.UserAccount{}
	err := namedGet(ctx, np, user, sqlqueries.UserAccount.Update, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountBulkUpdate updates existing user accounts
func (s *Store) UserAccountBulkUpdate(ctx context.Context, np sqlutils.NamedPreparer, userAccounts []*authentication.UserAccount) (
	[]*authentication.UserAccount,
	error,
) {
	users := []*authentication.UserAccount{}

	ids := []uuid.UUID{}
	commonNames := []string{}
	locales := []string{}
	emails := []string{}
	givenNames := []string{}
	familyNames := []string{}
	zoneInfos := []string{}
	hasLoggedIns := []bool{}

	for _, userAccount := range userAccounts {
		ids = append(ids, userAccount.ID)
		commonNames = append(commonNames, userAccount.CommonName)
		locales = append(locales, userAccount.Locale)
		emails = append(emails, userAccount.Email)
		givenNames = append(givenNames, userAccount.GivenName)
		familyNames = append(familyNames, userAccount.FamilyName)
		zoneInfos = append(zoneInfos, userAccount.ZoneInfo)
		hasLoggedIns = append(hasLoggedIns, userAccount.HasLoggedIn)
	}
	arguments := args{
		"ids":            pq.Array(ids),
		"common_names":   pq.Array(commonNames),
		"locales":        pq.Array(locales),
		"emails":         pq.Array(emails),
		"given_names":    pq.Array(givenNames),
		"family_names":   pq.Array(familyNames),
		"zone_infos":     pq.Array(zoneInfos),
		"has_logged_ins": pq.Array(hasLoggedIns),
	}
	err := namedSelect(ctx, np, &users, sqlqueries.UserAccount.BulkUpdate, arguments)
	if err != nil {
		return nil, err
	}

	return users, nil
}
