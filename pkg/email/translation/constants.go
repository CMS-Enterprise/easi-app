package translation

// String map for TRB request response type
var trbResponseType = map[string]string{
	"NEED_HELP":     "I’m having a problem with my system",
	"BRAINSTORM":    "I have an idea and would like feedback",
	"FOLLOWUP":      "Follow-up or cadence consult",
	"FORMAL_REVIEW": "Formal design review",
	"OTHER":         "Other",
}

// GetTRBResponseType returns the humanized name for a TRB response type
func GetTRBResponseType(responseType string) string {
	humanizedName := trbResponseType[responseType]
	return humanizedName
}

// *******
// NOTE - when updating this map, please update the corresponding list in `src/constants/enums/cmsDivisionsAndOffices.ts`
// *******
// String map for System Intake/TRB component acronym
var componentAcronym = map[string]string{
	"Center for Clinical Standards and Quality":                "CCSQ",
	"Center for Consumer Information and Insurance Oversight":  "CCIIO",
	"Center for Medicare":                                      "CM",
	"Center for Medicaid and CHIP Services":                    "CMCS",
	"Center for Medicare and Medicaid Innovation":              "CMMI",
	"Center for Program Integrity":                             "CPI",
	"CMS Wide":                                                 "CMS",
	"Emergency Preparedness and Response Operations":           "EPRO",
	"Federal Coordinated Health Care Office":                   "FCHCO",
	"Office of Acquisition and Grants Management":              "OAGM",
	"Office of Healthcare Experience and Interoperability":     "OHEI",
	"Office of Communications":                                 "OC",
	"Office of Enterprise Data and Analytics":                  "OEDA",
	"Office of Equal Opportunity and Civil Rights":             "OEOCR",
	"Office of Financial Management":                           "OFM",
	"Office of Human Capital":                                  "OHC",
	"Office of Information Technology":                         "OIT",
	"Office of Legislation":                                    "OL",
	"Office of Minority Health":                                "OMH",
	"Office of Program Operations and Local Engagement":        "OPOLE",
	"Office of Security, Facilities, and Logistics Operations": "OSFLO",
	"Office of Strategic Operations and Regulatory Affairs":    "OSORA",
	"Office of Strategy, Performance, and Results":             "OSPR",
	"Office of the Actuary":                                    "OA",
	"Offices of Hearings and Inquiries":                        "OHI",
	"Other":                                                    "",
}

// GetComponentAcronym returns the acronym for component names
func GetComponentAcronym(component string) string {
	acronym := componentAcronym[component]
	return acronym
}
