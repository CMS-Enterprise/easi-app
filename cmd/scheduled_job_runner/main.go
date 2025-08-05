package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"sort"

	"github.com/cms-enterprise/easi-app/pkg/appcontext"
	"github.com/cms-enterprise/easi-app/pkg/scheduler"
	"go.uber.org/zap"
)

func main() {
	jobName := flag.String("job", "", "The name of the scheduled job to run manually")
	listJobs := flag.Bool("list", false, "List all available scheduled jobs")
	flag.Parse()

	logger, err := zap.NewDevelopment()
	if err != nil {
		log.Fatalf("Failed to create logger: %v", err)
	}
	ctx := context.Background()
	ctx = appcontext.WithLogger(ctx, logger)

	s, err := scheduler.NewScheduler(false)
	if err != nil {
		log.Fatalf("❌ Failed to create scheduler: %v", err)
	}

	// Handle --list flag
	if *listJobs {
		printAvailableJobs(s)
		return
	}

	// Handle -job flag
	if *jobName == "" {
		fmt.Println("❌ Please provide a job name with -job or use --list to see available jobs.")
		os.Exit(1)
	}

	registerFunc, ok := s.Registry()[*jobName]
	if !ok {
		fmt.Printf("❌ No job named '%s' found in the scheduler registry\n", *jobName)
		os.Exit(1)
	}

	job, err := registerFunc(ctx)
	if err != nil {
		fmt.Printf("❌ Failed to register job '%s': %v\n", *jobName, err)
		os.Exit(1)
	}

	if err := job.Run(); err != nil {
		fmt.Printf("❌ Failed to run job '%s': %v\n", *jobName, err)
		os.Exit(1)
	}

	fmt.Printf("✅ Job '%s' ran successfully\n", *jobName)
}

func printAvailableJobs(s *scheduler.Scheduler) {
	fmt.Println("Available scheduled jobs:")
	var keys []string
	for name := range s.Registry() {
		keys = append(keys, name)
	}
	sort.Strings(keys)
	for _, name := range keys {
		fmt.Printf("  - %s\n", name)
	}
}
