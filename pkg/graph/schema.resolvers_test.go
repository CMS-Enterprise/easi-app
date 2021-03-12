package graph

import (
	"context"
	"fmt"
	"net/url"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/client/metadata"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"
	ld "gopkg.in/launchdarkly/go-server-sdk.v5"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/graph/generated"
	"github.com/cmsgov/easi-app/pkg/graph/model"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/storage"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
	"github.com/cmsgov/easi-app/pkg/upload"
)

type GraphQLTestSuite struct {
	suite.Suite
	logger   *zap.Logger
	store    *storage.Store
	client   *client.Client
	s3Client *mockS3Client
}

func (s *GraphQLTestSuite) BeforeTest() {
	s.s3Client.AVStatus = ""
}

type mockS3Client struct {
	s3iface.S3API
	AVStatus string
}

func (m mockS3Client) PutObjectRequest(input *s3.PutObjectInput) (*request.Request, *s3.PutObjectOutput) {

	newRequest := request.New(
		aws.Config{},
		metadata.ClientInfo{},
		request.Handlers{},
		nil,
		&request.Operation{},
		nil,
		nil,
	)

	newRequest.Handlers.Sign.PushFront(func(r *request.Request) {
		r.HTTPRequest.URL = &url.URL{Host: "signed.example.com", Path: "signed/put/123", Scheme: "https"}
	})
	return newRequest, &s3.PutObjectOutput{}
}

func (m mockS3Client) GetObjectRequest(input *s3.GetObjectInput) (*request.Request, *s3.GetObjectOutput) {
	newRequest := request.New(
		aws.Config{},
		metadata.ClientInfo{},
		request.Handlers{},
		nil,
		&request.Operation{},
		nil,
		nil,
	)

	newRequest.Handlers.Sign.PushFront(func(r *request.Request) {
		r.HTTPRequest.URL = &url.URL{Host: "signed.example.com", Path: "signed/get/123", Scheme: "https"}
	})
	return newRequest, &s3.GetObjectOutput{}
}

func (m mockS3Client) GetObjectTagging(input *s3.GetObjectTaggingInput) (*s3.GetObjectTaggingOutput, error) {
	if m.AVStatus == "" {
		return &s3.GetObjectTaggingOutput{}, nil
	}

	return &s3.GetObjectTaggingOutput{
		TagSet: []*s3.Tag{{
			Key:   aws.String("av-status"),
			Value: aws.String(m.AVStatus),
		}},
	}, nil
}

func TestGraphQLTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	logger, loggerErr := zap.NewDevelopment()
	if loggerErr != nil {
		panic(loggerErr)
	}

	dbConfig := storage.DBConfig{
		Host:     config.GetString(appconfig.DBHostConfigKey),
		Port:     config.GetString(appconfig.DBPortConfigKey),
		Database: config.GetString(appconfig.DBNameConfigKey),
		Username: config.GetString(appconfig.DBUsernameConfigKey),
		Password: config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:  config.GetString(appconfig.DBSSLModeConfigKey),
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	store, err := storage.NewStore(logger, dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.Fail()
	}

	s3Config := upload.Config{Bucket: "easi-test-bucket", Region: "us-west", IsLocal: false}
	mockClient := mockS3Client{}
	s3Client := upload.NewS3ClientUsingClient(&mockClient, s3Config)

	directives := generated.DirectiveRoot{HasRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (res interface{}, err error) {
		return next(ctx)
	}}

	schema := generated.NewExecutableSchema(generated.Config{Resolvers: NewResolver(store, ResolverService{}, &s3Client), Directives: directives})
	graphQLClient := client.New(handler.NewDefaultServer(schema))

	storeTestSuite := &GraphQLTestSuite{
		Suite:    suite.Suite{},
		logger:   logger,
		store:    store,
		client:   graphQLClient,
		s3Client: &mockClient,
	}

	suite.Run(t, storeTestSuite)
}

func (s GraphQLTestSuite) TestAccessibilityRequestQuery() {
	ctx := context.Background()

	// ToDo: This whole test would probably be better as an integration test in pkg/integration, so we can see the real
	// functionality and not have to reinitialize all the services here

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom("Big Project"),
		Status:                 models.SystemIntakeStatusLCIDISSUED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom("Firstname Lastname"),
		BusinessOwnerComponent: null.StringFrom("OIT"),
	})
	s.NoError(intakeErr)

	// Can't set a lifecycle ID when creating system intake, so we need to do this to set that
	// so we can then query for the system within the resolver
	lifecycleID, lcidErr := s.store.GenerateLifecycleID(ctx)
	s.NoError(lcidErr)
	intake.LifecycleID = null.StringFrom(lifecycleID)
	_, updateErr := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(updateErr)

	accessibilityRequest, requestErr := s.store.CreateAccessibilityRequest(ctx, &models.AccessibilityRequest{
		IntakeID: intake.ID,
	})
	s.NoError(requestErr)

	document, documentErr := s.store.CreateAccessibilityRequestDocument(ctx, &models.AccessibilityRequestDocument{
		RequestID:          accessibilityRequest.ID,
		Name:               "uploaded_doc.pdf",
		FileType:           "application/pdf",
		Size:               1234567,
		VirusScanned:       null.BoolFrom(true),
		VirusClean:         null.BoolFrom(true),
		Key:                "abcdefg1234567.pdf",
		CommonDocumentType: models.AccessibilityRequestDocumentCommonTypeAwardedVpat,
	})
	s.NoError(documentErr)

	var resp struct {
		AccessibilityRequest struct {
			ID     string
			System struct {
				ID            string
				Name          string
				LCID          string
				BusinessOwner struct {
					Name      string
					Component string
				}
			}
			Documents []struct {
				ID       string
				URL      string
				MimeType string
				Name     string
				Size     int
				Status   string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			accessibilityRequest(id: "%s") {
				id
				documents {
					id
					url
					mimeType
					name
					size
					status
				}
				system {
					id
					name
					lcid
					businessOwner {
						name
						component
					}
				}
			}
		}`, accessibilityRequest.ID), &resp)

	s.Equal(accessibilityRequest.ID.String(), resp.AccessibilityRequest.ID)
	s.Equal(intake.ID.String(), resp.AccessibilityRequest.System.ID)
	s.Equal("Big Project", resp.AccessibilityRequest.System.Name)
	s.Equal(lifecycleID, resp.AccessibilityRequest.System.LCID)
	s.Equal("Firstname Lastname", resp.AccessibilityRequest.System.BusinessOwner.Name)
	s.Equal("OIT", resp.AccessibilityRequest.System.BusinessOwner.Component)

	s.Equal(1, len(resp.AccessibilityRequest.Documents))

	responseDocument := resp.AccessibilityRequest.Documents[0]
	s.Equal(document.ID.String(), responseDocument.ID)
	s.Equal("application/pdf", responseDocument.MimeType)
	s.Equal(1234567, responseDocument.Size)
	s.Equal("PENDING", responseDocument.Status)
	s.Equal("https://signed.example.com/signed/get/123", responseDocument.URL)
	s.Equal("uploaded_doc.pdf", responseDocument.Name)
}

func (s GraphQLTestSuite) TestAccessibilityRequestVirusStatusQuery() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom("Big Project"),
		Status:                 models.SystemIntakeStatusLCIDISSUED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom("Firstname Lastname"),
		BusinessOwnerComponent: null.StringFrom("OIT"),
	})
	s.NoError(intakeErr)

	// Can't set a lifecycle ID when creating system intake, so we need to do this to set that
	// so we can then query for the system within the resolver
	lifecycleID, lcidErr := s.store.GenerateLifecycleID(ctx)
	s.NoError(lcidErr)
	intake.LifecycleID = null.StringFrom(lifecycleID)
	_, updateErr := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(updateErr)

	accessibilityRequest, requestErr := s.store.CreateAccessibilityRequest(ctx, &models.AccessibilityRequest{
		IntakeID: intake.ID,
	})
	s.NoError(requestErr)

	_, documentErr := s.store.CreateAccessibilityRequestDocument(ctx, &models.AccessibilityRequestDocument{
		RequestID:          accessibilityRequest.ID,
		Name:               "uploaded_doc.pdf",
		FileType:           "application/pdf",
		Size:               1234567,
		CommonDocumentType: models.AccessibilityRequestDocumentCommonTypeRemediationPlan,
		VirusScanned:       null.Bool{},
		VirusClean:         null.Bool{},
		Key:                "abcdefg1234567.pdf",
	})
	s.NoError(documentErr)

	var resp struct {
		AccessibilityRequest struct {
			Documents []struct {
				ID     string
				Status string
			}
		}
	}

	s.s3Client.AVStatus = "CLEAN"

	s.client.MustPost(fmt.Sprintf(
		`query {
			accessibilityRequest(id: "%s") {
				documents {
					id
					status
				}
			}
		}`, accessibilityRequest.ID), &resp)

	responseDocument := resp.AccessibilityRequest.Documents[0]
	s.Equal("AVAILABLE", responseDocument.Status)

	s.s3Client.AVStatus = "INFECTED"

	s.client.MustPost(fmt.Sprintf(
		`query {
			accessibilityRequest(id: "%s") {
				documents {
					id
					status
				}
			}
		}`, accessibilityRequest.ID), &resp)

	responseDocument = resp.AccessibilityRequest.Documents[0]
	s.Equal("UNAVAILABLE", responseDocument.Status)
}

func (s GraphQLTestSuite) TestGeneratePresignedUploadURLMutation() {
	var resp struct {
		GeneratePresignedUploadURL struct {
			URL        string
			UserErrors []struct {
				Message string
				Path    []string
			}
		}
	}

	s.client.MustPost(
		`mutation {
			generatePresignedUploadURL(input: {mimeType: "application/pdf", size: 512512, fileName: "test_file.pdf"}) {
				url
				userErrors {
					message
					path
				}
			}
		}`, &resp)

	s.Equal("https://signed.example.com/signed/put/123", resp.GeneratePresignedUploadURL.URL)
	s.Equal(0, len(resp.GeneratePresignedUploadURL.UserErrors))
}

func (s GraphQLTestSuite) TestCreateAccessibilityRequestDocumentMutation() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom("Big Project"),
		Status:                 models.SystemIntakeStatusLCIDISSUED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom("Firstname Lastname"),
		BusinessOwnerComponent: null.StringFrom("OIT"),
	})
	s.NoError(intakeErr)

	lifecycleID, lcidErr := s.store.GenerateLifecycleID(ctx)
	s.NoError(lcidErr)
	intake.LifecycleID = null.StringFrom(lifecycleID)
	_, updateErr := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(updateErr)

	accessibilityRequest, requestErr := s.store.CreateAccessibilityRequest(ctx, &models.AccessibilityRequest{
		IntakeID: intake.ID,
	})
	s.NoError(requestErr)

	var resp struct {
		CreateAccessibilityRequestDocument struct {
			AccessibilityRequestDocument struct {
				ID         string
				MimeType   string
				Name       string
				Status     string
				UploadedAt string
				RequestID  string
				Size       int
				URL        string
			}
			UserErrors []struct {
				Message string
				Path    []string
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			createAccessibilityRequestDocument(input: {
				mimeType: "application/pdf",
				size: 512512,
				name: "test_file.pdf",
				url: "http://localhost:9000/easi-test-bucket/e9eb4a4f-9100-416f-be5b-f141bb436cfa.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&",
				requestID: "%s",
				commonDocumentType: OTHER,
				otherDocumentTypeDescription: "My new document"
			}) {
				accessibilityRequestDocument {
					id
					mimeType
					name
					status
					uploadedAt
					requestID
					size
					url
				}
				userErrors {
					message
					path
				}
			}
		}`, accessibilityRequest.ID.String()), &resp)

	document := resp.CreateAccessibilityRequestDocument.AccessibilityRequestDocument

	s.NotEmpty(document.ID)
	s.Equal("application/pdf", document.MimeType)
	s.Equal("test_file.pdf", document.Name)
	s.Equal(512512, document.Size)
	s.Equal("PENDING", document.Status)
	s.NotEmpty(document.UploadedAt)
	s.Equal(accessibilityRequest.ID.String(), document.RequestID)
	s.Equal("https://signed.example.com/signed/get/123", document.URL)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeQuery() {
	ctx := context.Background()

	// ToDo: This whole test would probably be better as an integration test in pkg/integration, so we can see the real
	// functionality and not have to reinitialize all the services here
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom(projectName),
		Status:                 models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom(businessOwner),
		BusinessOwnerComponent: null.StringFrom(businessOwnerComponent),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID                     string
			ProjectName            string
			Status                 string
			RequestType            string
			BusinessOwner          string
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
				projectName
				status
				requestType
				businessOwner
				businessOwnerComponent
				businessNeed
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.Equal(projectName, resp.SystemIntake.ProjectName)
	s.Equal("INTAKE_SUBMITTED", resp.SystemIntake.Status)
	s.Equal("NEW", resp.SystemIntake.RequestType)
	s.Equal(businessOwner, resp.SystemIntake.BusinessOwner)
	s.Equal(businessOwnerComponent, resp.SystemIntake.BusinessOwnerComponent)
	s.Nil(resp.SystemIntake.BusinessNeed)
	s.Nil(resp.SystemIntake.BusinessCase)
}

func (s GraphQLTestSuite) TestFetchBusinessCaseForSystemIntakeQuery() {
	ctx := context.Background()

	// ToDo: This whole test would probably be better as an integration test in pkg/integration, so we can see the real
	// functionality and not have to reinitialize all the services here
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom(projectName),
		Status:                 models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom(businessOwner),
		BusinessOwnerComponent: null.StringFrom(businessOwnerComponent),
	})
	s.NoError(intakeErr)

	dev := models.LifecycleCostPhaseDEVELOPMENT
	oam := models.LifecycleCostPhaseOPERATIONMAINTENANCE
	other := models.LifecycleCostPhaseOTHER
	cost := 1234
	lifecycleCostLines := models.EstimatedLifecycleCosts{
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionASIS,
			Phase:    &dev,
			Year:     models.LifecycleCostYear1,
			Cost:     &cost,
		},
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionPREFERRED,
			Phase:    &oam,
			Year:     models.LifecycleCostYear2,
			Cost:     &cost,
		},
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionA,
			Phase:    &other,
			Year:     models.LifecycleCostYear3,
			Cost:     &cost,
		},
		models.EstimatedLifecycleCost{
			Solution: models.LifecycleCostSolutionB,
			Phase:    &dev,
			Year:     models.LifecycleCostYear4,
			Cost:     &cost,
		},
	}
	businessCase, businessCaseErr := s.store.CreateBusinessCase(ctx, &models.BusinessCase{
		SystemIntakeID:                      intake.ID,
		Status:                              models.BusinessCaseStatusOPEN,
		EUAUserID:                           "TEST",
		AlternativeAAcquisitionApproach:     null.StringFrom("Aquisition Approach"),
		AlternativeACons:                    null.StringFrom("Cons"),
		AlternativeACostSavings:             null.StringFrom("Savings"),
		AlternativeAHasUI:                   null.StringFrom("Has UI"),
		AlternativeAHostingCloudServiceType: null.StringFrom("Cloud Type"),
		AlternativeAHostingLocation:         null.StringFrom("Hosting Location"),
		AlternativeAHostingType:             null.StringFrom("Hosting Type"),
		AlternativeAPros:                    null.StringFrom("Pros"),
		AlternativeASecurityIsApproved:      null.BoolFrom(true),
		AlternativeASecurityIsBeingReviewed: null.StringFrom("Being Reviewed"),
		AlternativeASummary:                 null.StringFrom("Summary"),
		AlternativeATitle:                   null.StringFrom("Title"),
		LifecycleCostLines:                  lifecycleCostLines,
	})
	s.NoError(businessCaseErr)

	var resp struct {
		SystemIntake struct {
			ID           string
			BusinessCase struct {
				ID                   string
				AlternativeASolution struct {
					AcquisitionApproach     string
					Cons                    string
					CostSavings             string
					HasUI                   string
					HostingCloudServiceType string
					HostingLocation         string
					HostingType             string
					Pros                    string
					SecurityIsApproved      bool
					SecurityIsBeingReviewed string
					Summary                 string
					Title                   string
				}
				LifecycleCostLines []struct {
					ID             string
					BusinessCaseID string
					Solution       string
					Phase          string
					Year           string
					Cost           int
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
				businessCase { 
					id
					alternativeASolution {
						acquisitionApproach
						cons
						costSavings
						hasUi
						hostingCloudServiceType
						hostingLocation
						hostingType
						pros
						securityIsApproved
						securityIsBeingReviewed
						summary
						title
					}
					lifecycleCostLines {
						cost
						phase
						solution
						year
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	respBusinessCase := resp.SystemIntake.BusinessCase
	s.Equal(businessCase.ID.String(), respBusinessCase.ID)

	respAlternativeA := respBusinessCase.AlternativeASolution
	s.Equal(respAlternativeA.AcquisitionApproach, "Aquisition Approach")
	s.Equal(respAlternativeA.Cons, "Cons")
	s.Equal(respAlternativeA.CostSavings, "Savings")
	s.Equal(respAlternativeA.HasUI, "Has UI")
	s.Equal(respAlternativeA.HostingCloudServiceType, "Cloud Type")
	s.Equal(respAlternativeA.HostingLocation, "Hosting Location")
	s.Equal(respAlternativeA.HostingType, "Hosting Type")
	s.Equal(respAlternativeA.Pros, "Pros")
	s.True(respAlternativeA.SecurityIsApproved)
	s.Equal(respAlternativeA.SecurityIsBeingReviewed, "Being Reviewed")
	s.Equal(respAlternativeA.Summary, "Summary")
	s.Equal(respAlternativeA.Title, "Title")

	respLifeCycleCostLines := respBusinessCase.LifecycleCostLines
	s.Len(respLifeCycleCostLines, 4)
	s.Equal(respLifeCycleCostLines[0].Cost, 1234)
	s.Equal(respLifeCycleCostLines[0].Phase, "Development")
	s.Equal(respLifeCycleCostLines[0].Solution, "As Is")
	s.Equal(respLifeCycleCostLines[0].Year, "1")

	s.Equal(respLifeCycleCostLines[1].Cost, 1234)
	s.Equal(respLifeCycleCostLines[1].Phase, "Operations and Maintenance")
	s.Equal(respLifeCycleCostLines[1].Solution, "Preferred")
	s.Equal(respLifeCycleCostLines[1].Year, "2")

	s.Equal(respLifeCycleCostLines[2].Cost, 1234)
	s.Equal(respLifeCycleCostLines[2].Phase, "Other")
	s.Equal(respLifeCycleCostLines[2].Solution, "A")
	s.Equal(respLifeCycleCostLines[2].Year, "3")

	s.Equal(respLifeCycleCostLines[3].Cost, 1234)
	s.Equal(respLifeCycleCostLines[3].Phase, "Development")
	s.Equal(respLifeCycleCostLines[3].Solution, "B")
	s.Equal(respLifeCycleCostLines[3].Year, "4")
}
