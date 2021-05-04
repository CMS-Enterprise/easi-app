package graph

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/client"
	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql

	"github.com/cmsgov/easi-app/pkg/appcontext"
	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s GraphQLTestSuite) TestAccessibilityRequestQuery() {
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
		IntakeID:  intake.ID,
		EUAUserID: "ABCD",
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
		IntakeID:  intake.ID,
		EUAUserID: "ABCD",
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
	ctx := appcontext.WithPrincipal(context.Background(), testhelpers.New508AdminPrincipal())

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
		IntakeID:  intake.ID,
		EUAUserID: "ABCD",
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

	fakeToken := `
	{
		"claims":{
			"groups":["EASI_D_508_USER"]
		}
	}
	`

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
		}`, accessibilityRequest.ID.String()),
		&resp,
		client.AddHeader("Authorization", fmt.Sprintf("Bearer %s", fakeToken)),
	)

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
