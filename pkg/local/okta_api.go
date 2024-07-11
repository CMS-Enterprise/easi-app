package local

import (
	"context"
	"strings"

	"go.uber.org/zap"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/models"
)

// client is a mock client for pkg/oktaapi
type client struct{}

// NewOktaAPIClient returns an Okta API client that returns mock data
func NewOktaAPIClient() *client {
	return &client{}
}

// mockUserDictionary returns a map of *models.UserInfo that represents a response from the Okta server.
// Most of the data here is generated randomly, though some of it was curated specifically for the purpose of making tests pass.
var mockUserDictionary = map[string]*models.UserInfo{
	"ABCD": {
		DisplayName: "Adeline Aarons",
		Email:       "Adeline.Aarons@local.fake",
		Username:    "ABCD",
		FirstName:   "Adeline",
		LastName:    "Aarons",
	},
	"TEST": {
		DisplayName: "Terry Thompson",
		Email:       "Terry.Thompson@local.fake",
		Username:    "TEST",
		FirstName:   "Terry",
		LastName:    "Thompson",
	},
	"A11Y": {
		DisplayName: "Ally Anderson",
		Email:       "Ally.Anderson@local.fake",
		Username:    "A11Y",
		FirstName:   "Ally",
		LastName:    "Anderson",
	},
	"GRTB": {
		DisplayName: "Gary Gordon",
		Email:       "Gary.Gordon@local.fake",
		Username:    "GRTB",
		FirstName:   "Gary",
		LastName:    "Gordon",
	},
	"CMSU": {
		DisplayName: "Charlie Campbell",
		Email:       "Charlie.Campbell@local.fake",
		Username:    "CMSU",
		FirstName:   "Charlie",
		LastName:    "Campbell",
	},
	"ADMI": {
		DisplayName: "Audrey Abrams",
		Email:       "Audrey.Abrams@local.fake",
		Username:    "ADMI",
		FirstName:   "Audrey",
		LastName:    "Abrams",
	},
	"ADMN": {
		DisplayName: "Aaron Adams",
		Email:       "Aaron.Adams@local.fake",
		Username:    "ADMN",
		FirstName:   "Aaron",
		LastName:    "Adams",
	},
	"USR1": {
		DisplayName: "User One",
		Email:       "User.One@local.fake",
		Username:    "USR1",
		FirstName:   "User",
		LastName:    "One",
	},
	"USR2": {
		DisplayName: "User Two",
		Email:       "User.Two@local.fake",
		Username:    "USR2",
		FirstName:   "User",
		LastName:    "Two",
	},
	"USR3": {
		DisplayName: "User Three",
		Email:       "User.Three@local.fake",
		Username:    "USR3",
		FirstName:   "User",
		LastName:    "Three",
	},
	"USR4": {
		DisplayName: "User Four",
		Email:       "User.Four@local.fake",
		Username:    "USR4",
		FirstName:   "User",
		LastName:    "Four",
	},
	"USR5": {
		DisplayName: "User Five",
		Email:       "User.Five@local.fake",
		Username:    "USR5",
		FirstName:   "User",
		LastName:    "Five",
	},
	"SF13": {
		DisplayName: "Jerry Seinfeld",
		Email:       "Jerry.Seinfeld@local.fake",
		Username:    "SF13",
		FirstName:   "Jerry",
		LastName:    "Seinfeld",
	},
	"KR14": {
		DisplayName: "Cosmo Kramer",
		Email:       "Cosmo.Kramer@local.fake",
		Username:    "KR14",
		FirstName:   "Cosmo",
		LastName:    "Kramer",
	},
	"KVB3": {
		DisplayName: "Kennedy Kuhic",
		Email:       "Kennedy.Kuhic@local.fake",
		Username:    "KVB3",
		FirstName:   "Kennedy",
		LastName:    "Kuhic",
	},
	"CJRW": {
		DisplayName: "Theo Crooks",
		Email:       "Theo.Crooks@local.fake",
		Username:    "CJRW",
		FirstName:   "Theo",
		LastName:    "Crooks",
	},
	"GBRG": {
		DisplayName: "Delphia Green",
		Email:       "Delphia.Green@local.fake",
		Username:    "GBRG",
		FirstName:   "Delphia",
		LastName:    "Green",
	},
	"GP87": {
		DisplayName: "Leatha Gorczany",
		Email:       "Leatha.Gorczany@local.fake",
		Username:    "GP87",
		FirstName:   "Leatha",
		LastName:    "Gorczany",
	},
	"RH4V": {
		DisplayName: "Catherine Rice",
		Email:       "Catherine.Rice@local.fake",
		Username:    "RH4V",
		FirstName:   "Catherine",
		LastName:    "Rice",
	},
	"ER3Z": {
		DisplayName: "Litzy Emard",
		Email:       "Litzy.Emard@local.fake",
		Username:    "ER3Z",
		FirstName:   "Litzy",
		LastName:    "Emard",
	},
	"S3W0": {
		DisplayName: "Lauriane Stoltenberg",
		Email:       "Lauriane.Stoltenberg@local.fake",
		Username:    "S3W0",
		FirstName:   "Lauriane",
		LastName:    "Stoltenberg",
	},
	"W1I4": {
		DisplayName: "Zechariah Wyman",
		Email:       "Zechariah.Wyman@local.fake",
		Username:    "W1I4",
		FirstName:   "Zechariah",
		LastName:    "Wyman",
	},
	"HCNK": {
		DisplayName: "Savanna Hyatt",
		Email:       "Savanna.Hyatt@local.fake",
		Username:    "HCNK",
		FirstName:   "Savanna",
		LastName:    "Hyatt",
	},
	"JG1B": {
		DisplayName: "Dawn Jaskolski",
		Email:       "Dawn.Jaskolski@local.fake",
		Username:    "JG1B",
		FirstName:   "Dawn",
		LastName:    "Jaskolski",
	},
	"JTTC": {
		DisplayName: "Anabelle Jerde",
		Email:       "Anabelle.Jerde@local.fake",
		Username:    "JTTC",
		FirstName:   "Anabelle",
		LastName:    "Jerde",
	},
	"G4A7": {
		DisplayName: "Hilbert Gislason",
		Email:       "Hilbert.Gislason@local.fake",
		Username:    "G4A7",
		FirstName:   "Hilbert",
		LastName:    "Gislason",
	},
	"POJG": {
		DisplayName: "Rudolph Pagac",
		Email:       "Rudolph.Pagac@local.fake",
		Username:    "POJG",
		FirstName:   "Rudolph",
		LastName:    "Pagac",
	},
	"ATSI": {
		DisplayName: "Avis Anderson",
		Email:       "Avis.Anderson@local.fake",
		Username:    "ATSI",
		FirstName:   "Avis",
		LastName:    "Anderson",
	},
	"LW40": {
		DisplayName: "Annetta Lockman",
		Email:       "Annetta.Lockman@local.fake",
		Username:    "LW40",
		FirstName:   "Annetta",
		LastName:    "Lockman",
	},
	"RP20": {
		DisplayName: "Elva Ruecker",
		Email:       "Elva.Ruecker@local.fake",
		Username:    "RP20",
		FirstName:   "Elva",
		LastName:    "Ruecker",
	},
	"TWAW": {
		DisplayName: "Waylon Tromp",
		Email:       "Waylon.Tromp@local.fake",
		Username:    "TWAW",
		FirstName:   "Waylon",
		LastName:    "Tromp",
	},
	"HIV3": {
		DisplayName: "Doyle Heller",
		Email:       "Doyle.Heller@local.fake",
		Username:    "HIV3",
		FirstName:   "Doyle",
		LastName:    "Heller",
	},
	"OQYV": {
		DisplayName: "Hallie O'Hara",
		Email:       "Hallie.Ohara@local.fake",
		Username:    "OQYV",
		FirstName:   "Hallie",
		LastName:    "Hara",
	},
	"R0EI": {
		DisplayName: "Laverne Roberts",
		Email:       "Laverne.Roberts@local.fake",
		Username:    "R0EI",
		FirstName:   "Laverne",
		LastName:    "Roberts",
	},
	"SKZO": {
		DisplayName: "Alexander Stark",
		Email:       "Alexander.Stark@local.fake",
		Username:    "SKZO",
		FirstName:   "Alexander",
		LastName:    "Stark",
	},
	"SPJW": {
		DisplayName: "Caden Schmeler",
		Email:       "Caden.Schmeler@local.fake",
		Username:    "SPJW",
		FirstName:   "Caden",
		LastName:    "Schmeler",
	},
	"K0AM": {
		DisplayName: "Nat Krajcik",
		Email:       "Nat.Krajcik@local.fake",
		Username:    "K0AM",
		FirstName:   "Nat",
		LastName:    "Krajcik",
	},
	"TX4A": {
		DisplayName: "Palma Towne",
		Email:       "Palma.Towne@local.fake",
		Username:    "TX4A",
		FirstName:   "Palma",
		LastName:    "Towne",
	},
	"MN3Q": {
		DisplayName: "Aurelie Morar",
		Email:       "Aurelie.Morar@local.fake",
		Username:    "MN3Q",
		FirstName:   "Aurelie",
		LastName:    "Morar",
	},
	"GFRY": {
		DisplayName: "Hellen Grimes",
		Email:       "Hellen.Grimes@local.fake",
		Username:    "GFRY",
		FirstName:   "Hellen",
		LastName:    "Grimes",
	},
	"GZP4": {
		DisplayName: "Kenna Gerhold",
		Email:       "Kenna.Gerhold@local.fake",
		Username:    "GZP4",
		FirstName:   "Kenna",
		LastName:    "Gerhold",
	},
	"WNZ3": {
		DisplayName: "Rolando Weber",
		Email:       "Rolando.Weber@local.fake",
		Username:    "WNZ3",
		FirstName:   "Rolando",
		LastName:    "Weber",
	},
	"K0LR": {
		DisplayName: "Lance Konopelski",
		Email:       "Lance.Konopelski@local.fake",
		Username:    "K0LR",
		FirstName:   "Lance",
		LastName:    "Konopelski",
	},
	"AX0Q": {
		DisplayName: "Otilia Abbott",
		Email:       "Otilia.Abbott@local.fake",
		Username:    "AX0Q",
		FirstName:   "Otilia",
		LastName:    "Abbott",
	},
	"D7R3": {
		DisplayName: "Marjory Doyle",
		Email:       "Marjory.Doyle@local.fake",
		Username:    "D7R3",
		FirstName:   "Marjory",
		LastName:    "Doyle",
	},
	"D2AC": {
		DisplayName: "Yasmine Dare",
		Email:       "Yasmine.Dare@local.fake",
		Username:    "D2AC",
		FirstName:   "Yasmine",
		LastName:    "Dare",
	},
	"ZOCN": {
		DisplayName: "Kayla Zulauf",
		Email:       "Kayla.Zulauf@local.fake",
		Username:    "ZOCN",
		FirstName:   "Kayla",
		LastName:    "Zulauf",
	},
	"H2KQ": {
		DisplayName: "Lucinda Hansen",
		Email:       "Lucinda.Hansen@local.fake",
		Username:    "H2KQ",
		FirstName:   "Lucinda",
		LastName:    "Hansen",
	},
	"HBGM": {
		DisplayName: "Alyce Haag",
		Email:       "Alyce.Haag@local.fake",
		Username:    "HBGM",
		FirstName:   "Alyce",
		LastName:    "Haag",
	},
	"KDYZ": {
		DisplayName: "Deonte Kassulke",
		Email:       "Deonte.Kassulke@local.fake",
		Username:    "KDYZ",
		FirstName:   "Deonte",
		LastName:    "Kassulke",
	},
	"FAUI": {
		DisplayName: "Mckayla Fritsch",
		Email:       "Mckayla.Fritsch@local.fake",
		Username:    "FAUI",
		FirstName:   "Mckayla",
		LastName:    "Fritsch",
	},
	"J3C8": {
		DisplayName: "Brooks Johnson",
		Email:       "Brooks.Johnson@local.fake",
		Username:    "J3C8",
		FirstName:   "Brooks",
		LastName:    "Johnson",
	},
	"K9W1": {
		DisplayName: "Bernhard Koss",
		Email:       "Bernhard.Koss@local.fake",
		Username:    "K9W1",
		FirstName:   "Bernhard",
		LastName:    "Koss",
	},
	"MR92": {
		DisplayName: "Gust Murray",
		Email:       "Gust.Murray@local.fake",
		Username:    "MR92",
		FirstName:   "Gust",
		LastName:    "Murray",
	},
	"HY0W": {
		DisplayName: "Eldred Hammes",
		Email:       "Eldred.Hammes@local.fake",
		Username:    "HY0W",
		FirstName:   "Eldred",
		LastName:    "Hammes",
	},
	"GT98": {
		DisplayName: "Adrianna Gottlieb",
		Email:       "Adrianna.Gottlieb@local.fake",
		Username:    "GT98",
		FirstName:   "Adrianna",
		LastName:    "Gottlieb",
	},
	"TD4Z": {
		DisplayName: "Earnest Torp",
		Email:       "Earnest.Torp@local.fake",
		Username:    "TD4Z",
		FirstName:   "Earnest",
		LastName:    "Torp",
	},
	"HGDS": {
		DisplayName: "Cecelia Hahn",
		Email:       "Cecelia.Hahn@local.fake",
		Username:    "HGDS",
		FirstName:   "Cecelia",
		LastName:    "Hahn",
	},
	"N60U": {
		DisplayName: "Desmond Nolan",
		Email:       "Desmond.Nolan@local.fake",
		Username:    "N60U",
		FirstName:   "Desmond",
		LastName:    "Nolan",
	},
	"HYG2": {
		DisplayName: "Karianne Hickle",
		Email:       "Karianne.Hickle@local.fake",
		Username:    "HYG2",
		FirstName:   "Karianne",
		LastName:    "Hickle",
	},
	"KT77": {
		DisplayName: "Isobel Koelpin",
		Email:       "Isobel.Koelpin@local.fake",
		Username:    "KT77",
		FirstName:   "Isobel",
		LastName:    "Koelpin",
	},
	"SM7H": {
		DisplayName: "Isidro Swaniawski",
		Email:       "Isidro.Swaniawski@local.fake",
		Username:    "SM7H",
		FirstName:   "Isidro",
		LastName:    "Swaniawski",
	},
	"E2E1": {
		DisplayName: "EndToEnd One",
		Email:       "endtoend.one@local.fake",
		Username:    "E2E1",
		FirstName:   "EndToEnd",
		LastName:    "One",
	},
	"E2E2": {
		DisplayName: "EndToEnd Two",
		Email:       "endtoend.two@local.fake",
		Username:    "E2E2",
		FirstName:   "EndToEnd",
		LastName:    "Two",
	},
	"BTAL": {
		DisplayName: "Betty Alpha",
		Email:       "Betty.Alpha@local.fake",
		Username:    "BTAL",
		FirstName:   "Betty",
		LastName:    "Alpha",
	},
	"BTMN": {
		DisplayName: "Bruce Wayne",
		Email:       "Bruce.Wayne@gotham.city",
		Username:    "BTMN",
		FirstName:   "Bruce",
		LastName:    "Wayne",
	},
	"JANE": {
		DisplayName: "Jane McModelteam",
		Email:       "Jane.McModelteam@local.fake",
		Username:    "JANE",
		FirstName:   "Jane",
		LastName:    "McModelteam",
	},
	"L4RZ": {
		DisplayName: "Laura Rodriguez",
		Email:       "Laura.Rodriguez@local.fake",
		Username:    "L4RZ",
		FirstName:   "Laura",
		LastName:    "Rodriguez",
	},
	"BRGJ": {
		DisplayName: "Bryce Greenfield-Jones",
		Email:       "Bryce.Greenfield-Jones@local.fake",
		Username:    "BRGJ",
		FirstName:   "Bryce",
		LastName:    "Greenfield-Jones",
	},
	"AL2I": {
		DisplayName: "Alison Li",
		Email:       "Alison.Li@local.fake",
		Username:    "AL2I",
		FirstName:   "Alison",
		LastName:    "Li",
	},
	"N1M1": {
		DisplayName: "Nick Miller",
		Email:       "Nick.Miller@local.fake",
		Username:    "N1M1",
		FirstName:   "Nick",
		LastName:    "Miller",
	},
	"K8SY": {
		DisplayName: "Karen Stanley",
		Email:       "Karen.Stanley@local.fake",
		Username:    "K8SY",
		FirstName:   "Karen",
		LastName:    "Stanley",
	},
	"B6TP": {
		DisplayName: "Bill Topper",
		Email:       "Bill.Topper@local.fake",
		Username:    "B6TP",
		FirstName:   "Bill",
		LastName:    "Topper",
	},
	"HU18": {
		DisplayName: "Heather Ulrich",
		Email:       "Heather.Ulrich@local.fake",
		Username:    "HU18",
		FirstName:   "Heather",
		LastName:    "Ulrich",
	},
	"KWR1": {
		DisplayName: "Kenneth Wright",
		Email:       "Kenneth.Wright@local.fake",
		Username:    "KWR1",
		FirstName:   "Kenneth",
		LastName:    "Wright",
	},
	"ZANE": {
		DisplayName: "Robert Zane",
		Email:       "Robert.Zane@local.fake",
		Username:    "ZANE",
		FirstName:   "Robert",
		LastName:    "Zane",
	},
	"ZBRA": {
		DisplayName: "Robert Zebra",
		Email:       "Robert.Zebra@local.fake",
		Username:    "ZBRA",
		FirstName:   "Robert",
		LastName:    "Zebra",
	},
	"RING": {
		DisplayName: "Frodo Baggins",
		Email:       "Frodo.Baggins@local.fake",
		Username:    "RING",
		FirstName:   "Frodo",
		LastName:    "Baggins",
	},
	"RANG": {
		DisplayName: "Bilbo Baggins",
		Email:       "Bilbo.Baggins@local.fake",
		Username:    "RANG",
		FirstName:   "Bilbo",
		LastName:    "Baggins",
	},
	"RUNG": {
		DisplayName: "Samwise Gamgee",
		Email:       "Samwise.Gamgee@local.fake",
		Username:    "RUNG",
		FirstName:   "Samwise",
		LastName:    "Gamgee",
	},
	"SPDR": {
		DisplayName: "Peter Parker",
		Email:       "Peter.Parker@local.fake",
		Username:    "SPDR",
		FirstName:   "Peter",
		LastName:    "Parker",
	},
	"PSTM": {
		DisplayName: "Post Man",
		Email:       "Post.Man@local.fake",
		Username:    "PSTM",
		FirstName:   "Post",
		LastName:    "Man",
	},
}

func GetMockUserDataSlice() []*models.UserInfo {
	// Create a slice to hold the values
	userInfos := make([]*models.UserInfo, 0, len(mockUserDictionary))

	// Loop through the map and append the values to the slice
	for _, userInfo := range mockUserDictionary {
		userInfos = append(userInfos, userInfo)
	}
	return userInfos
}

// FetchUserInfo fetches a user's personal details
func (c *client) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
	logger.Info("Mock FetchUserInfo from Okta", zap.String("username", username))

	mockUser, mockUserExists := mockUserDictionary[username]
	if mockUserExists {
		return mockUser, nil
	}
	// Users not in dictionary can just have simulated information returned so we can allow any username combo
	return genericMockUserInfo(username), nil
}

func genericMockUserInfo(username string) *models.UserInfo {
	accountInfo := &models.UserInfo{
		DisplayName: username + " Doe",

		Email:     models.NewEmailAddress(username + "@local.cms.gov"),
		FirstName: username,
		LastName:  username,
		Username:  username,
	}
	return accountInfo

}

// FetchUserInfos fetches multiple users' personal details
func (c *client) FetchUserInfos(ctx context.Context, usernames []string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
	logger.Info("Mock FetchUserInfos from Okta", zap.Strings("usernames", usernames))

	userInfos := make([]*models.UserInfo, len(usernames))
	for i, username := range usernames {
		mockUser, err := c.FetchUserInfo(ctx, username)
		if err != nil {
			return nil, err
		}
		userInfos[i] = mockUser
	}

	return userInfos, nil
}

// SearchCommonNameContains fetches a user's personal details by their common name
func (c *client) SearchCommonNameContains(ctx context.Context, commonName string) ([]*models.UserInfo, error) {
	logger := appcontext.ZLogger(ctx)
	logger.Info("Mock SearchCommonNameContains from Okta")

	searchResults := []*models.UserInfo{}

	for _, element := range mockUserDictionary {
		lowerName := strings.ToLower(element.DisplayName)
		lowerSearch := strings.ToLower(commonName)
		if strings.Contains(lowerName, lowerSearch) {
			searchResults = append(searchResults, element)
		}
	}

	return searchResults, nil
}
