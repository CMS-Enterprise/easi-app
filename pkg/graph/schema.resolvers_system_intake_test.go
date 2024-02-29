package graph

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}

func (s *GraphQLTestSuite) TestCreateSystemIntakeMutation() {
	var resp struct {
		CreateSystemIntake struct {
			ID          string
			RequestType string
			Requester   struct {
				Name string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(
		`mutation {
			createSystemIntake(input: {
				requestType: NEW,
				requester: {
					name: "Test User"
				}
			}) {
				id
				requestType
				requester {
					name
				}
			}
		}`, &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest("TEST"))

	s.NotNil(resp.CreateSystemIntake.ID)
	s.Equal("Test User", resp.CreateSystemIntake.Requester.Name)
	s.Equal("NEW", resp.CreateSystemIntake.RequestType)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeQuery() {
	ctx := context.Background()
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:              null.StringFrom("TEST"),
		ProjectName:            null.StringFrom(projectName),
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom(businessOwner),
		BusinessOwnerComponent: null.StringFrom(businessOwnerComponent),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID            string
			RequestName   string
			RequestType   string
			BusinessOwner struct {
				Name      string
				Component string
			}
			BusinessOwnerComponent string
			BusinessNeed           *string
			BusinessCase           *string
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				requestName
				requestType
				businessOwner {
					name
					component
				}
				businessNeed
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.Equal(projectName, resp.SystemIntake.RequestName)
	s.Equal("NEW", resp.SystemIntake.RequestType)
	s.Equal(businessOwner, resp.SystemIntake.BusinessOwner.Name)
	s.Equal(businessOwnerComponent, resp.SystemIntake.BusinessOwner.Component)
	s.Nil(resp.SystemIntake.BusinessNeed)
	s.Nil(resp.SystemIntake.BusinessCase)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithNotesQuery() {
	ctx := context.Background()
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:              null.StringFrom("TEST"),
		ProjectName:            null.StringFrom(projectName),
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom(businessOwner),
		BusinessOwnerComponent: null.StringFrom(businessOwnerComponent),
	})
	s.NoError(intakeErr)

	note1, noteErr := s.store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "QQQQ",
		AuthorName:     null.StringFrom("Author Name Q"),
		Content:        models.HTMLPointer("a clever remark"),
		CreatedAt:      date(2021, 5, 2),
	})
	s.NoError(noteErr)

	note2, noteErr := s.store.CreateSystemIntakeNote(ctx, &models.SystemIntakeNote{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "WWWW",
		AuthorName:     null.StringFrom("Author Name W"),
		Content:        models.HTMLPointer("a cleverer remark"),
		CreatedAt:      date(2021, 5, 3),
	})
	s.NoError(noteErr)

	var resp struct {
		SystemIntake struct {
			ID    string
			Notes []struct {
				ID     string
				Author struct {
					Name string
					EUA  string
				}
				Content   string
				CreatedAt string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				notes {
					id
					createdAt
					content
					author {
						name
						eua
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest("WWWW"))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	s.Len(resp.SystemIntake.Notes, 2)

	respNote2 := resp.SystemIntake.Notes[0]
	s.Equal(note2.ID.String(), respNote2.ID)
	s.Equal("a cleverer remark", respNote2.Content)
	s.Equal("WWWW", respNote2.Author.EUA)
	s.Equal("Author Name W", respNote2.Author.Name)
	s.NotEmpty(respNote2.CreatedAt)

	respNote1 := resp.SystemIntake.Notes[1]
	s.Equal(note1.ID.String(), respNote1.ID)
	s.Equal("a clever remark", respNote1.Content)
	s.Equal("QQQQ", respNote1.Author.EUA)
	s.Equal("Author Name Q", respNote1.Author.Name)
	s.NotEmpty(respNote1.CreatedAt)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithContractMonthAndYearQuery() {
	ctx := context.Background()
	contracStartMonth := "10"
	contractStartYear := "2002"
	contractEndMonth := "08"
	contractEndYear := "2020"
	projectName := "My cool project"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:          null.StringFrom("TEST"),
		ProjectName:        null.StringFrom(projectName),
		RequestType:        models.SystemIntakeRequestTypeNEW,
		ContractStartMonth: null.StringFrom(contracStartMonth),
		ContractStartYear:  null.StringFrom(contractStartYear),
		ContractEndMonth:   null.StringFrom(contractEndMonth),
		ContractEndYear:    null.StringFrom(contractEndYear),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID       string
			Contract struct {
				EndDate struct {
					Day   string
					Month string
					Year  string
				}
				StartDate struct {
					Day   string
					Month string
					Year  string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				contract {
					endDate {
						day
						month
						year
					}
					startDate {
						day
						month
						year
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	startDate := resp.SystemIntake.Contract.StartDate
	s.Equal("", startDate.Day)
	s.Equal(contracStartMonth, startDate.Month)
	s.Equal(contractStartYear, startDate.Year)

	endDate := resp.SystemIntake.Contract.EndDate
	s.Equal("", endDate.Day)
	s.Equal(contractEndMonth, endDate.Month)
	s.Equal(contractEndYear, endDate.Year)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithContractDatesQuery() {
	ctx := context.Background()
	projectName := "My cool project"
	contractStartDate, _ := time.Parse("2006-1-2", "2002-8-24")
	contractEndDate, _ := time.Parse("2006-1-2", "2020-10-31")

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:         null.StringFrom("TEST"),
		ProjectName:       null.StringFrom(projectName),
		RequestType:       models.SystemIntakeRequestTypeNEW,
		ContractStartDate: &contractStartDate,
		ContractEndDate:   &contractEndDate,
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID       string
			Contract struct {
				EndDate struct {
					Day   string
					Month string
					Year  string
				}
				StartDate struct {
					Day   string
					Month string
					Year  string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				contract {
					endDate {
						day
						month
						year
					}
					startDate {
						day
						month
						year
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	startDate := resp.SystemIntake.Contract.StartDate
	s.Equal("24", startDate.Day)
	s.Equal("8", startDate.Month)
	s.Equal("2002", startDate.Year)

	endDate := resp.SystemIntake.Contract.EndDate
	s.Equal("31", endDate.Day)
	s.Equal("10", endDate.Month)
	s.Equal("2020", endDate.Year)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithNoCollaboratorsQuery() {
	ctx := context.Background()
	projectName := "My cool project"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:                   null.StringFrom("TEST"),
		ProjectName:                 null.StringFrom(projectName),
		RequestType:                 models.SystemIntakeRequestTypeNEW,
		EACollaboratorName:          null.StringFrom(""),
		OITSecurityCollaboratorName: null.StringFrom(""),
		TRBCollaboratorName:         null.StringFrom(""),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID              string
			GovernanceTeams struct {
				IsPresent bool
				Teams     []struct {
					Acronym      string
					Collaborator string
					Key          string
					Label        string
					Name         string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				governanceTeams {
					isPresent
					teams {
						acronym
						collaborator
						key
						label
						name
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.False(resp.SystemIntake.GovernanceTeams.IsPresent)
	s.Nil(resp.SystemIntake.GovernanceTeams.Teams)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithCollaboratorsQuery() {
	ctx := context.Background()
	projectName := "My cool project"
	eaName := "My EA Rep"
	oitName := "My OIT Rep"
	trbName := "My TRB Rep"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:                   null.StringFrom("TEST"),
		ProjectName:                 null.StringFrom(projectName),
		RequestType:                 models.SystemIntakeRequestTypeNEW,
		EACollaboratorName:          null.StringFrom(eaName),
		OITSecurityCollaboratorName: null.StringFrom(oitName),
		TRBCollaboratorName:         null.StringFrom(trbName),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID              string
			GovernanceTeams struct {
				IsPresent bool
				Teams     []struct {
					Acronym      string
					Collaborator string
					Key          string
					Label        string
					Name         string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				governanceTeams {
					isPresent
					teams {
						acronym
						collaborator
						key
						label
						name
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.True(resp.SystemIntake.GovernanceTeams.IsPresent)
	s.Equal(trbName, resp.SystemIntake.GovernanceTeams.Teams[0].Collaborator)
	s.Equal(oitName, resp.SystemIntake.GovernanceTeams.Teams[1].Collaborator)
	s.Equal(eaName, resp.SystemIntake.GovernanceTeams.Teams[2].Collaborator)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithActionsQuery() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		ProjectName: null.StringFrom("Test Project"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	action1, action1Err := s.store.CreateAction(ctx, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "First Actor",
		ActorEmail:     "first.actor@example.com",
		ActorEUAUserID: "ACT1",
		CreatedAt:      date(2021, 4, 1),
	})
	s.NoError(action1Err)

	action2, action2Err := s.store.CreateAction(ctx, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypePROVIDEFEEDBACKNEEDBIZCASE,
		ActorName:      "Second Actor",
		ActorEmail:     "second.actor@example.com",
		ActorEUAUserID: "ACT2",
		Feedback:       models.HTMLPointer("feedback for action two"),
		CreatedAt:      date(2021, 4, 2),
	})
	s.NoError(action2Err)

	var resp struct {
		SystemIntake struct {
			ID      string
			Actions []struct {
				ID    string
				Type  string
				Actor struct {
					Name  string
					Email string
				}
				Feedback  *string
				CreatedAt string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				actions {
					id
					type
					actor {
						name
						email
					}
					feedback
					createdAt
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(2, len(resp.SystemIntake.Actions))

	respAction2 := resp.SystemIntake.Actions[0]
	s.Equal(action2.ID.String(), respAction2.ID)
	s.Equal("feedback for action two", *respAction2.Feedback)
	s.Equal(action2.CreatedAt.UTC().Format(time.RFC3339), respAction2.CreatedAt)
	s.Equal("PROVIDE_FEEDBACK_NEED_BIZ_CASE", respAction2.Type)
	s.Equal("Second Actor", respAction2.Actor.Name)
	s.Equal("second.actor@example.com", respAction2.Actor.Email)

	respAction1 := resp.SystemIntake.Actions[1]
	s.Equal(action1.ID.String(), respAction1.ID)
	s.Nil(respAction1.Feedback)
	s.Equal(action1.CreatedAt.UTC().Format(time.RFC3339), respAction1.CreatedAt)
	s.Equal("SUBMIT_INTAKE", respAction1.Type)
	s.Equal("First Actor", respAction1.Actor.Name)
	s.Equal("first.actor@example.com", respAction1.Actor.Email)
}

func (s *GraphQLTestSuite) TestUpdateContactDetails() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
					Email     string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     null.String
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false
					name: null
				},
				governanceTeams: {
					isPresent: false
					teams: []
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
						email
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							name
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Equal(respIntake.BusinessOwner.Name, "Iama Businessowner")
	s.Equal(respIntake.BusinessOwner.Component, "CMS Office 1")

	s.Equal(respIntake.ProductManager.Name, "Iama Productmanager")
	s.Equal(respIntake.ProductManager.Component, "CMS Office 2")

	s.Equal(respIntake.Requester.Name, "Iama Requester")
	s.Equal(respIntake.Requester.Component, "CMS Office 3")
	s.Equal(respIntake.Requester.Email, "terry.thompson@local.fake")

	s.Nil(respIntake.Isso.Name.Ptr())
	s.False(respIntake.Isso.IsPresent)

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsEmptyEUA() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		// EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
					Email     string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     null.String
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false
					name: null
				},
				governanceTeams: {
					isPresent: false
					teams: []
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
						email
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							name
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Equal(respIntake.BusinessOwner.Name, "Iama Businessowner")
	s.Equal(respIntake.BusinessOwner.Component, "CMS Office 1")

	s.Equal(respIntake.ProductManager.Name, "Iama Productmanager")
	s.Equal(respIntake.ProductManager.Component, "CMS Office 2")

	s.Equal(respIntake.Requester.Name, "Iama Requester")
	s.Equal(respIntake.Requester.Component, "CMS Office 3")
	s.Equal(respIntake.Requester.Email, "")

	s.Nil(respIntake.Isso.Name.Ptr())
	s.False(respIntake.Isso.IsPresent)

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsWithISSOAndTeams() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      string
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     []struct {
						Name         string
						Collaborator string
						Key          string
					}
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: true,
					name: "Iama Issoperson"
				},
				governanceTeams: {
					isPresent: true,
					teams: [
						{ name: "Technical Review Board", key: "technicalReviewBoard", collaborator: "Iama Trbperson" },
						{ name: "OIT's Security and Privacy Group", key: "securityPrivacy", collaborator: "Iama Ispgperson" },
						{ name: "Enterprise Architecture", key: "enterpriseArchitecture", collaborator: "Iama Eaperson" }
					]
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							collaborator
							key
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Equal("Iama Issoperson", respIntake.Isso.Name)
	s.True(respIntake.Isso.IsPresent)

	s.True(respIntake.GovernanceTeams.IsPresent)
	teams := respIntake.GovernanceTeams.Teams
	s.Equal("Iama Trbperson", teams[0].Collaborator)
	s.Equal("technicalReviewBoard", teams[0].Key)

	s.Equal("Iama Ispgperson", teams[1].Collaborator)
	s.Equal("securityPrivacy", teams[1].Key)

	s.Equal("Iama Eaperson", teams[2].Collaborator)
	s.Equal("enterpriseArchitecture", teams[2].Key)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsWillClearISSOAndTeams() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	intake.ISSOName = null.StringFrom("Isso Person")
	intake.TRBCollaboratorName = null.StringFrom("TRB Person")
	intake.OITSecurityCollaboratorName = null.StringFrom("OIT Person")
	intake.EACollaboratorName = null.StringFrom("EA Person")
	_, err := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(err)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     null.String
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false,
					name: null
				},
				governanceTeams: {
					isPresent: false,
					teams: null
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							collaborator
							key
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Nil(respIntake.Isso.Name.Ptr())
	s.False(respIntake.Isso.IsPresent)

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsWillClearOneTeam() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	intake.ISSOName = null.StringFrom("Isso Person")
	intake.TRBCollaboratorName = null.StringFrom("TRB Person")
	intake.OITSecurityCollaboratorName = null.StringFrom("OIT Person")
	intake.EACollaboratorName = null.StringFrom("EA Person")
	_, err := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(err)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     []struct {
						Name         string
						Collaborator string
						Key          string
					}
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false,
					name: null
				},
				governanceTeams: {
					isPresent: true,
					teams: [
						{ name: "Technical Review Board", key: "technicalReviewBoard", collaborator: "Iama Trbperson" },
						{ name: "OIT's Security and Privacy Group", key: "securityPrivacy", collaborator: "Iama Ispgperson" }
					]
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							collaborator
							key
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.True(respIntake.GovernanceTeams.IsPresent)
	teams := respIntake.GovernanceTeams.Teams
	s.Equal(2, len(teams))
	s.Equal("Iama Trbperson", teams[0].Collaborator)
	s.Equal("technicalReviewBoard", teams[0].Key)

	s.Equal("Iama Ispgperson", teams[1].Collaborator)
	s.Equal("securityPrivacy", teams[1].Key)
}

func (s *GraphQLTestSuite) TestUpdateRequestDetails() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID               string
				RequestName      string
				BusinessSolution string
				BusinessNeed     string
				CurrentStage     string
				NeedsEaSupport   bool
				HasUIChanges     bool
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeRequestDetails(input: {
				id: "%s",
				requestName: "My request",
				businessSolution: "My solution",
				businessNeed: "My need",
				currentStage:  "Just an idea",
				needsEaSupport: false,
				hasUiChanges: false,
			}) {
				systemIntake {
					id
					requestName
					businessSolution
					businessNeed
					currentStage
					needsEaSupport
					hasUiChanges
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeRequestDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeRequestDetails.SystemIntake
	s.Equal(respIntake.RequestName, "My request")
	s.Equal(respIntake.BusinessSolution, "My solution")
	s.Equal(respIntake.BusinessNeed, "My need")
	s.Equal(respIntake.CurrentStage, "Just an idea")
	s.False(respIntake.NeedsEaSupport)
	s.False(respIntake.HasUIChanges)
}

func (s *GraphQLTestSuite) TestUpdateRequestDetailsHasUiChangesNull() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID           string
				HasUIChanges *bool
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeRequestDetails(input: {
				id: "%s",
				hasUiChanges: null,
			}) {
				systemIntake {
					id
					hasUiChanges
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeRequestDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeRequestDetails.SystemIntake
	s.Nil(respIntake.HasUIChanges)
}

func (s *GraphQLTestSuite) TestUpdateRequestDetailsHasUiChangesTrue() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID           string
				HasUIChanges *bool
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeRequestDetails(input: {
				id: "%s",
				hasUiChanges: true,
			}) {
				systemIntake {
					id
					hasUiChanges
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeRequestDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeRequestDetails.SystemIntake
	s.True(*respIntake.HasUIChanges)
}

func (s *GraphQLTestSuite) TestUpdateContractDetailsImmediatelyAfterIntakeCreation() {

	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID              string
				ExistingFunding bool
				FundingSources  []struct {
					Source        string
					FundingNumber string
				}
				Costs struct {
					ExpectedIncreaseAmount string
					IsExpectingIncrease    string
				}
				Contract struct {
					Contractor string
					EndDate    struct {
						Day   string
						Month string
						Year  string
					}
					HasContract string
					StartDate   struct {
						Day   string
						Month string
						Year  string
					}
					Number string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				fundingSources: {
					existingFunding: true
					fundingSources: [
						{
							source: "Prog Ops"
							fundingNumber: "123456"
						}
					]
				}
				costs: {
					expectedIncreaseAmount: "A little bit"
					isExpectingIncrease: "YES"
				}
				contract: {
					contractor: "Best Contractor Evar"
					endDate: "2022-02-03T00:00:00Z"
					hasContract: "HAVE_CONTRACT"
					startDate: "2021-11-12T00:00:00Z"
					number: "123456-7890"
				}
			}) {
				systemIntake {
					id
					existingFunding
					fundingSources {
						fundingNumber
						source
					}
					costs {
						expectedIncreaseAmount
						isExpectingIncrease
					}
					contract {
						contractor
						endDate {
							day
							month
							year
						}
						hasContract
						startDate {
							day
							month
							year
						}
						number
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake

	fundingSources := respIntake.FundingSources
	s.Equal(fundingSources[0].FundingNumber, "123456")
	s.True(respIntake.ExistingFunding)
	s.Equal(fundingSources[0].Source, "Prog Ops")

	costs := respIntake.Costs
	s.Equal(costs.ExpectedIncreaseAmount, "A little bit")
	s.Equal(costs.IsExpectingIncrease, "YES")

	contract := respIntake.Contract
	s.Equal(contract.HasContract, "HAVE_CONTRACT")
	s.Equal(contract.Contractor, "Best Contractor Evar")
	s.Equal(contract.Number, "123456-7890")

	startDate := contract.StartDate
	s.Equal(startDate.Day, "12")
	s.Equal(startDate.Month, "11")
	s.Equal(startDate.Year, "2021")

	endDate := contract.EndDate
	s.Equal(endDate.Day, "3")
	s.Equal(endDate.Month, "2")
	s.Equal(endDate.Year, "2022")
}

// make sure that for system intakes that haven't had their contract vehicles updated to contract numbers (see EASI-1977),
// we still return the contract vehicle
func (s *GraphQLTestSuite) TestContractQueryReturnsVehicleForLegacyIntakes() {
	ctx := context.Background()

	contractVehicle := "Ford"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:       null.StringFrom("TEST"),
		RequestType:     models.SystemIntakeRequestTypeNEW,
		ContractVehicle: null.StringFrom(contractVehicle),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			Contract struct {
				Vehicle *string
				Number  *string
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				contract {
					vehicle
					number
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(contractVehicle, *resp.SystemIntake.Contract.Vehicle)
	s.Nil(resp.SystemIntake.Contract.Number)
}

// when a system intake has a contract vehicle stored but no contract number, updating the contract number should clear the contract vehicle (see EASI-1977)
func (s *GraphQLTestSuite) TestUpdateContractDetailsReplacesContractVehicleWithContractNumber() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:       null.StringFrom("TEST"),
		RequestType:     models.SystemIntakeRequestTypeNEW,
		ContractVehicle: null.StringFrom("Toyota"),
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				Contract struct {
					Vehicle *string
					Number  *string
				}
			}
		}
	}

	contractNumber := "123456-7890"

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				contract: {
					number: "%s"
				}
			}) {
				systemIntake {
					contract {
						vehicle
						number
					}
				}
			}
		}`, intake.ID, contractNumber), &resp)

	s.Equal(contractNumber, *resp.UpdateSystemIntakeContractDetails.SystemIntake.Contract.Number)
	s.Nil(resp.UpdateSystemIntakeContractDetails.SystemIntake.Contract.Vehicle)
}

func (s *GraphQLTestSuite) TestUpdateContractDetailsRemoveFundingSource() {

	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:       null.StringFrom("TEST"),
		RequestType:     models.SystemIntakeRequestTypeNEW,
		ExistingFunding: null.BoolFrom(true),
		FundingSources: []*models.SystemIntakeFundingSource{
			{
				Source:        null.StringFrom("Prog Ops"),
				FundingNumber: null.StringFrom("123456"),
			},
		},
	})
	s.NoError(intakeErr)

	_, sourcesErr := s.store.UpdateSystemIntakeFundingSources(ctx, intake.ID, intake.FundingSources)
	s.NoError(sourcesErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID              string
				ExistingFunding bool
				FundingSources  []struct {
					SystemIntakeID string
					Source         string
					FundingNumber  string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				fundingSources: {
					existingFunding: false
					fundingSources: []
				}
			}) {
				systemIntake {
					id
					existingFunding
					fundingSources {
						fundingNumber
						source
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake
	fundingSources := respIntake.FundingSources
	s.True(len(fundingSources) == 0)
}

func (s *GraphQLTestSuite) TestUpdateContractDetailsRemoveCosts() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:          null.StringFrom("TEST"),
		RequestType:        models.SystemIntakeRequestTypeNEW,
		CostIncreaseAmount: null.StringFrom("Just a little"),
		CostIncrease:       null.StringFrom("YES"),
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID    string
				Costs struct {
					ExpectedIncreaseAmount *string
					IsExpectingIncrease    string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				costs: {
					expectedIncreaseAmount: ""
					isExpectingIncrease: "No"
				}
			}) {
				systemIntake {
					id
					costs {
						expectedIncreaseAmount
						isExpectingIncrease
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake
	costs := respIntake.Costs
	s.Nil(costs.ExpectedIncreaseAmount)
	s.Equal(costs.IsExpectingIncrease, "No")
}

func (s *GraphQLTestSuite) TestUpdateContractDetailsRemoveContract() {
	ctx := context.Background()

	contractStartDate, _ := time.Parse("2006-1-2", "2002-8-24")
	contractEndDate, _ := time.Parse("2006-1-2", "2020-10-31")

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:         null.StringFrom("TEST"),
		RequestType:       models.SystemIntakeRequestTypeNEW,
		ExistingContract:  null.StringFrom("HAVE_CONTRACT"),
		Contractor:        null.StringFrom("Best Contractor Evar"),
		ContractVehicle:   null.StringFrom("Toyota Prius"),
		ContractStartDate: &contractStartDate,
		ContractEndDate:   &contractEndDate,
	})

	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID       string
				Contract struct {
					Contractor *string
					EndDate    struct {
						Day   *string
						Month *string
						Year  *string
					}
					HasContract string
					StartDate   struct {
						Day   *string
						Month *string
						Year  *string
					}
					Vehicle *string
					Number  *string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				contract: {
					contractor: ""
					startDate: null
					hasContract: "NOT_STARTED"
					endDate: null
				}
			}) {
				systemIntake {
					id
					contract {
						contractor
						endDate {
							day
							month
							year
						}
						hasContract
						startDate {
							day
							month
							year
						}
						vehicle
						number
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake
	contract := respIntake.Contract
	s.Equal(contract.HasContract, "NOT_STARTED")
	s.Nil(contract.Contractor)
	s.Nil(contract.Vehicle)
	s.Nil(contract.Number)

	startDate := contract.StartDate
	s.Nil(startDate.Day)
	s.Nil(startDate.Month)
	s.Nil(startDate.Year)

	endDate := contract.EndDate
	s.Nil(endDate.Day)
	s.Nil(endDate.Month)
	s.Nil(endDate.Year)
}

func (s *GraphQLTestSuite) TestSubmitIntake() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		SubmitIntake struct {
			SystemIntake struct {
				ID string
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			submitIntake(input: {
				id: "%s",
			}) {
				systemIntake {
					id
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest("TEST"))

	respIntake := resp.SubmitIntake.SystemIntake
	s.Equal(intake.ID.String(), respIntake.ID)
}
