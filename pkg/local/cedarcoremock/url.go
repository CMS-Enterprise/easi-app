package cedarcoremock

import (
	"github.com/guregu/null/zero"

	"github.com/cms-enterprise/easi-app/pkg/models"
)

var mockURLs = []*models.CedarURL{
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50001}"),
		Address:                        zero.StringFrom("notrealaddress.cms.gov"),
		IsBehindWebApplicationFirewall: true,
		IsAPIEndpoint:                  true,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("Development"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50002}"),
		Address:                        zero.StringFrom("banana.impl.cms.gov"),
		IsBehindWebApplicationFirewall: true,
		IsAPIEndpoint:                  true,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("Implementation"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50003}"),
		Address:                        zero.StringFrom("someservice.cms.gov"),
		IsBehindWebApplicationFirewall: false,
		IsAPIEndpoint:                  true,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("Production"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50004}"),
		Address:                        zero.StringFrom("meatloaf.test.cms.gov"),
		IsBehindWebApplicationFirewall: true,
		IsAPIEndpoint:                  false,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("Testing"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50005}"),
		Address:                        zero.StringFrom("test 1"),
		IsBehindWebApplicationFirewall: false,
		IsAPIEndpoint:                  false,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("COOP DR"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50006}"),
		Address:                        zero.StringFrom("mango.cms.gov"),
		IsBehindWebApplicationFirewall: false,
		IsAPIEndpoint:                  true,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("Production"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50007}"),
		Address:                        zero.StringFrom("disasterrecovery.cms.gov"),
		IsBehindWebApplicationFirewall: true,
		IsAPIEndpoint:                  false,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("COOP DR"),
	},
	{
		ID:                             zero.StringFrom("{1234A56B-123A-12ab-1A2B-A123B4C50008}"),
		Address:                        zero.StringFrom("awesome.dev.cms.gov"),
		IsBehindWebApplicationFirewall: false,
		IsAPIEndpoint:                  true,
		IsVersionCodeRepository:        false,
		URLHostingEnv:                  zero.StringFrom("Development"),
	},
}

func GetURLs() []*models.CedarURL {
	return mockURLs
}
