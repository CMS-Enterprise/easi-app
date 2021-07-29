package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	envFile     = "BACKFILL_FILE"
	envHost     = "BACKFILL_HOST"
	envAuth     = "BACKFILL_AUTH"
	envDrop     = "BACKFILL_DROP"
	healthcheck = "%s/api/v1/healthcheck"
)

type config struct {
	file string
	host string
	auth string
}

func main() {
	cfg := &config{
		file: os.Getenv(envFile),
		host: os.Getenv(envHost),
		auth: os.Getenv(envAuth),
	}
	if err := execute(cfg); err != nil {
		fmt.Fprintf(os.Stdout, "backfill failure: %v\n", err)
		os.Exit(1)
	}
}

func execute(cfg *config) error {
	url := fmt.Sprintf(healthcheck, cfg.host)

	/* #nosec G107 */
	if _, err := http.Get(url); err != nil {
		return fmt.Errorf("failed healthcheck for [%s]: %w", url, err)
	}

	f, err := os.Open(cfg.file)
	if err != nil {
		return err
	}
	src := csv.NewReader(f)
	row, err := src.Read()
	if err != nil {
		return fmt.Errorf("failed to read column headers for [%s]: %w", cfg.file, err)
	}
	// fmt.Fprintf(os.Stdout, "headers: %v\n", row)
	_ = row
	rowCount := 0
	createCount := 0
	updateCount := 0

	errs := []error{}
	for err == nil {
		row, err = src.Read()
		if err != nil {
			if err != io.EOF {
				errs = append(errs, err)
			}
			continue
		}
		rowCount++
		item, rErr := convert(row)
		if rErr != nil {
			errs = append(errs, rErr)
			continue
		}
		if item == nil {
			continue
		}
		create, rErr := upload(cfg.host, cfg.auth, item)
		if rErr != nil {
			errs = append(errs, rErr)
		}
		if create {
			createCount++
		} else {
			updateCount++
		}
	}

	fmt.Printf("%d rows processed with %d errors.\n%d creates and %d updates.\n\n", rowCount, len(errs), createCount, updateCount)

	if len(errs) != 0 {
		fmt.Fprintf(os.Stdout, "problems processing file: %v", errs)
		return fmt.Errorf("problems processing file: %v", errs)
	}
	return nil
}

func upload(host string, auth string, item *entry) (didCreate bool, err error) {
	body, err := json.MarshalIndent(item, "", "\t")
	if err != nil {
		return false, err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/api/v1/backfill", host), bytes.NewReader(body))
	if err != nil {
		return false, err
	}

	if ok, perr := strconv.ParseBool(os.Getenv(envDrop)); ok && perr == nil {
		req, err = http.NewRequest("DELETE", fmt.Sprintf("%s/api/v1/system_intake/%s?remove=true", host, item.Intake.ID.String()), nil)
		if err != nil {
			return false, err
		}
	}

	req.Header.Add("Authorization", auth)
	// req.Write(os.Stdout)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return false, fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()
	content, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("could not read reasponse: %v", err)
	}

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusCreated {
		return false, fmt.Errorf("%s; expected 201/204; got %d; body %s", item.Intake.ID.String(), resp.StatusCode, content)
	}

	var message string
	if resp.StatusCode == http.StatusCreated {
		message = "created"
	} else {
		message = "updated"
	}
	fmt.Fprintf(os.Stdout, "%s %s\n", message, item.Intake.LifecycleID.String)
	return resp.StatusCode == http.StatusCreated, nil
}

const (
	colUUID       = 25 // Z
	colDate       = 0  // A
	colStatus     = 1  // B
	colName       = 2  // C
	colAcronym    = 3  // D
	colComponent  = 4  // E
	colAdminLead  = 5  // F
	colGRTDate    = 6  // G
	colGRBDate    = 7  // H
	colGRTNotes   = 8  // I
	colLCID       = 9  // J
	colLCIDScope  = 10 // K
	colLCIDExp    = 11 // L
	colCreatedBy  = 12 // M
	colProjectMgr = 13 // N
	colBizOwn     = 14 // O
	colPrjNum     = 15 // P

	colFundSrc    = 16 // Q
	colCostFree   = 17 // R
	colContractor = 18 // S
	colVehicle    = 19 // T
	colPeriod     = 20 // U

	colCStartM = 21 // V
	colCStartY = 22 // W
	colCEndM   = 23 // X
	colCEndY   = 24 // Y
)

type entry struct {
	Intake models.SystemIntake `json:"intake"`
	Notes  []models.Note       `json:"notes"`
}

func convert(row []string) (*entry, error) {
	data := &entry{}

	// UUIDs were manually created on the spreadsheet
	id, err := uuid.Parse(row[colUUID])
	if err != nil {
		// no uuid in the data, so send all zeros.
		id = uuid.Nil
	}
	data.Intake.ID = id

	// skipping items that were marked as "Draft" in the spreadsheet
	if strings.EqualFold("draft", row[colStatus]) {
		fmt.Fprintf(os.Stdout, "skipping %v: status - %s\n", id, row[colStatus])
		return nil, nil
	}
	data.Intake.Status = models.SystemIntakeStatusCLOSED

	// labelled "Request Date"
	if dt, err := convertDate(row[colDate]); err == nil {
		data.Intake.CreatedAt = dt
		data.Intake.SubmittedAt = dt
	} else {
		return nil, err
	}

	// we now have a place for Acronym
	data.Intake.ProjectAcronym = null.StringFrom(row[colAcronym])
	data.Intake.ProjectName = null.StringFrom(row[colName])
	data.Intake.BusinessOwnerComponent = null.StringFrom(row[colComponent])

	if row[colGRTDate] != "" {
		if dt, err := convertDate(row[colGRTDate]); err == nil {
			data.Intake.GRTDate = dt
		} else {
			return nil, err
		}
	}

	if row[colGRBDate] != "" {
		if dt, err := convertDate(row[colGRBDate]); err == nil {
			data.Intake.GRBDate = dt
		} else {
			return nil, err
		}
	}

	// some rows contain various non-LCID values such as "n/a", so we'll only include the LCID
	// columns if there is a valid LCID
	if match, matchErr := regexp.MatchString(`^\w?\d{6}$`, row[colLCID]); match && matchErr == nil {
		// LCIDs in spreadsheet frequently have a 1 character ALPHA prefix
		data.Intake.LifecycleID = null.StringFrom(row[colLCID])
		data.Intake.LifecycleScope = null.StringFrom(row[colLCIDScope])
	} else {
		return nil, errors.New("no lcid for intake")
	}

	// labelled "LCID Expires"
	if dt, err := convertDate(row[colLCIDExp]); err == nil {
		data.Intake.LifecycleExpiresAt = dt
	} else {
		return nil, err
	}

	// TODO - labelled "Created By", string literal names, options:
	// * pass to back-end to turn into EUA_IDs
	// * manually fill out EUA_IDs in a new column?
	data.Intake.Requester = row[colCreatedBy]

	// TODO - labelled "CMS Project Manager"
	// example entry - "Carlos Borges Martinez;#435"
	// is "#435" representative of their "component?"
	data.Intake.ProductManager = null.StringFrom(row[colProjectMgr])

	// TODO - labelled "Business Owner"
	// example entry - "Carlos Borges Martinez;#435"
	// is "#435" representative of their "component?"
	data.Intake.BusinessOwner = null.StringFrom(row[colBizOwn])

	// TODO - labelled "Project #" - what does this map to?
	// usually: "000120"; occaisonally: "001595, 000102, 002014", "FY20-000792,  FY-2021: 000787 and 000924"
	data.Intake.FundingNumber = null.StringFrom(row[colPrjNum])
	data.Intake.FundingSource = null.StringFrom(row[colFundSrc])
	if row[colPrjNum] != "" || row[colFundSrc] != "" {
		data.Intake.ExistingFunding = null.BoolFrom(true)
	} else {
		data.Intake.ExistingFunding = null.BoolFrom(false)
	}

	data.Intake.Contractor = null.StringFrom(row[colContractor])
	data.Intake.ContractVehicle = null.StringFrom(row[colVehicle])
	data.Intake.ContractStartMonth = null.StringFrom(row[colCStartM])
	data.Intake.ContractStartYear = null.StringFrom(row[colCStartY])
	data.Intake.ContractEndMonth = null.StringFrom(row[colCEndM])
	data.Intake.ContractEndYear = null.StringFrom(row[colCEndY])

	if row[colContractor] != "" || row[colVehicle] != "" ||
		row[colCStartM] != "" || row[colCStartY] != "" ||
		row[colCEndM] != "" || row[colCEndY] != "" {
		data.Intake.ExistingContract = null.StringFrom("HAVE_CONTRACT")
	} else {
		data.Intake.ExistingContract = null.StringFrom("NOT_NEEDED")
	}

	data.Intake.AdminLead = null.StringFrom(row[colAdminLead])

	if row[colGRTNotes] != "" {
		data.Notes = append(data.Notes, models.Note{
			Content:    null.StringFrom(row[colGRTNotes]),
			AuthorName: null.StringFrom(row[colAdminLead]),
		})
	}

	if row[colPeriod] != "" {
		data.Notes = append(data.Notes, models.Note{
			Content:    null.StringFrom(fmt.Sprintf("Period of Performance - %s", row[colPeriod])),
			AuthorName: null.StringFrom(row[colAdminLead]),
		})
	}

	if row[colCostFree] != "" {
		data.Notes = append(data.Notes, models.Note{
			Content:    null.StringFrom(fmt.Sprintf("Anticipated Cost Increase - %s", row[colCostFree])),
			AuthorName: null.StringFrom(row[colAdminLead]),
		})
	}

	// SEND IT BACK!
	return data, nil
}

func convertDate(in string) (*time.Time, error) {
	if in == "" {
		return nil, nil
	}
	t, err := time.Parse("1/2/2006", in)
	if err != nil {
		return nil, fmt.Errorf("unable to parse [%s]: %w", in, err)
	}
	return &t, nil
}
