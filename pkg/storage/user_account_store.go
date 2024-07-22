package storage

import (
	"context"
	_ "embed"

	"github.com/google/uuid"
	"github.com/lib/pq"

	"github.com/cms-enterprise/easi-app/pkg/authentication"
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
func (s *Store) UserAccountGetByUsername(username string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := s.db.PrepareNamed(sqlqueries.UserAccount.GetByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"username": username,
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

// UserAccountGetByID gets a User account from the database by its internal id.
func (s *Store) UserAccountGetByID(np sqlutils.NamedPreparer, id uuid.UUID) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	err = stmt.Get(user, arg)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountsByIDs gets user accounts by user ID
func (s *Store) UserAccountsByIDs(ctx context.Context, userIDs []uuid.UUID) ([]*authentication.UserAccount, error) {
	var accounts []*authentication.UserAccount
	return accounts, namedSelect(ctx, s, &accounts, sqlqueries.UserAccount.GetByIDs, args{
		"user_ids": pq.Array(userIDs),
	})
}

// UserAccountCreate creates a new user account for a given username
func (s *Store) UserAccountCreate(np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.Create)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(user, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountUpdateByUserName updates an existing user account for a given username
func (s *Store) UserAccountUpdateByUserName(np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (
	*authentication.UserAccount,
	error,
) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.UpdateByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(user, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}
