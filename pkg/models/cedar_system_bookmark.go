package models

import (
	"time"
)

// CedarSystemBookmark represents a cedar system that a user has bookmarked in the system repository
type CedarSystemBookmark struct {
	EUAUserID     string     `json:"euaUserId" db:"eua_user_id"`
	CedarSystemID string     `json:"cedarSystemId" db:"cedar_system_id"`
	CreatedAt     *time.Time `db:"created_at"`
}

// BookmarkRequest is used to retrieve a CEDAR system bookmark from the DB. It does not contain `CreatedAt` like the above
type BookmarkRequest struct {
	CedarSystemID string `db:"cedar_system_id"`
	EuaUserID     string `db:"eua_user_id"`
}
