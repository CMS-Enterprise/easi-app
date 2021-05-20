package storage

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/guregu/null"

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s StoreTestSuite) TestListSystems() {
	// random-based signatures, just so multiple runs of this test don't collide
	now := time.Now()
	later := now.AddDate(0, 1, 0)
	// #nosec G404
	rnd := rand.New(rand.NewSource(now.Unix()))
	base := make([]byte, 8)
	_, err := rnd.Read(base)
	s.NoError(err)
	sig := fmt.Sprintf("%x", base)
	fid := rnd.Intn(100000)

	// setup construction
	ctx := context.Background()
	expected := map[string]bool{}

	// build a number of system intakes we expect to be seen as Systems
	for ix := 0; ix < 3; ix++ {
		lcid := fmt.Sprintf("Z%05d%d", fid, ix) // e.g. "Z987650"
		// t.Logf("%d: %s\n", ix, lcid)
		expected[lcid] = true

		// set the CreatedAt and UpdatedAt with a "real" date, because the
		// testing fake clock used by `CreateSystemIntake` frequently
		// supplies dates AFTER year 9999, which makes
		// json.Marshal() freak out.
		si := testhelpers.NewSystemIntake()
		si.CreatedAt = &now
		si.UpdatedAt = &now
		si.ProjectName = null.StringFrom(fmt.Sprintf("%s %d", sig, ix))
		if ix%2 == 1 {
			// this simulates some of the backfill data in PROD that
			// was imported without an EUAUserID
			si.EUAUserID = null.StringFromPtr(nil)
		}
		_, err = s.store.CreateSystemIntake(ctx, &si)
		s.NoError(err)

		partial, ferr := s.store.FetchSystemIntakeByID(ctx, si.ID)
		s.NoError(ferr)

		partial.LifecycleID = null.StringFrom(lcid)
		partial.Status = models.SystemIntakeStatusLCIDISSUED
		partial.DecidedAt = &now
		partial.LifecycleExpiresAt = &later

		_, err = s.store.UpdateSystemIntake(ctx, partial)
		s.NoError(err, "failed to update system intake")
		// t.Logf("%s: %s - %s\n", lcid, si.ID.String(), partial.LifecycleScope.String)
	}

	// junk data to test an SQL error:
	// "sql: Scan error on column index 0, name "lcid": converting NULL to string is unsupported"
	{
		si := testhelpers.NewSystemIntake()
		si.CreatedAt = &now
		si.UpdatedAt = &now
		si.Status = models.SystemIntakeStatusLCIDISSUED
		si.ProjectName = null.StringFrom(fmt.Sprintf("%s %d", sig, -1))
		_, err = s.store.CreateSystemIntake(ctx, &si)
		s.NoError(err)
	}

	// retrieve the list of systems
	results, err := s.store.listSystems(ctx)
	s.NoError(err)

	// verify the list of Systems that we seeded came back to us
	found := 0
	for _, result := range results {
		s.NotEqual(result.ID, uuid.Nil) // ensure we populate with a real IntakeID
		if _, exp := expected[result.LCID]; !exp {
			// unexpected collision from previously existing data,
			// possibly from previous runs of this test
			continue
		}
		found++
	}
	s.Equal(found, len(expected), "did not retrieve the expected amound of Systems")
}
