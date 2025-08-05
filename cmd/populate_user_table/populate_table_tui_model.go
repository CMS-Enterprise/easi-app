package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
)

type cmdFinishedMsg struct{ err error }

type commandOption interface {
	Run() tea.Msg
	Name() string
	String() string
	LastCMDMessage() string
}
type genericCommandOption struct {
	CommandRun  func()
	CommandName string
}

func (geo genericCommandOption) Run() tea.Msg {
	geo.CommandRun()
	return cmdFinishedMsg{}
}
func (geo genericCommandOption) Name() string {
	return geo.CommandName
}
func (geo genericCommandOption) String() string {
	return geo.Name()
}
func (geo genericCommandOption) LastCMDMessage() string {
	return "Ran " + geo.Name()
}

type populateUserTableTuiModel struct {
	options  []commandOption
	cursor   int                   // which command option our cursor is pointing at
	selected map[int]commandOption // which command options are selected
	err      error
	lastCmnd string
}

func newPopulateUserTableModel() populateUserTableTuiModel {

	return populateUserTableTuiModel{
		options: []commandOption{
			genericCommandOption{
				CommandName: "Query User Names and Export to file",
				CommandRun:  func() { queryUserNameCmd.Run(queryUserNameCmd, []string{}) },
			},
			genericCommandOption{
				CommandName: "Query Full Names and Export to file",
				CommandRun:  func() { queryFullNameCmd.Run(queryFullNameCmd, []string{}) },
			},
			genericCommandOption{
				CommandName: "Query system intake contact Common Names and Export to file",
				CommandRun:  func() { queryContactCommonNameCmd.Run(queryContactCommonNameCmd, []string{}) },
			},
			genericCommandOption{
				CommandName: "Generate User Accounts By User Name List",
				CommandRun:  func() { generateUserAccountByUsernameCmd.Run(generateUserAccountByUsernameCmd, []string{}) },
			},
			genericCommandOption{
				CommandName: "Generate User Accounts By Full Name List",
				CommandRun:  func() { generateUserAccountByDisplayNameCmd.Run(generateUserAccountByDisplayNameCmd, []string{}) },
			},
		},
		// A map which indicates which choices are selected. We're using
		// the  map like a mathematical set. The keys refer to the indexes
		// of the `choices` slice, above.
		selected: make(map[int]commandOption),
	}
}

func (tm populateUserTableTuiModel) Init() tea.Cmd {
	return nil
}

func (tm populateUserTableTuiModel) View() string {
	// The header
	s := "Which commands would you like to execute?\n\n"
	if tm.lastCmnd != "" {
		s += fmt.Sprintf("%s\n\n", tm.lastCmnd)
	}

	// Iterate over our options
	for i, option := range tm.options {

		// Is the cursor pointing at this choice?
		cursor := " " // no cursor
		if tm.cursor == i {
			cursor = ">" // cursor!
		}

		// Is this choice selected?
		checked := " " // not selected
		if _, ok := tm.selected[i]; ok {
			checked = "x" // selected!
		}

		// Render the row
		s += fmt.Sprintf("%s [%s] %s\n", cursor, checked, option)
	}

	// The footer
	s += "\nPress q to quit.\n"

	// Send the UI for rendering
	return s
}

func (tm populateUserTableTuiModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	// Is it a key press?
	case tea.KeyMsg:

		// Cool, what was the actual key pressed?
		switch msg.String() {

		// These keys should exit the program.
		case "ctrl+c", "q":
			return tm, tea.Quit

		// The "up" and "k" keys move the cursor up
		case "up", "k":
			if tm.cursor > 0 {
				tm.cursor--
			}

		// The "down" and "j" keys move the cursor down
		case "down", "j":
			if tm.cursor < len(tm.options)-1 {
				tm.cursor++
			}

		// The spacebar (a literal space) toggle
		// the selected state for the item that the cursor is pointing at.
		case " ":
			_, ok := tm.selected[tm.cursor]
			if ok {
				delete(tm.selected, tm.cursor)
			} else {
				tm.selected[tm.cursor] = tm.options[tm.cursor]
			}
		// The "enter" key
		case "enter":
			for _, command := range tm.selected {
				tea.SetWindowTitle(command.Name())
				if tm.lastCmnd != "" {
					tm.lastCmnd = tm.lastCmnd + "\n"
				}
				tm.lastCmnd += command.LastCMDMessage()
				command.Run()
				// return tm, func() tea.Msg { return example.Run() }

			}
			return tm, func() tea.Msg {
				return cmdFinishedMsg{}
			}

		}
	case cmdFinishedMsg:
		// Clear the screen when the message is received
		if msg.err != nil {
			tm.err = msg.err
			return tm, tea.Quit
		}
		return tm, tea.ClearScreen
	}

	return tm, nil

}

// RunPopulateUserTableTUIModel runs the interactive tui version of the command
func RunPopulateUserTableTUIModel() {

	if _, err := tea.NewProgram(newPopulateUserTableModel()).Run(); err != nil {

		fmt.Printf("There was an error: %v\n", err)
		os.Exit(1)
	}

}
