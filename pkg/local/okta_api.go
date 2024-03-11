package local

import (
	"context"
	"errors"
	"strings"

	"go.uber.org/zap"

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/apperrors"
	"github.com/cmsgov/easi-app/pkg/models"
)

// client is a mock client for pkg/oktaapi
type client struct{}

// NewOktaAPIClient returns an Okta API client that returns mock data
func NewOktaAPIClient() *client {
	return &client{}
}

// getMockUserData returns a slice of *models.UserInfo that represents a response from the Okta server.
// Most of the data here is generated randomly, though some of it was curated specifically for the purpose of making tests pass.
func getMockUserData() []*models.UserInfo {
	return []*models.UserInfo{
		{
			DisplayName: "Adeline Aarons",
			Email:       "adeline.aarons@local.fake",
			Username:    "ABCD",
			FirstName:   "Adeline",
			LastName:    "Aarons",
		},
		{
			DisplayName: "Terry Thompson",
			Email:       "terry.thompson@local.fake",
			Username:    "TEST",
			FirstName:   "Terry",
			LastName:    "Thompson",
		},
		{
			DisplayName: "Ally Anderson",
			Email:       "ally.anderson@local.fake",
			Username:    "A11Y",
			FirstName:   "Ally",
			LastName:    "Anderson",
		},
		{
			DisplayName: "Gary Gordon",
			Email:       "gary.gordon@local.fake",
			Username:    "GRTB",
			FirstName:   "Gary",
			LastName:    "Gordon",
		},
		{
			DisplayName: "Charlie Campbell",
			Email:       "charlie.campbell@local.fake",
			Username:    "CMSU",
			FirstName:   "Charlie",
			LastName:    "Campbell",
		},
		{
			DisplayName: "Audrey Abrams",
			Email:       "audrey.abrams@local.fake",
			Username:    "ADMI",
			FirstName:   "Audrey",
			LastName:    "Abrams",
		},
		{
			DisplayName: "Aaron Adams",
			Email:       "aaron.adams@local.fake",
			Username:    "ADMN",
			FirstName:   "Aaron",
			LastName:    "Adams",
		},
		{
			DisplayName: "User One",
			Email:       "user.one@local.fake",
			Username:    "USR1",
			FirstName:   "User",
			LastName:    "One",
		},
		{
			DisplayName: "User Two",
			Email:       "user.two@local.fake",
			Username:    "USR2",
			FirstName:   "User",
			LastName:    "Two",
		},
		{
			DisplayName: "User Three",
			Email:       "user.three@local.fake",
			Username:    "USR3",
			FirstName:   "User",
			LastName:    "Three",
		},
		{
			DisplayName: "User Four",
			Email:       "user.four@local.fake",
			Username:    "USR4",
			FirstName:   "User",
			LastName:    "Four",
		},
		{
			DisplayName: "User Five",
			Email:       "user.five@local.fake",
			Username:    "USR5",
			FirstName:   "User",
			LastName:    "Five",
		},
		{
			DisplayName: "Jerry Seinfeld",
			Email:       "jerry.seinfeld@local.fake",
			Username:    "SF13",
			FirstName:   "Jerry",
			LastName:    "Seinfeld",
		},
		{
			DisplayName: "Cosmo Kramer",
			Email:       "cosmo.kramer@local.fake",
			Username:    "KR14",
			FirstName:   "Cosmo",
			LastName:    "Kramer",
		},
		{
			DisplayName: "Kennedy Kuhic",
			Email:       "kennedy.kuhic@local.fake",
			Username:    "KVB3",
			FirstName:   "Kennedy",
			LastName:    "Kuhic",
		},
		{
			DisplayName: "Theo Crooks",
			Email:       "theo.crooks@local.fake",
			Username:    "CJRW",
			FirstName:   "Theo",
			LastName:    "Crooks",
		},
		{
			DisplayName: "Delphia Green",
			Email:       "delphia.green@local.fake",
			Username:    "GBRG",
			FirstName:   "Delphia",
			LastName:    "Green",
		},
		{
			DisplayName: "Leatha Gorczany",
			Email:       "leatha.gorczany@local.fake",
			Username:    "GP87",
			FirstName:   "Leatha",
			LastName:    "Gorczany",
		},
		{
			DisplayName: "Catherine Rice",
			Email:       "catherine.rice@local.fake",
			Username:    "RH4V",
			FirstName:   "Catherine",
			LastName:    "Rice",
		},
		{
			DisplayName: "Litzy Emard",
			Email:       "litzy.emard@local.fake",
			Username:    "ER3Z",
			FirstName:   "Litzy",
			LastName:    "Emard",
		},
		{
			DisplayName: "Lauriane Stoltenberg",
			Email:       "lauriane.stoltenberg@local.fake",
			Username:    "S3W0",
			FirstName:   "Lauriane",
			LastName:    "Stoltenberg",
		},
		{
			DisplayName: "Zechariah Wyman",
			Email:       "zechariah.wyman@local.fake",
			Username:    "W1I4",
			FirstName:   "Zechariah",
			LastName:    "Wyman",
		},
		{
			DisplayName: "Savanna Hyatt",
			Email:       "savanna.hyatt@local.fake",
			Username:    "HCNK",
			FirstName:   "Savanna",
			LastName:    "Hyatt",
		},
		{
			DisplayName: "Dawn Jaskolski",
			Email:       "dawn.jaskolski@local.fake",
			Username:    "JG1B",
			FirstName:   "Dawn",
			LastName:    "Jaskolski",
		},
		{
			DisplayName: "Anabelle Jerde",
			Email:       "anabelle.jerde@local.fake",
			Username:    "JTTC",
			FirstName:   "Anabelle",
			LastName:    "Jerde",
		},
		{
			DisplayName: "Hilbert Gislason",
			Email:       "hilbert.gislason@local.fake",
			Username:    "G4A7",
			FirstName:   "Hilbert",
			LastName:    "Gislason",
		},
		{
			DisplayName: "Rudolph Pagac",
			Email:       "rudolph.pagac@local.fake",
			Username:    "POJG",
			FirstName:   "Rudolph",
			LastName:    "Pagac",
		},
		{
			DisplayName: "Avis Anderson",
			Email:       "avis.anderson@local.fake",
			Username:    "ATSI",
			FirstName:   "Avis",
			LastName:    "Anderson",
		},
		{
			DisplayName: "Annetta Lockman",
			Email:       "annetta.lockman@local.fake",
			Username:    "LW40",
			FirstName:   "Annetta",
			LastName:    "Lockman",
		},
		{
			DisplayName: "Elva Ruecker",
			Email:       "elva.ruecker@local.fake",
			Username:    "RP20",
			FirstName:   "Elva",
			LastName:    "Ruecker",
		},
		{
			DisplayName: "Waylon Tromp",
			Email:       "waylon.tromp@local.fake",
			Username:    "TWAW",
			FirstName:   "Waylon",
			LastName:    "Tromp",
		},
		{
			DisplayName: "Doyle Heller",
			Email:       "doyle.heller@local.fake",
			Username:    "HIV3",
			FirstName:   "Doyle",
			LastName:    "Heller",
		},
		{
			DisplayName: "Hallie O'Hara",
			Email:       "hallie.ohara@local.fake",
			Username:    "OQYV",
			FirstName:   "Hallie",
			LastName:    "Hara",
		},
		{
			DisplayName: "Laverne Roberts",
			Email:       "laverne.roberts@local.fake",
			Username:    "R0EI",
			FirstName:   "Laverne",
			LastName:    "Roberts",
		},
		{
			DisplayName: "Alexander Stark",
			Email:       "alexander.stark@local.fake",
			Username:    "SKZO",
			FirstName:   "Alexander",
			LastName:    "Stark",
		},
		{
			DisplayName: "Caden Schmeler",
			Email:       "caden.schmeler@local.fake",
			Username:    "SPJW",
			FirstName:   "Caden",
			LastName:    "Schmeler",
		},
		{
			DisplayName: "Nat Krajcik",
			Email:       "nat.krajcik@local.fake",
			Username:    "K0AM",
			FirstName:   "Nat",
			LastName:    "Krajcik",
		},
		{
			DisplayName: "Palma Towne",
			Email:       "palma.towne@local.fake",
			Username:    "TX4A",
			FirstName:   "Palma",
			LastName:    "Towne",
		},
		{
			DisplayName: "Aurelie Morar",
			Email:       "aurelie.morar@local.fake",
			Username:    "MN3Q",
			FirstName:   "Aurelie",
			LastName:    "Morar",
		},
		{
			DisplayName: "Hellen Grimes",
			Email:       "hellen.grimes@local.fake",
			Username:    "GFRY",
			FirstName:   "Hellen",
			LastName:    "Grimes",
		},
		{
			DisplayName: "Kenna Gerhold",
			Email:       "kenna.gerhold@local.fake",
			Username:    "GZP4",
			FirstName:   "Kenna",
			LastName:    "Gerhold",
		},
		{
			DisplayName: "Rolando Weber",
			Email:       "rolando.weber@local.fake",
			Username:    "WNZ3",
			FirstName:   "Rolando",
			LastName:    "Weber",
		},
		{
			DisplayName: "Lance Konopelski",
			Email:       "lance.konopelski@local.fake",
			Username:    "K0LR",
			FirstName:   "Lance",
			LastName:    "Konopelski",
		},
		{
			DisplayName: "Otilia Abbott",
			Email:       "otilia.abbott@local.fake",
			Username:    "AX0Q",
			FirstName:   "Otilia",
			LastName:    "Abbott",
		},
		{
			DisplayName: "Marjory Doyle",
			Email:       "marjory.doyle@local.fake",
			Username:    "D7R3",
			FirstName:   "Marjory",
			LastName:    "Doyle",
		},
		{
			DisplayName: "Yasmine Dare",
			Email:       "yasmine.dare@local.fake",
			Username:    "D2AC",
			FirstName:   "Yasmine",
			LastName:    "Dare",
		},
		{
			DisplayName: "Kayla Zulauf",
			Email:       "kayla.zulauf@local.fake",
			Username:    "ZOCN",
			FirstName:   "Kayla",
			LastName:    "Zulauf",
		},
		{
			DisplayName: "Lucinda Hansen",
			Email:       "lucinda.hansen@local.fake",
			Username:    "H2KQ",
			FirstName:   "Lucinda",
			LastName:    "Hansen",
		},
		{
			DisplayName: "Alyce Haag",
			Email:       "alyce.haag@local.fake",
			Username:    "HBGM",
			FirstName:   "Alyce",
			LastName:    "Haag",
		},
		{
			DisplayName: "Deonte Kassulke",
			Email:       "deonte.kassulke@local.fake",
			Username:    "KDYZ",
			FirstName:   "Deonte",
			LastName:    "Kassulke",
		},
		{
			DisplayName: "Mckayla Fritsch",
			Email:       "mckayla.fritsch@local.fake",
			Username:    "FAUI",
			FirstName:   "Mckayla",
			LastName:    "Fritsch",
		},
		{
			DisplayName: "Brooks Johnson",
			Email:       "brooks.johnson@local.fake",
			Username:    "J3C8",
			FirstName:   "Brooks",
			LastName:    "Johnson",
		},
		{
			DisplayName: "Bernhard Koss",
			Email:       "bernhard.koss@local.fake",
			Username:    "K9W1",
			FirstName:   "Bernhard",
			LastName:    "Koss",
		},
		{
			DisplayName: "Gust Murray",
			Email:       "gust.murray@local.fake",
			Username:    "MR92",
			FirstName:   "Gust",
			LastName:    "Murray",
		},
		{
			DisplayName: "Eldred Hammes",
			Email:       "eldred.hammes@local.fake",
			Username:    "HY0W",
			FirstName:   "Eldred",
			LastName:    "Hammes",
		},
		{
			DisplayName: "Adrianna Gottlieb",
			Email:       "adrianna.gottlieb@local.fake",
			Username:    "GT98",
			FirstName:   "Adrianna",
			LastName:    "Gottlieb",
		},
		{
			DisplayName: "Earnest Torp",
			Email:       "earnest.torp@local.fake",
			Username:    "TD4Z",
			FirstName:   "Earnest",
			LastName:    "Torp",
		},
		{
			DisplayName: "Cecelia Hahn",
			Email:       "cecelia.hahn@local.fake",
			Username:    "HGDS",
			FirstName:   "Cecelia",
			LastName:    "Hahn",
		},
		{
			DisplayName: "Desmond Nolan",
			Email:       "desmond.nolan@local.fake",
			Username:    "N60U",
			FirstName:   "Desmond",
			LastName:    "Nolan",
		},
		{
			DisplayName: "Karianne Hickle",
			Email:       "karianne.hickle@local.fake",
			Username:    "HYG2",
			FirstName:   "Karianne",
			LastName:    "Hickle",
		},
		{
			DisplayName: "Isobel Koelpin",
			Email:       "isobel.koelpin@local.fake",
			Username:    "KT77",
			FirstName:   "Isobel",
			LastName:    "Koelpin",
		},
		{
			DisplayName: "Isidro Swaniawski",
			Email:       "isidro.swaniawski@local.fake",
			Username:    "SM7H",
			FirstName:   "Isidro",
			LastName:    "Swaniawski",
		},
		{
			DisplayName: "EndToEnd One",
			Email:       "endtoend.one@local.fake",
			Username:    "E2E1",
			FirstName:   "EndToEnd",
			LastName:    "One",
		},
		{
			DisplayName: "EndToEnd Two",
			Email:       "endtoend.two@local.fake",
			Username:    "E2E2",
			FirstName:   "EndToEnd",
			LastName:    "Two",
		},
	}
}

// FetchUserInfo fetches a user's personal details
func (c *client) FetchUserInfo(ctx context.Context, euaID string) (*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
	if euaID == "" {
		return nil, &apperrors.ValidationError{
			Err:     errors.New("invalid EUA ID"),
			Model:   euaID,
			ModelID: euaID,
		}
	}
	logger.Info("Mock FetchUserInfo from Okta", zap.String("euaID", euaID))
	for _, mockUser := range getMockUserData() {
		if mockUser.Username == euaID {
			return mockUser, nil
		}
	}
	return nil, errors.New("failed to fetch user from Okta API")
}

// FetchUserInfos fetches multiple users' personal details
func (c *client) FetchUserInfos(ctx context.Context, euaIDs []string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
	logger.Info("Mock FetchUserInfos from Okta", zap.Strings("euaIDs", euaIDs))

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
func (c *client) SearchCommonNameContains(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
	logger.Info("Mock SearchCommonNameContains from Okta")

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
