// Package test is for test CLI tool execution logic
package test

import (
	"log"
	"os"
	"os/exec"
)

// All runs the full test suite
func All() {
	Server()
}

// Server runs only server tests (Go)
func Server() {
	// I poked around with this for a bit
	// and didn't find a way to execute without shelling out
	// It might be an uncommon case
	// Will look again
	c := exec.Command(
		"go",
		"test",
		"-cover",
		"./pkg/...")
	// Replace with some sort of configured writer
	c.Stdout = os.Stdout
	c.Stderr = os.Stderr
	err := c.Run()
	if err != nil {
		log.Fatalf("Fail %v", err)
	}
}
