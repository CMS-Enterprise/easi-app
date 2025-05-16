package timing

import "github.com/go-co-op/gocron/v2"

var (
	// Every5Seconds is a cron expression that will run every 5 seconds, useful for testing
	Every5Seconds = gocron.CronJob("*/5 * * * * *", true)

	// DailyAt2AM is a cron expression that runs every day at 2 AM
	DailyAt2AM = gocron.CronJob("0 2 * * *", false)

	// DailyAt10_01PMUTC is a cron expression that runs every day at 10:01PM UTC (22:01)
	// It is minute-specific in order to send notifications out just after GRB reviews close (which is 5pm EST)
	DailyAt10_01PMUTC = gocron.CronJob("1 22 * * *", false)

	// DailyAt1PMUTC is a cron expression that runs every day at 1 PM UTC (13:00) which is 9 AM EST
	DailyAt1PMUTC = gocron.CronJob("0 13 * * *", false)
)
