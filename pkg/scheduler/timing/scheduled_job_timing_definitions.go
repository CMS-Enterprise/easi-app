package timing

import "github.com/go-co-op/gocron/v2"

var (
	// Every5Seconds is a cron expression that will run every 5 seconds, useful for testing
	Every5Seconds = gocron.CronJob("*/5 * * * * *", true)

	// DailyAt2AM is a cron expression that runs every day at 2 AM
	DailyAt2AM = gocron.CronJob("0 2 * * *", false)

	// DailyAt1001PM is a cron expression that runs every day at 10:01PM UTC (22:01)
	// it is minute-specific in order to send notifications out just after GRB reviews close (which is 5pm EST)
	DailyAt1001PM = gocron.CronJob("1 22 * * *", false)
)
