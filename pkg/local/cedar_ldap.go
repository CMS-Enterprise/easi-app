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
	return []*models.UserInfo{
		{
			CommonName: "Adeline Aarons",
			Email:      "adeline.aarons@local.fake",
			EuaUserID:  "ABCD",
		},
		{
			CommonName: "Terry Thompson",
			Email:      "terry.thompson@local.fake",
			EuaUserID:  "TEST",
		},
		{
			CommonName: "Ally Anderson",
			Email:      "ally.anderson@local.fake",
			EuaUserID:  "A11Y",
		},
		{
			CommonName: "Gary Gordon",
			Email:      "gary.gordon@local.fake",
			EuaUserID:  "GRTB",
		},
		{
			CommonName: "Charlie Campbell",
			Email:      "charlie.campbell@local.fake",
			EuaUserID:  "CMSU",
		},
		{
			CommonName: "Audrey Abrams",
			Email:      "audrey.abrams@local.fake",
			EuaUserID:  "ADMI",
		},
		{
			CommonName: "Aaron Adams",
			Email:      "aaron.adams@local.fake",
			EuaUserID:  "ADMN",
		},
		{
			CommonName: "User One",
			Email:      "user.one@local.fake",
			EuaUserID:  "USR1",
		},
		{
			CommonName: "User Two",
			Email:      "user.two@local.fake",
			EuaUserID:  "USR2",
		},
		{
			CommonName: "User Three",
			Email:      "user.three@local.fake",
			EuaUserID:  "USR3",
		},
		{
			CommonName: "User Four",
			Email:      "user.four@local.fake",
			EuaUserID:  "USR4",
		},
		{
			CommonName: "User Five",
			Email:      "user.five@local.fake",
			EuaUserID:  "USR5",
		},
		{
			CommonName: "Jerry Seinfeld",
			Email:      "jerry.seinfeld@local.fake",
			EuaUserID:  "SF13",
		},
		{
			CommonName: "Cosmo Kramer",
			Email:      "cosmo.kramer@local.fake",
			EuaUserID:  "KR14",
		},
		{
			CommonName: "Kennedy Kuhic",
			Email:      "kennedy.kuhic@local.fake",
			EuaUserID:  "KVB3",
		},
		{
			CommonName: "Theo Crooks",
			Email:      "theo.crooks@local.fake",
			EuaUserID:  "CJRW",
		},
		{
			CommonName: "Delphia Green",
			Email:      "delphia.green@local.fake",
			EuaUserID:  "GBRG",
		},
		{
			CommonName: "Leatha Gorczany",
			Email:      "leatha.gorczany@local.fake",
			EuaUserID:  "GP87",
		},
		{
			CommonName: "Catherine Rice",
			Email:      "catherine.rice@local.fake",
			EuaUserID:  "RH4V",
		},
		{
			CommonName: "Litzy Emard",
			Email:      "litzy.emard@local.fake",
			EuaUserID:  "ER3Z",
		},
		{
			CommonName: "Lauriane Stoltenberg",
			Email:      "lauriane.stoltenberg@local.fake",
			EuaUserID:  "S3W0",
		},
		{
			CommonName: "Zechariah Wyman",
			Email:      "zechariah.wyman@local.fake",
			EuaUserID:  "W1I4",
		},
		{
			CommonName: "Savanna Hyatt",
			Email:      "savanna.hyatt@local.fake",
			EuaUserID:  "HCNK",
		},
		{
			CommonName: "Dawn Jaskolski",
			Email:      "dawn.jaskolski@local.fake",
			EuaUserID:  "JG1B",
		},
		{
			CommonName: "Anabelle Jerde",
			Email:      "anabelle.jerde@local.fake",
			EuaUserID:  "JTTC",
		},
		{
			CommonName: "Hilbert Gislason",
			Email:      "hilbert.gislason@local.fake",
			EuaUserID:  "G4A7",
		},
		{
			CommonName: "Rudolph Pagac",
			Email:      "rudolph.pagac@local.fake",
			EuaUserID:  "POJG",
		},
		{
			CommonName: "Avis Anderson",
			Email:      "avis.anderson@local.fake",
			EuaUserID:  "ATSI",
		},
		{
			CommonName: "Annetta Lockman",
			Email:      "annetta.lockman@local.fake",
			EuaUserID:  "LW40",
		},
		{
			CommonName: "Elva Ruecker",
			Email:      "elva.ruecker@local.fake",
			EuaUserID:  "RP20",
		},
		{
			CommonName: "Waylon Tromp",
			Email:      "waylon.tromp@local.fake",
			EuaUserID:  "TWAW",
		},
		{
			CommonName: "Doyle Heller",
			Email:      "doyle.heller@local.fake",
			EuaUserID:  "HIV3",
		},
		{
			CommonName: "Hallie O'Hara",
			Email:      "hallie.ohara@local.fake",
			EuaUserID:  "OQYV",
		},
		{
			CommonName: "Laverne Roberts",
			Email:      "laverne.roberts@local.fake",
			EuaUserID:  "R0EI",
		},
		{
			CommonName: "Alexander Stark",
			Email:      "alexander.stark@local.fake",
			EuaUserID:  "SKZO",
		},
		{
			CommonName: "Caden Schmeler",
			Email:      "caden.schmeler@local.fake",
			EuaUserID:  "SPJW",
		},
		{
			CommonName: "Nat Krajcik",
			Email:      "nat.krajcik@local.fake",
			EuaUserID:  "K0AM",
		},
		{
			CommonName: "Palma Towne",
			Email:      "palma.towne@local.fake",
			EuaUserID:  "TX4A",
		},
		{
			CommonName: "Aurelie Morar",
			Email:      "aurelie.morar@local.fake",
			EuaUserID:  "MN3Q",
		},
		{
			CommonName: "Hellen Grimes",
			Email:      "hellen.grimes@local.fake",
			EuaUserID:  "GFRY",
		},
		{
			CommonName: "Kenna Gerhold",
			Email:      "kenna.gerhold@local.fake",
			EuaUserID:  "GZP4",
		},
		{
			CommonName: "Rolando Weber",
			Email:      "rolando.weber@local.fake",
			EuaUserID:  "WNZ3",
		},
		{
			CommonName: "Lance Konopelski",
			Email:      "lance.konopelski@local.fake",
			EuaUserID:  "K0LR",
		},
		{
			CommonName: "Otilia Abbott",
			Email:      "otilia.abbott@local.fake",
			EuaUserID:  "AX0Q",
		},
		{
			CommonName: "Marjory Doyle",
			Email:      "marjory.doyle@local.fake",
			EuaUserID:  "D7R3",
		},
		{
			CommonName: "Yasmine Dare",
			Email:      "yasmine.dare@local.fake",
			EuaUserID:  "D2AC",
		},
		{
			CommonName: "Kayla Zulauf",
			Email:      "kayla.zulauf@local.fake",
			EuaUserID:  "ZOCN",
		},
		{
			CommonName: "Lucinda Hansen",
			Email:      "lucinda.hansen@local.fake",
			EuaUserID:  "H2KQ",
		},
		{
			CommonName: "Alyce Haag",
			Email:      "alyce.haag@local.fake",
			EuaUserID:  "HBGM",
		},
		{
			CommonName: "Deonte Kassulke",
			Email:      "deonte.kassulke@local.fake",
			EuaUserID:  "KDYZ",
		},
		{
			CommonName: "Mckayla Fritsch",
			Email:      "mckayla.fritsch@local.fake",
			EuaUserID:  "FAUI",
		},
		{
			CommonName: "Brooks Johnson",
			Email:      "brooks.johnson@local.fake",
			EuaUserID:  "J3C8",
		},
		{
			CommonName: "Bernhard Koss",
			Email:      "bernhard.koss@local.fake",
			EuaUserID:  "K9W1",
		},
		{
			CommonName: "Gust Murray",
			Email:      "gust.murray@local.fake",
			EuaUserID:  "MR92",
		},
		{
			CommonName: "Eldred Hammes",
			Email:      "eldred.hammes@local.fake",
			EuaUserID:  "HY0W",
		},
		{
			CommonName: "Adrianna Gottlieb",
			Email:      "adrianna.gottlieb@local.fake",
			EuaUserID:  "GT98",
		},
		{
			CommonName: "Earnest Torp",
			Email:      "earnest.torp@local.fake",
			EuaUserID:  "TD4Z",
		},
		{
			CommonName: "Cecelia Hahn",
			Email:      "cecelia.hahn@local.fake",
			EuaUserID:  "HGDS",
		},
		{
			CommonName: "Desmond Nolan",
			Email:      "desmond.nolan@local.fake",
			EuaUserID:  "N60U",
		},
		{
			CommonName: "Karianne Hickle",
			Email:      "karianne.hickle@local.fake",
			EuaUserID:  "HYG2",
		},
		{
			CommonName: "Isobel Koelpin",
			Email:      "isobel.koelpin@local.fake",
			EuaUserID:  "KT77",
		},
		{
			CommonName: "Isidro Swaniawski",
			Email:      "isidro.swaniawski@local.fake",
			EuaUserID:  "SM7H",
		},
		{
			CommonName: "EndToEnd One",
			Email:      "endtoend.one@local.fake",
			EuaUserID:  "E2E1",
		},
		{
			CommonName: "EndToEnd Two",
			Email:      "endtoend.two@local.fake",
			EuaUserID:  "E2E2",
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
		if mockUser.EuaUserID == euaID {
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
			if mockUser.EuaUserID == euaID {
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
		lowerName := strings.ToLower(element.CommonName)
		lowerSearch := strings.ToLower(commonName)
		if strings.Contains(lowerName, lowerSearch) {
			searchResults = append(searchResults, element)
		}
	}

	return searchResults, nil
}
