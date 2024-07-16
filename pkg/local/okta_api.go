package local

import (
	"context"
	"slices"
	"strings"

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
		Email:       "adeline.aarons@local.fake",
		Username:    "ABCD",
		FirstName:   "Adeline",
		LastName:    "Aarons",
	},
	"TEST": {
		DisplayName: "Terry Thompson",
		Email:       "terry.thompson@local.fake",
		Username:    "TEST",
		FirstName:   "Terry",
		LastName:    "Thompson",
	},
	"A11Y": {
		DisplayName: "Ally Anderson",
		Email:       "ally.anderson@local.fake",
		Username:    "A11Y",
		FirstName:   "Ally",
		LastName:    "Anderson",
	},
	"GRTB": {
		DisplayName: "Gary Gordon",
		Email:       "gary.gordon@local.fake",
		Username:    "GRTB",
		FirstName:   "Gary",
		LastName:    "Gordon",
	},
	"CMSU": {
		DisplayName: "Charlie Campbell",
		Email:       "charlie.campbell@local.fake",
		Username:    "CMSU",
		FirstName:   "Charlie",
		LastName:    "Campbell",
	},
	"ADMI": {
		DisplayName: "Audrey Abrams",
		Email:       "audrey.abrams@local.fake",
		Username:    "ADMI",
		FirstName:   "Audrey",
		LastName:    "Abrams",
	},
	"ADMN": {
		DisplayName: "Aaron Adams",
		Email:       "aaron.adams@local.fake",
		Username:    "ADMN",
		FirstName:   "Aaron",
		LastName:    "Adams",
	},
	"USR1": {
		DisplayName: "User One",
		Email:       "user.one@local.fake",
		Username:    "USR1",
		FirstName:   "User",
		LastName:    "One",
	},
	"USR2": {
		DisplayName: "User Two",
		Email:       "user.two@local.fake",
		Username:    "USR2",
		FirstName:   "User",
		LastName:    "Two",
	},
	"USR3": {
		DisplayName: "User Three",
		Email:       "user.three@local.fake",
		Username:    "USR3",
		FirstName:   "User",
		LastName:    "Three",
	},
	"USR4": {
		DisplayName: "User Four",
		Email:       "user.four@local.fake",
		Username:    "USR4",
		FirstName:   "User",
		LastName:    "Four",
	},
	"USR5": {
		DisplayName: "User Five",
		Email:       "user.five@local.fake",
		Username:    "USR5",
		FirstName:   "User",
		LastName:    "Five",
	},
	"SF13": {
		DisplayName: "Jerry Seinfeld",
		Email:       "jerry.seinfeld@local.fake",
		Username:    "SF13",
		FirstName:   "Jerry",
		LastName:    "Seinfeld",
	},
	"KR14": {
		DisplayName: "Cosmo Kramer",
		Email:       "cosmo.kramer@local.fake",
		Username:    "KR14",
		FirstName:   "Cosmo",
		LastName:    "Kramer",
	},
	"KVB3": {
		DisplayName: "Kennedy Kuhic",
		Email:       "kennedy.kuhic@local.fake",
		Username:    "KVB3",
		FirstName:   "Kennedy",
		LastName:    "Kuhic",
	},
	"CJRW": {
		DisplayName: "Theo Crooks",
		Email:       "theo.crooks@local.fake",
		Username:    "CJRW",
		FirstName:   "Theo",
		LastName:    "Crooks",
	},
	"GBRG": {
		DisplayName: "Delphia Green",
		Email:       "delphia.green@local.fake",
		Username:    "GBRG",
		FirstName:   "Delphia",
		LastName:    "Green",
	},
	"GP87": {
		DisplayName: "Leatha Gorczany",
		Email:       "leatha.gorczany@local.fake",
		Username:    "GP87",
		FirstName:   "Leatha",
		LastName:    "Gorczany",
	},
	"RH4V": {
		DisplayName: "Catherine Rice",
		Email:       "catherine.rice@local.fake",
		Username:    "RH4V",
		FirstName:   "Catherine",
		LastName:    "Rice",
	},
	"ER3Z": {
		DisplayName: "Litzy Emard",
		Email:       "litzy.emard@local.fake",
		Username:    "ER3Z",
		FirstName:   "Litzy",
		LastName:    "Emard",
	},
	"S3W0": {
		DisplayName: "Lauriane Stoltenberg",
		Email:       "lauriane.stoltenberg@local.fake",
		Username:    "S3W0",
		FirstName:   "Lauriane",
		LastName:    "Stoltenberg",
	},
	"W1I4": {
		DisplayName: "Zechariah Wyman",
		Email:       "zechariah.wyman@local.fake",
		Username:    "W1I4",
		FirstName:   "Zechariah",
		LastName:    "Wyman",
	},
	"HCNK": {
		DisplayName: "Savanna Hyatt",
		Email:       "savanna.hyatt@local.fake",
		Username:    "HCNK",
		FirstName:   "Savanna",
		LastName:    "Hyatt",
	},
	"JG1B": {
		DisplayName: "Dawn Jaskolski",
		Email:       "dawn.jaskolski@local.fake",
		Username:    "JG1B",
		FirstName:   "Dawn",
		LastName:    "Jaskolski",
	},
	"JTTC": {
		DisplayName: "Anabelle Jerde",
		Email:       "anabelle.jerde@local.fake",
		Username:    "JTTC",
		FirstName:   "Anabelle",
		LastName:    "Jerde",
	},
	"G4A7": {
		DisplayName: "Hilbert Gislason",
		Email:       "hilbert.gislason@local.fake",
		Username:    "G4A7",
		FirstName:   "Hilbert",
		LastName:    "Gislason",
	},
	"POJG": {
		DisplayName: "Rudolph Pagac",
		Email:       "rudolph.pagac@local.fake",
		Username:    "POJG",
		FirstName:   "Rudolph",
		LastName:    "Pagac",
	},
	"ATSI": {
		DisplayName: "Avis Anderson",
		Email:       "avis.anderson@local.fake",
		Username:    "ATSI",
		FirstName:   "Avis",
		LastName:    "Anderson",
	},
	"LW40": {
		DisplayName: "Annetta Lockman",
		Email:       "annetta.lockman@local.fake",
		Username:    "LW40",
		FirstName:   "Annetta",
		LastName:    "Lockman",
	},
	"RP20": {
		DisplayName: "Elva Ruecker",
		Email:       "elva.ruecker@local.fake",
		Username:    "RP20",
		FirstName:   "Elva",
		LastName:    "Ruecker",
	},
	"TWAW": {
		DisplayName: "Waylon Tromp",
		Email:       "waylon.tromp@local.fake",
		Username:    "TWAW",
		FirstName:   "Waylon",
		LastName:    "Tromp",
	},
	"HIV3": {
		DisplayName: "Doyle Heller",
		Email:       "doyle.heller@local.fake",
		Username:    "HIV3",
		FirstName:   "Doyle",
		LastName:    "Heller",
	},
	"OQYV": {
		DisplayName: "Hallie O'Hara",
		Email:       "hallie.ohara@local.fake",
		Username:    "OQYV",
		FirstName:   "Hallie",
		LastName:    "Hara",
	},
	"R0EI": {
		DisplayName: "Laverne Roberts",
		Email:       "laverne.roberts@local.fake",
		Username:    "R0EI",
		FirstName:   "Laverne",
		LastName:    "Roberts",
	},
	"SKZO": {
		DisplayName: "Alexander Stark",
		Email:       "alexander.stark@local.fake",
		Username:    "SKZO",
		FirstName:   "Alexander",
		LastName:    "Stark",
	},
	"SPJW": {
		DisplayName: "Caden Schmeler",
		Email:       "caden.schmeler@local.fake",
		Username:    "SPJW",
		FirstName:   "Caden",
		LastName:    "Schmeler",
	},
	"K0AM": {
		DisplayName: "Nat Krajcik",
		Email:       "nat.krajcik@local.fake",
		Username:    "K0AM",
		FirstName:   "Nat",
		LastName:    "Krajcik",
	},
	"TX4A": {
		DisplayName: "Palma Towne",
		Email:       "palma.towne@local.fake",
		Username:    "TX4A",
		FirstName:   "Palma",
		LastName:    "Towne",
	},
	"MN3Q": {
		DisplayName: "Aurelie Morar",
		Email:       "aurelie.morar@local.fake",
		Username:    "MN3Q",
		FirstName:   "Aurelie",
		LastName:    "Morar",
	},
	"GFRY": {
		DisplayName: "Hellen Grimes",
		Email:       "hellen.grimes@local.fake",
		Username:    "GFRY",
		FirstName:   "Hellen",
		LastName:    "Grimes",
	},
	"GZP4": {
		DisplayName: "Kenna Gerhold",
		Email:       "kenna.gerhold@local.fake",
		Username:    "GZP4",
		FirstName:   "Kenna",
		LastName:    "Gerhold",
	},
	"WNZ3": {
		DisplayName: "Rolando Weber",
		Email:       "rolando.weber@local.fake",
		Username:    "WNZ3",
		FirstName:   "Rolando",
		LastName:    "Weber",
	},
	"K0LR": {
		DisplayName: "Lance Konopelski",
		Email:       "lance.konopelski@local.fake",
		Username:    "K0LR",
		FirstName:   "Lance",
		LastName:    "Konopelski",
	},
	"AX0Q": {
		DisplayName: "Otilia Abbott",
		Email:       "otilia.abbott@local.fake",
		Username:    "AX0Q",
		FirstName:   "Otilia",
		LastName:    "Abbott",
	},
	"D7R3": {
		DisplayName: "Marjory Doyle",
		Email:       "marjory.doyle@local.fake",
		Username:    "D7R3",
		FirstName:   "Marjory",
		LastName:    "Doyle",
	},
	"D2AC": {
		DisplayName: "Yasmine Dare",
		Email:       "yasmine.dare@local.fake",
		Username:    "D2AC",
		FirstName:   "Yasmine",
		LastName:    "Dare",
	},
	"ZOCN": {
		DisplayName: "Kayla Zulauf",
		Email:       "kayla.zulauf@local.fake",
		Username:    "ZOCN",
		FirstName:   "Kayla",
		LastName:    "Zulauf",
	},
	"H2KQ": {
		DisplayName: "Lucinda Hansen",
		Email:       "lucinda.hansen@local.fake",
		Username:    "H2KQ",
		FirstName:   "Lucinda",
		LastName:    "Hansen",
	},
	"HBGM": {
		DisplayName: "Alyce Haag",
		Email:       "alyce.haag@local.fake",
		Username:    "HBGM",
		FirstName:   "Alyce",
		LastName:    "Haag",
	},
	"KDYZ": {
		DisplayName: "Deonte Kassulke",
		Email:       "deonte.kassulke@local.fake",
		Username:    "KDYZ",
		FirstName:   "Deonte",
		LastName:    "Kassulke",
	},
	"FAUI": {
		DisplayName: "Mckayla Fritsch",
		Email:       "mckayla.fritsch@local.fake",
		Username:    "FAUI",
		FirstName:   "Mckayla",
		LastName:    "Fritsch",
	},
	"J3C8": {
		DisplayName: "Brooks Johnson",
		Email:       "brooks.johnson@local.fake",
		Username:    "J3C8",
		FirstName:   "Brooks",
		LastName:    "Johnson",
	},
	"K9W1": {
		DisplayName: "Bernhard Koss",
		Email:       "bernhard.koss@local.fake",
		Username:    "K9W1",
		FirstName:   "Bernhard",
		LastName:    "Koss",
	},
	"MR92": {
		DisplayName: "Gust Murray",
		Email:       "gust.murray@local.fake",
		Username:    "MR92",
		FirstName:   "Gust",
		LastName:    "Murray",
	},
	"HY0W": {
		DisplayName: "Eldred Hammes",
		Email:       "eldred.hammes@local.fake",
		Username:    "HY0W",
		FirstName:   "Eldred",
		LastName:    "Hammes",
	},
	"GT98": {
		DisplayName: "Adrianna Gottlieb",
		Email:       "adrianna.gottlieb@local.fake",
		Username:    "GT98",
		FirstName:   "Adrianna",
		LastName:    "Gottlieb",
	},
	"TD4Z": {
		DisplayName: "Earnest Torp",
		Email:       "earnest.torp@local.fake",
		Username:    "TD4Z",
		FirstName:   "Earnest",
		LastName:    "Torp",
	},
	"HGDS": {
		DisplayName: "Cecelia Hahn",
		Email:       "cecelia.hahn@local.fake",
		Username:    "HGDS",
		FirstName:   "Cecelia",
		LastName:    "Hahn",
	},
	"N60U": {
		DisplayName: "Desmond Nolan",
		Email:       "desmond.nolan@local.fake",
		Username:    "N60U",
		FirstName:   "Desmond",
		LastName:    "Nolan",
	},
	"HYG2": {
		DisplayName: "Karianne Hickle",
		Email:       "karianne.hickle@local.fake",
		Username:    "HYG2",
		FirstName:   "Karianne",
		LastName:    "Hickle",
	},
	"KT77": {
		DisplayName: "Isobel Koelpin",
		Email:       "isobel.koelpin@local.fake",
		Username:    "KT77",
		FirstName:   "Isobel",
		LastName:    "Koelpin",
	},
	"SM7H": {
		DisplayName: "Isidro Swaniawski",
		Email:       "isidro.swaniawski@local.fake",
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
		Email:       "betty.alpha@local.fake",
		Username:    "BTAL",
		FirstName:   "Betty",
		LastName:    "Alpha",
	},
	"BTMN": {
		DisplayName: "Bruce Wayne",
		Email:       "bruce.wayne@gotham.city",
		Username:    "BTMN",
		FirstName:   "Bruce",
		LastName:    "Wayne",
	},
	"JANE": {
		DisplayName: "Jane McModelteam",
		Email:       "jane.mcmodelteam@local.fake",
		Username:    "JANE",
		FirstName:   "Jane",
		LastName:    "McModelteam",
	},
	"L4RZ": {
		DisplayName: "Laura Rodriguez",
		Email:       "laura.rodriguez@local.fake",
		Username:    "L4RZ",
		FirstName:   "Laura",
		LastName:    "Rodriguez",
	},
	"BRGJ": {
		DisplayName: "Bryce Greenfield-Jones",
		Email:       "bryce.greenfield-Jones@local.fake",
		Username:    "BRGJ",
		FirstName:   "Bryce",
		LastName:    "Greenfield-Jones",
	},
	"AL2I": {
		DisplayName: "Alison Li",
		Email:       "alison.li@local.fake",
		Username:    "AL2I",
		FirstName:   "Alison",
		LastName:    "Li",
	},
	"N1M1": {
		DisplayName: "Nick Miller",
		Email:       "nick.miller@local.fake",
		Username:    "N1M1",
		FirstName:   "Nick",
		LastName:    "Miller",
	},
	"K8SY": {
		DisplayName: "Karen Stanley",
		Email:       "karen.stanley@local.fake",
		Username:    "K8SY",
		FirstName:   "Karen",
		LastName:    "Stanley",
	},
	"B6TP": {
		DisplayName: "Bill Topper",
		Email:       "bill.topper@local.fake",
		Username:    "B6TP",
		FirstName:   "Bill",
		LastName:    "Topper",
	},
	"HU18": {
		DisplayName: "Heather Ulrich",
		Email:       "heather.ulrich@local.fake",
		Username:    "HU18",
		FirstName:   "Heather",
		LastName:    "Ulrich",
	},
	"KWR1": {
		DisplayName: "Kenneth Wright",
		Email:       "kenneth.wright@local.fake",
		Username:    "KWR1",
		FirstName:   "Kenneth",
		LastName:    "Wright",
	},
	"ZANE": {
		DisplayName: "Robert Zane",
		Email:       "robert.zane@local.fake",
		Username:    "ZANE",
		FirstName:   "Robert",
		LastName:    "Zane",
	},
	"ZBRA": {
		DisplayName: "Robert Zebra",
		Email:       "robert.zebra@local.fake",
		Username:    "ZBRA",
		FirstName:   "Robert",
		LastName:    "Zebra",
	},
	"RING": {
		DisplayName: "Frodo Baggins",
		Email:       "frodo.baggins@local.fake",
		Username:    "RING",
		FirstName:   "Frodo",
		LastName:    "Baggins",
	},
	"RANG": {
		DisplayName: "Bilbo Baggins",
		Email:       "bilbo.baggins@local.fake",
		Username:    "RANG",
		FirstName:   "Bilbo",
		LastName:    "Baggins",
	},
	"RUNG": {
		DisplayName: "Samwise Gamgee",
		Email:       "samwise.gamgee@local.fake",
		Username:    "RUNG",
		FirstName:   "Samwise",
		LastName:    "Gamgee",
	},
	"SPDR": {
		DisplayName: "Peter Parker",
		Email:       "peter.parker@local.fake",
		Username:    "SPDR",
		FirstName:   "Peter",
		LastName:    "Parker",
	},
	"PSTM": {
		DisplayName: "Post Man",
		Email:       "post.man@local.fake",
		Username:    "PSTM",
		FirstName:   "Post",
		LastName:    "Man",
	},
}

// GetMockUsernames returns a slice of usernames
func GetMockUsernames() []string {
	var usernames []string
	for key := range mockUserDictionary {
		usernames = append(usernames, key)
	}
	slices.Sort(usernames)
	return usernames
}

// FetchUserInfo fetches a user's personal details
func (c *client) FetchUserInfo(ctx context.Context, username string) (*models.UserInfo, error) {
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
