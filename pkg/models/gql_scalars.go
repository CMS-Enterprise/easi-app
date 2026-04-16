package models

import (
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/guregu/null"
	"github.com/guregu/null/zero"
)

func MarshalZeroString(zs zero.String) graphql.Marshaler {
	if !zs.Valid {
		return graphql.Null
	}
	return graphql.MarshalString(zs.String)
}

func UnmarshalZeroString(v any) (zero.String, error) {
	if v == nil {
		return zero.NewString("", false), nil
	}
	s, err := graphql.UnmarshalString(v)
	return zero.NewString(s, err == nil), err
}

func MarshalNullString(ns null.String) graphql.Marshaler {
	if !ns.Valid {
		return graphql.Null
	}
	return graphql.MarshalString(ns.String)
}

func UnmarshalNullString(v any) (null.String, error) {
	if v == nil {
		return null.NewString("", false), nil
	}
	s, err := graphql.UnmarshalString(v)
	return null.NewString(s, err == nil), err
}

func MarshalZeroTime(zt zero.Time) graphql.Marshaler {
	if !zt.Valid {
		return graphql.Null
	}
	return graphql.MarshalTime(zt.Time)
}

func UnmarshalZeroTime(v any) (zero.Time, error) {
	if v == nil {
		return zero.NewTime(time.Time{}, false), nil
	}
	t, err := graphql.UnmarshalTime(v)
	return zero.NewTime(t, err == nil), err
}

func MarshalZeroBool(zb zero.Bool) graphql.Marshaler {
	if !zb.Valid {
		return graphql.Null
	}
	return graphql.MarshalBoolean(zb.Bool)
}

func UnmarshalZeroBool(v any) (zero.Bool, error) {
	if v == nil {
		return zero.NewBool(false, false), nil
	}
	b, err := graphql.UnmarshalBoolean(v)
	return zero.NewBool(b, err == nil), err
}

func MarshalZeroInt(zi zero.Int) graphql.Marshaler {
	if !zi.Valid {
		return graphql.Null
	}
	return graphql.MarshalInt64(zi.Int64)
}

func UnmarshalZeroInt(v any) (zero.Int, error) {
	if v == nil {
		return zero.NewInt(0, false), nil
	}
	i, err := graphql.UnmarshalInt64(v)
	return zero.NewInt(i, err == nil), err
}

func MarshalNullInt(ni null.Int) graphql.Marshaler {
	if !ni.Valid {
		return graphql.Null
	}
	return graphql.MarshalInt64(ni.Int64)
}

func UnmarshalNullInt(v any) (null.Int, error) {
	if v == nil {
		return null.NewInt(0, false), nil
	}
	i, err := graphql.UnmarshalInt64(v)
	return null.NewInt(i, err == nil), err
}

func MarshalNullBool(nb null.Bool) graphql.Marshaler {
	if !nb.Valid {
		return graphql.Null
	}
	return graphql.MarshalBoolean(nb.Bool)
}

func UnmarshalNullBool(v any) (null.Bool, error) {
	if v == nil {
		return null.NewBool(false, false), nil
	}
	b, err := graphql.UnmarshalBoolean(v)
	return null.NewBool(b, err == nil), err
}

func MarshalZeroFloat(zf zero.Float) graphql.Marshaler {
	if !zf.Valid {
		return graphql.Null
	}
	return graphql.MarshalFloat(zf.Float64)
}

func UnmarshalZeroFloat(v any) (zero.Float, error) {
	if v == nil {
		return zero.NewFloat(0, false), nil
	}
	f, err := graphql.UnmarshalFloat(v)
	return zero.NewFloat(f, err == nil), err
}

func MarshalNullFloat(zf null.Float) graphql.Marshaler {
	if !zf.Valid {
		return graphql.Null
	}
	return graphql.MarshalFloat(zf.Float64)
}

func UnmarshalNullFloat(v any) (null.Float, error) {
	if v == nil {
		return null.NewFloat(0, false), nil
	}
	f, err := graphql.UnmarshalFloat(v)
	return null.NewFloat(f, err == nil), err
}
