package timing

import "github.com/go-co-op/gocron/v2"

var (
	// Every 5 seconds
	// This is a cron expression that runs every 5 seconds
	Every5Seconds = gocron.CronJob("*/5 * * * * *", true)
	// DailyAt2AM is a cron expression that runs every day at 2 AM
	DailyAt2AM = gocron.CronJob("0 2 * * *", false)
)
