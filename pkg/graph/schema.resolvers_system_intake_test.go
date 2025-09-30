package graph

import (
	"fmt"
	"time"

	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql

	"github.com/cms-enterprise/easi-app/pkg/models"
	"github.com/cms-enterprise/easi-app/pkg/storage"
	"github.com/cms-enterprise/easi-app/pkg/testhelpers"
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
			}
		}`, &resp, s.addAuthWithAllJobCodesToGraphQLClientTest("TEST"))

	s.NotNil(resp.CreateSystemIntake.ID)
	s.Equal("NEW", resp.CreateSystemIntake.RequestType)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeQuery() {
	ctx := s.context
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.Equal(projectName, resp.SystemIntake.RequestName)
	s.Equal("NEW", resp.SystemIntake.RequestType)
	s.Equal(businessOwner, resp.SystemIntake.BusinessOwner.Name)
	s.Equal(businessOwnerComponent, resp.SystemIntake.BusinessOwner.Component)
	s.Nil(resp.SystemIntake.BusinessNeed)
	s.Nil(resp.SystemIntake.BusinessCase)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithNotesQuery() {
	ctx := s.context
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest("WWWW"))

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
	ctx := s.context

	contracStartMonth := "10"
	contractStartYear := "2002"
	contractEndMonth := "08"
	contractEndYear := "2020"
	projectName := "My cool project"

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
		}`, intake.ID),
		&resp,
		s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()),
	)

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
	ctx := s.context

	projectName := "My cool project"
	contractStartDate, _ := time.Parse("2006-1-2", "2002-8-24")
	contractEndDate, _ := time.Parse("2006-1-2", "2020-10-31")

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
		}`, intake.ID),
		&resp,
		s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

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
	ctx := s.context
	projectName := "My cool project"

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:                   null.StringFrom("TEST"),
		ProjectName:                 null.StringFrom(projectName),
		RequestType:                 models.SystemIntakeRequestTypeNEW,
		OITSecurityCollaboratorName: null.StringFrom(""),
		CollaboratorName508:         null.StringFrom(""),
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
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.False(resp.SystemIntake.GovernanceTeams.IsPresent)
	s.Nil(resp.SystemIntake.GovernanceTeams.Teams)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithCollaboratorsQuery() {
	ctx := s.context
	projectName := "My cool project"
	name508 := "My 508 Rep"
	oitName := "My OIT Rep"
	trbName := "My TRB Rep"

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:                   null.StringFrom("TEST"),
		ProjectName:                 null.StringFrom(projectName),
		RequestType:                 models.SystemIntakeRequestTypeNEW,
		OITSecurityCollaboratorName: null.StringFrom(oitName),
		TRBCollaboratorName:         null.StringFrom(trbName),
		CollaboratorName508:         null.StringFrom(name508),
		GovernanceTeamsIsPresent:    null.BoolFrom(true),
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
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.True(resp.SystemIntake.GovernanceTeams.IsPresent)
	s.Equal(trbName, resp.SystemIntake.GovernanceTeams.Teams[0].Collaborator)
	s.Equal(oitName, resp.SystemIntake.GovernanceTeams.Teams[1].Collaborator)
	s.Equal(name508, resp.SystemIntake.GovernanceTeams.Teams[2].Collaborator)
}

func (s *GraphQLTestSuite) TestFetchSystemIntakeWithActionsQuery() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

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
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID              string
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
				governanceTeams: {
					isPresent: false
					teams: []
				}
			}) {
				systemIntake {
					id,
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

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsEmptyEUA() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
				governanceTeams: {
					isPresent: false
					teams: []
				}
			}) {
				systemIntake {
					id,
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

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsWithTeams() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID              string
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
				governanceTeams: {
					isPresent: true,
					teams: [
						{ name: "Technical Review Board", key: "technicalReviewBoard", collaborator: "Iama Trbperson" },
						{ name: "OIT's Security and Privacy Group", key: "securityPrivacy", collaborator: "Iama Ispgperson" },
						{ name: "508 Clearance Officer", key: "clearanceOfficer508", collaborator: "Iama 508person" }
					]
				}
			}) {
				systemIntake {
					id,
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
	s.Equal("Iama Trbperson", teams[0].Collaborator)
	s.Equal("technicalReviewBoard", teams[0].Key)

	s.Equal("Iama Ispgperson", teams[1].Collaborator)
	s.Equal("securityPrivacy", teams[1].Key)

	s.Equal("Iama 508person", teams[2].Collaborator)
	s.Equal("clearanceOfficer508", teams[2].Key)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsWillClearTeams() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	intake.TRBCollaboratorName = null.StringFrom("TRB Person")
	intake.OITSecurityCollaboratorName = null.StringFrom("OIT Person")
	intake.CollaboratorName508 = null.StringFrom("508 Person")
	_, err := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(err)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID              string
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
				governanceTeams: {
					isPresent: false,
					teams: null
				}
			}) {
				systemIntake {
					id,
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

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s *GraphQLTestSuite) TestUpdateContactDetailsWillClearOneTeam() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	intake.TRBCollaboratorName = null.StringFrom("TRB Person")
	intake.OITSecurityCollaboratorName = null.StringFrom("OIT Person")
	intake.CollaboratorName508 = null.StringFrom("508 Person")
	_, err := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(err)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID              string
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
				governanceTeams: {
					isPresent: true,
					teams: [
						{ name: "Technical Review Board", key: "technicalReviewBoard", collaborator: "Iama Trbperson" },
						{ name: "OIT's Security and Privacy Group", key: "securityPrivacy", collaborator: "Iama Ispgperson" },
						{ name: "508 Clearance Officer", key: "clearanceOfficer508", collaborator: "Iama 508person" }
					]
				}
			}) {
				systemIntake {
					id,
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
	s.Equal(3, len(teams))
	s.Equal("Iama Trbperson", teams[0].Collaborator)
	s.Equal("technicalReviewBoard", teams[0].Key)

	s.Equal("Iama Ispgperson", teams[1].Collaborator)
	s.Equal("securityPrivacy", teams[1].Key)

	s.Equal("Iama 508person", teams[2].Collaborator)
	s.Equal("clearanceOfficer508", teams[2].Key)
}

func (s *GraphQLTestSuite) TestUpdateRequestDetails() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})

	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID                 string
				RequestName        string
				BusinessSolution   string
				BusinessNeed       string
				CurrentStage       string
				NeedsEaSupport     bool
				HasUIChanges       bool
				UsesAiTech         bool
				UsingSoftware      string
				AcquisitionMethods []string
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
				usesAiTech: true,
				usingSoftware: "NO",
				acquisitionMethods: [],
			}) {
				systemIntake {
					id
					requestName
					businessSolution
					businessNeed
					currentStage
					needsEaSupport
					hasUiChanges
					usesAiTech
					usingSoftware
					acquisitionMethods
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
	s.True(respIntake.UsesAiTech)
	s.Equal(respIntake.UsingSoftware, "NO")
}

func (s *GraphQLTestSuite) TestUpdateRequestDetailsNullFields() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID                 string
				UsesAiTech         *bool
				HasUIChanges       *bool
				UsingSoftware      *string
				AcquisitionMethods []string
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeRequestDetails(input: {
				id: "%s",
				usesAiTech: null,
				hasUiChanges: null,
				usingSoftware: null,
				acquisitionMethods: [],
			}) {
				systemIntake {
					id
					usesAiTech
					hasUiChanges
					usingSoftware
					acquisitionMethods
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeRequestDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeRequestDetails.SystemIntake
	s.Nil(respIntake.UsesAiTech)
	s.Nil(respIntake.HasUIChanges)
	s.Nil(respIntake.UsingSoftware)
	s.Equal(0, len(respIntake.AcquisitionMethods))
}

func (s *GraphQLTestSuite) TestUpdateRequestDetailsHasUiChangesTrue() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:   null.StringFrom("TEST"),
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID                 string
				UsesAiTech         *bool
				HasUIChanges       *bool
				UsingSoftware      *string
				AcquisitionMethods []string
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeRequestDetails(input: {
				id: "%s",
				usesAiTech: true,
				hasUiChanges: true,
				usingSoftware: null,
				acquisitionMethods: [],
			}) {
				systemIntake {
					id
					usesAiTech
					hasUiChanges
					usingSoftware
					acquisitionMethods
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeRequestDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeRequestDetails.SystemIntake
	s.True(*respIntake.HasUIChanges)
}

func (s *GraphQLTestSuite) TestUpdateContractDetailsImmediatelyAfterIntakeCreation() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
					Investment    string
					ProjectNumber string
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
				}
				ContractNumbers []struct {
					ID             string
					SystemIntakeID string
					ContractNumber string
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
							investment: "Prog Ops"
							projectNumber: "123456"
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
					numbers: ["123456-7890"]
				}
			}) {
				systemIntake {
					id
					existingFunding
					fundingSources {
						projectNumber
						investment
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
					}
					contractNumbers {
						id
						systemIntakeID
						contractNumber
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake

	fundingSources := respIntake.FundingSources
	s.Equal(fundingSources[0].ProjectNumber, "123456")
	s.True(respIntake.ExistingFunding)
	s.Equal(fundingSources[0].Investment, "Prog Ops")

	costs := respIntake.Costs
	s.Equal(costs.ExpectedIncreaseAmount, "A little bit")
	s.Equal(costs.IsExpectingIncrease, "YES")

	contract := respIntake.Contract
	s.Equal(contract.HasContract, "HAVE_CONTRACT")
	s.Equal(contract.Contractor, "Best Contractor Evar")

	found := false

	for _, val := range respIntake.ContractNumbers {
		if val.ContractNumber == "123456-7890" {
			found = true
		}
	}

	s.True(found)

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
	ctx := s.context

	contractVehicle := "Ford"

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:       null.StringFrom("TEST"),
		RequestType:     models.SystemIntakeRequestTypeNEW,
		ContractVehicle: null.StringFrom(contractVehicle),
	})

	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			Contract struct {
				Vehicle *string
			}
			ContractNumbers []struct {
				id             string
				systemIntakeID string
				contractNumber string
			}
		}
	}

	s.client.MustPost(
		fmt.Sprintf(
			`query {
			systemIntake(id: "%s") {
				contract {
					vehicle
				}
				contractNumbers {
					id
					systemIntakeID
					contractNumber
				}
			}
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(contractVehicle, *resp.SystemIntake.Contract.Vehicle)
	s.Empty(resp.SystemIntake.ContractNumbers)
}

// when a system intake has a contract vehicle stored but no contract number, updating the contract number should clear the contract vehicle (see EASI-1977)
func (s *GraphQLTestSuite) TestUpdateContractDetailsReplacesContractVehicleWithContractNumber() {
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
				}
				ContractNumbers []struct {
					ID             string
					SystemIntakeID string
					ContractNumber string
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
					numbers: ["%s"]
				}
			}) {
				systemIntake {
					contract {
						vehicle
					}
					contractNumbers {
						id
						systemIntakeID
						contractNumber
					}
				}
			}
		}`, intake.ID, contractNumber), &resp)

	found := false

	for _, val := range resp.UpdateSystemIntakeContractDetails.SystemIntake.ContractNumbers {
		if val.ContractNumber == contractNumber {
			found = true
		}
	}

	s.True(found)
	s.Nil(resp.UpdateSystemIntakeContractDetails.SystemIntake.Contract.Vehicle)
}

func (s *GraphQLTestSuite) TestUpdateContractDetailsRemoveFundingSource() {

	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
		EUAUserID:       null.StringFrom("TEST"),
		RequestType:     models.SystemIntakeRequestTypeNEW,
		ExistingFunding: null.BoolFrom(true),
		FundingSources: []*models.SystemIntakeFundingSource{
			{
				Investment:    null.StringFrom("Prog Ops"),
				ProjectNumber: null.StringFrom("123456"),
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
					Investment     string
					ProjectNumber  string
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
						projectNumber
						investment
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
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
	ctx := s.context

	contractStartDate, _ := time.Parse("2006-1-2", "2002-8-24")
	contractEndDate, _ := time.Parse("2006-1-2", "2020-10-31")

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
				}
				ContractNumbers []struct {
					ID             string
					SystemIntakeID string
					ContractNumber string
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
					numbers: []
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
					}
					contractNumbers {
						id
						systemIntakeID
						contractNumber
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
	s.Empty(respIntake.ContractNumbers)

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
	ctx := s.context

	intake, intakeErr := storage.CreateSystemIntake(ctx, s.store, &models.SystemIntake{
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
		}`, intake.ID), &resp, s.addAuthWithAllJobCodesToGraphQLClientTest("TEST"))

	respIntake := resp.SubmitIntake.SystemIntake
	s.Equal(intake.ID.String(), respIntake.ID)
}
