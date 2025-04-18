package sqlqueries

import _ "embed"

// getByUser holds the SQL query to get non-archived system intakes by EUA
//
//go:embed SQL/system_intake/get_by_user.sql
var getByUser string

// getWhereGRBReviewIsHalfwayThrough holds the SQL query to get system intakes where the GRB review is halfway through
//
//go:embed SQL/system_intake/get_where_grb_voting_halfway_through.sql
var getWhereGRBReviewIsHalfwayThrough string

var SystemIntake = systemIntakeScripts{
	GetByUser:                         getByUser,
	GetWhereGRBReviewIsHalfwayThrough: getWhereGRBReviewIsHalfwayThrough,
}

type systemIntakeScripts struct {
	GetByUser                         string
	GetWhereGRBReviewIsHalfwayThrough string
}
