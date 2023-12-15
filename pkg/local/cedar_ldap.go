package local

import (
	"context"
	"errors"
	"strings"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"

	ldapmodels "github.com/cmsgov/easi-app/pkg/cedar/cedarldap/gen/models"
)

// NewCedarLdapClient returns a fake Cedar LDAP client
func NewCedarLdapClient(logger *zap.Logger) CedarLdapClient {
	return CedarLdapClient{logger: logger}
}

// CedarLdapClient mocks the CEDAR LDAP client for local/test use
type CedarLdapClient struct {
	logger *zap.Logger
}

// getMockUserData returns a slice of *models.UserInfo that represents a response from the CEDAR LDAP server.
// Most of the data here is generated randomly, though some of it was curated specifically for the purpose of making tests pass.
func getMockUserData() []*models.UserInfo {
	return []*models.UserInfo{ // TODO: EASI-3341 implement First Name and Last Name fields
		{
			DisplayName: "Adeline Aarons",
			Email:       "adeline.aarons@local.fake",
			Username:    "ABCD",
		},
		{
			DisplayName: "Terry Thompson",
			Email:       "terry.thompson@local.fake",
			Username:    "TEST",
		},
		{
			DisplayName: "Ally Anderson",
			Email:       "ally.anderson@local.fake",
			Username:    "A11Y",
		},
		{
			DisplayName: "Gary Gordon",
			Email:       "gary.gordon@local.fake",
			Username:    "GRTB",
		},
		{
			DisplayName: "Charlie Campbell",
			Email:       "charlie.campbell@local.fake",
			Username:    "CMSU",
		},
		{
			DisplayName: "Audrey Abrams",
			Email:       "audrey.abrams@local.fake",
			Username:    "ADMI",
		},
		{
			DisplayName: "Aaron Adams",
			Email:       "aaron.adams@local.fake",
			Username:    "ADMN",
		},
		{
			DisplayName: "User One",
			Email:       "user.one@local.fake",
			Username:    "USR1",
		},
		{
			DisplayName: "User Two",
			Email:       "user.two@local.fake",
			Username:    "USR2",
		},
		{
			DisplayName: "User Three",
			Email:       "user.three@local.fake",
			Username:    "USR3",
		},
		{
			DisplayName: "User Four",
			Email:       "user.four@local.fake",
			Username:    "USR4",
		},
		{
			DisplayName: "User Five",
			Email:       "user.five@local.fake",
			Username:    "USR5",
		},
		{
			DisplayName: "Jerry Seinfeld",
			Email:       "jerry.seinfeld@local.fake",
			Username:    "SF13",
		},
		{
			DisplayName: "Cosmo Kramer",
			Email:       "cosmo.kramer@local.fake",
			Username:    "KR14",
		},
		{
			DisplayName: "Kennedy Kuhic",
			Email:       "kennedy.kuhic@local.fake",
			Username:    "KVB3",
		},
		{
			DisplayName: "Theo Crooks",
			Email:       "theo.crooks@local.fake",
			Username:    "CJRW",
		},
		{
			DisplayName: "Delphia Green",
			Email:       "delphia.green@local.fake",
			Username:    "GBRG",
		},
		{
			DisplayName: "Leatha Gorczany",
			Email:       "leatha.gorczany@local.fake",
			Username:    "GP87",
		},
		{
			DisplayName: "Catherine Rice",
			Email:       "catherine.rice@local.fake",
			Username:    "RH4V",
		},
		{
			DisplayName: "Litzy Emard",
			Email:       "litzy.emard@local.fake",
			Username:    "ER3Z",
		},
		{
			DisplayName: "Lauriane Stoltenberg",
			Email:       "lauriane.stoltenberg@local.fake",
			Username:    "S3W0",
		},
		{
			DisplayName: "Zechariah Wyman",
			Email:       "zechariah.wyman@local.fake",
			Username:    "W1I4",
		},
		{
			DisplayName: "Savanna Hyatt",
			Email:       "savanna.hyatt@local.fake",
			Username:    "HCNK",
		},
		{
			DisplayName: "Dawn Jaskolski",
			Email:       "dawn.jaskolski@local.fake",
			Username:    "JG1B",
		},
		{
			DisplayName: "Anabelle Jerde",
			Email:       "anabelle.jerde@local.fake",
			Username:    "JTTC",
		},
		{
			DisplayName: "Hilbert Gislason",
			Email:       "hilbert.gislason@local.fake",
			Username:    "G4A7",
		},
		{
			DisplayName: "Rudolph Pagac",
			Email:       "rudolph.pagac@local.fake",
			Username:    "POJG",
		},
		{
			DisplayName: "Avis Anderson",
			Email:       "avis.anderson@local.fake",
			Username:    "ATSI",
		},
		{
			DisplayName: "Annetta Lockman",
			Email:       "annetta.lockman@local.fake",
			Username:    "LW40",
		},
		{
			DisplayName: "Elva Ruecker",
			Email:       "elva.ruecker@local.fake",
			Username:    "RP20",
		},
		{
			DisplayName: "Waylon Tromp",
			Email:       "waylon.tromp@local.fake",
			Username:    "TWAW",
		},
		{
			DisplayName: "Doyle Heller",
			Email:       "doyle.heller@local.fake",
			Username:    "HIV3",
		},
		{
			DisplayName: "Hallie O'Hara",
			Email:       "hallie.ohara@local.fake",
			Username:    "OQYV",
		},
		{
			DisplayName: "Laverne Roberts",
			Email:       "laverne.roberts@local.fake",
			Username:    "R0EI",
		},
		{
			DisplayName: "Alexander Stark",
			Email:       "alexander.stark@local.fake",
			Username:    "SKZO",
		},
		{
			DisplayName: "Caden Schmeler",
			Email:       "caden.schmeler@local.fake",
			Username:    "SPJW",
		},
		{
			DisplayName: "Nat Krajcik",
			Email:       "nat.krajcik@local.fake",
			Username:    "K0AM",
		},
		{
			DisplayName: "Palma Towne",
			Email:       "palma.towne@local.fake",
			Username:    "TX4A",
		},
		{
			DisplayName: "Aurelie Morar",
			Email:       "aurelie.morar@local.fake",
			Username:    "MN3Q",
		},
		{
			DisplayName: "Hellen Grimes",
			Email:       "hellen.grimes@local.fake",
			Username:    "GFRY",
		},
		{
			DisplayName: "Kenna Gerhold",
			Email:       "kenna.gerhold@local.fake",
			Username:    "GZP4",
		},
		{
			DisplayName: "Rolando Weber",
			Email:       "rolando.weber@local.fake",
			Username:    "WNZ3",
		},
		{
			DisplayName: "Lance Konopelski",
			Email:       "lance.konopelski@local.fake",
			Username:    "K0LR",
		},
		{
			DisplayName: "Otilia Abbott",
			Email:       "otilia.abbott@local.fake",
			Username:    "AX0Q",
		},
		{
			DisplayName: "Marjory Doyle",
			Email:       "marjory.doyle@local.fake",
			Username:    "D7R3",
		},
		{
			DisplayName: "Yasmine Dare",
			Email:       "yasmine.dare@local.fake",
			Username:    "D2AC",
		},
		{
			DisplayName: "Kayla Zulauf",
			Email:       "kayla.zulauf@local.fake",
			Username:    "ZOCN",
		},
		{
			DisplayName: "Lucinda Hansen",
			Email:       "lucinda.hansen@local.fake",
			Username:    "H2KQ",
		},
		{
			DisplayName: "Alyce Haag",
			Email:       "alyce.haag@local.fake",
			Username:    "HBGM",
		},
		{
			DisplayName: "Deonte Kassulke",
			Email:       "deonte.kassulke@local.fake",
			Username:    "KDYZ",
		},
		{
			DisplayName: "Mckayla Fritsch",
			Email:       "mckayla.fritsch@local.fake",
			Username:    "FAUI",
		},
		{
			DisplayName: "Brooks Johnson",
			Email:       "brooks.johnson@local.fake",
			Username:    "J3C8",
		},
		{
			DisplayName: "Bernhard Koss",
			Email:       "bernhard.koss@local.fake",
			Username:    "K9W1",
		},
		{
			DisplayName: "Gust Murray",
			Email:       "gust.murray@local.fake",
			Username:    "MR92",
		},
		{
			DisplayName: "Eldred Hammes",
			Email:       "eldred.hammes@local.fake",
			Username:    "HY0W",
		},
		{
			DisplayName: "Adrianna Gottlieb",
			Email:       "adrianna.gottlieb@local.fake",
			Username:    "GT98",
		},
		{
			DisplayName: "Earnest Torp",
			Email:       "earnest.torp@local.fake",
			Username:    "TD4Z",
		},
		{
			DisplayName: "Cecelia Hahn",
			Email:       "cecelia.hahn@local.fake",
			Username:    "HGDS",
		},
		{
			DisplayName: "Desmond Nolan",
			Email:       "desmond.nolan@local.fake",
			Username:    "N60U",
		},
		{
			DisplayName: "Karianne Hickle",
			Email:       "karianne.hickle@local.fake",
			Username:    "HYG2",
		},
		{
			DisplayName: "Isobel Koelpin",
			Email:       "isobel.koelpin@local.fake",
			Username:    "KT77",
		},
		{
			DisplayName: "Isidro Swaniawski",
			Email:       "isidro.swaniawski@local.fake",
			Username:    "SM7H",
		},
		{
			DisplayName: "EndToEnd One",
			Email:       "endtoend.one@local.fake",
			Username:    "E2E1",
		},
		{
			DisplayName: "EndToEnd Two",
			Email:       "endtoend.two@local.fake",
			Username:    "E2E2",
		},
	}
}

// FetchUserInfo fetches a user's personal details
func (c CedarLdapClient) FetchUserInfo(_ context.Context, euaID string) (*models.UserInfo, error) {
	if euaID == "" {
		return nil, &apperrors.ValidationError{
			Err:     errors.New("invalid EUA ID"),
			Model:   euaID,
			ModelID: euaID,
		}
	}
	c.logger.Info("Mock FetchUserInfo from LDAP", zap.String("euaID", euaID))
	for _, mockUser := range getMockUserData() {
		if mockUser.Username == euaID {
			return mockUser, nil
		}
	}
	return nil, &apperrors.ExternalAPIError{
		Err:       errors.New("failed to return person from CEDAR LDAP"),
		ModelID:   euaID,
		Model:     ldapmodels.Person{},
		Operation: apperrors.Fetch,
		Source:    "CEDAR LDAP",
	}
}

// FetchUserInfos fetches multiple users' personal details
func (c CedarLdapClient) FetchUserInfos(_ context.Context, euaIDs []string) ([]*models.UserInfo, error) {
	c.logger.Info("Mock FetchUserInfos from LDAP", zap.Strings("euaIDs", euaIDs))

	userInfos := make([]*models.UserInfo, len(euaIDs))
	for i, euaID := range euaIDs {
		for _, mockUser := range getMockUserData() {
			if mockUser.Username == euaID {
				userInfos[i] = mockUser
			}
		}
	}

	return userInfos, nil
}

// SearchCommonNameContains fetches a user's personal details by their common name
func (c CedarLdapClient) SearchCommonNameContains(_ context.Context, commonName string) ([]*models.UserInfo, error) {
	c.logger.Info("Mock SearchCommonNameContains from LDAP")

	mockUserData := getMockUserData()
	searchResults := []*models.UserInfo{}

	for _, element := range mockUserData {
		lowerName := strings.ToLower(element.DisplayName)
		lowerSearch := strings.ToLower(commonName)
		if strings.Contains(lowerName, lowerSearch) {
			searchResults = append(searchResults, element)
		}
	}

	return searchResults, nil
}
