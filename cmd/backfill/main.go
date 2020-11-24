package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
)

const (
	envFile     = "BACKFILL_FILE"
	envHost     = "BACKFILL_HOST"
	healthcheck = "https://%s/api/v1/healthcheck"
)

type config struct {
	file string
	host string
}

func main() {
	cfg := &config{
		file: os.Getenv(envFile),
		host: os.Getenv(envHost),
	}

	if err := execute(cfg); err != nil {
		fmt.Fprintf(os.Stderr, "backfill failure: %v\n", err)
		os.Exit(1)
	}
}

func execute(cfg *config) error {
	url := fmt.Sprintf(healthcheck, cfg.host)
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

	errs := []error{}
	for err != nil {
		row, err = src.Read()
		if err != nil {
			continue
		}
		intake, rErr := convert(row)
		if err != nil {
			errs = append(errs, rErr)
			continue
		}
		if rErr := upload(cfg.host, intake); rErr != nil {
			errs = append(errs, rErr)
		}
	}
	if len(errs) != 0 {
		return fmt.Errorf("problems processing file: %v", errs)
	}
	return nil
}

func upload(host string, intake *models.SystemIntake) error {
	body, err := json.MarshalIndent(intake, "", "\t")
	if err != nil {
		return err
	}
	fmt.Fprintf(os.Stdout, "%s\n", body)
	return nil
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
	colCEndM   = 23 // W
	colCEndY   = 24 // X
)

type entry struct {
	Intake models.SystemIntake `json:"intake"`
	Notes  []models.Note       `json:"notes"`
}

func convert(row []string) (*entry, error) {
	data := &entry{}

	// labelled "Request Date"
	if dt, err := convertDate(row[colDate]); err == nil {
		data.Intake.CreatedAt = dt
	} else {
		return nil, err
	}

	// TODO: "Final" / "Final-Admin" / "Draft"
	_ = colStatus

	// labeled "Project Name"
	data.Intake.ProjectName = null.StringFrom(row[colName])

	// we now have a place for Acronym
	data.Intake.ProjectAcronym = null.StringFrom(row[colAcronym])

	data.Intake.Component = null.StringFrom(row[colComponent])

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

	// TODO: do we have a place for these fields
	_ = colAdminLead // person's name
	_ = colGRTNotes  // free-form text, maybe on coming `models.Note` object?!?

	// sorted - LCIDs in spreadsheet frequently have a 1 character ALPHA prefix
	data.Intake.LifecycleID = null.StringFrom(row[colLCID])
	data.Intake.LifecycleScope = null.StringFrom(row[colLCIDScope])

	// labelled "LCID Expires"
	if dt, err := convertDate(row[colLCIDExp]); err == nil {
		data.Intake.LifecycleExpiresAt = dt
	} else {
		return nil, err
	}

	// TODO - labelled "Created By", string literal names, options:
	// * pass to back-end to turn into EUA_IDs
	// * manually fill out EUA_IDs in a new column?
	intake.Requester = row[colCreatedBy] // TODO - Omit per HP
	// intake.EUAUserID = row[colEUAID]

	// TODO - labelled "CMS Project Manager"
	// example entry - "Carlos Borges Martinez;#435"
	// is "#435" representative of their "component?"
	prjs := strings.Split(";", row[colProjectMgr])
	intake.ProductManager = null.StringFrom(prjs[0])
	intake.ProductManagerComponent = null.StringFrom(prjs[1]) // TODO: de-reference somehow? on server-side?

	// TODO - labelled "Business Owner"
	// example entry - "Carlos Borges Martinez;#435"
	// is "#435" representative of their "component?"
	bizs := strings.Split(";", row[colBizOwn])
	intake.BusinessOwner = null.StringFrom(bizs[0])
	intake.BusinessOwnerComponent = null.StringFrom(bizs[1]) // TODO: de-reference somehow? on server-side?

	// TODO - labelled "Project #" - what does this map to?
	// usually: "000120"; occaisonally: "001595, 000102, 002014", "FY20-000792,  FY-2021: 000787 and 000924"
	intake.FundingNumber = null.StringFrom(row[colPrjNum]) // TODO - correct?

	intake.FundingSource = null.StringFrom(row[colFundSrc])
	intake.CostIncrease = null.StringFrom(row[colCostFree]) // TODO - correct mapping?
	intake.Contractor = null.StringFrom(row[colContractor])
	intake.ContractVehicle = null.StringFrom(row[colVehicle])

	// TODO - how to parse? "Period of Performance"
	// e.g. "Nov 30, 2020 to Nov 29, 2024"; "current 4/1/2016 - 3/31/2021  extend 3 months to 6/30/2021"
	// manual?!?
	intake.ContractStartMonth = _
	intake.ContractStartYear = _
	intake.ContractEndMonth = _
	intake.ContractEndYear = _

	// SEND IT BACK!
	return intake, nil
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
