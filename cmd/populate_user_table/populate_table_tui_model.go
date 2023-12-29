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
}
type genericExampleOption struct {
	CommandRun  func()
	CommandName string
}

func (geo genericExampleOption) Run() tea.Msg {
	geo.CommandRun()
	return cmdFinishedMsg{}
}
func (geo genericExampleOption) Name() string {
	return geo.CommandName
}
func (geo genericExampleOption) String() string {
	return geo.Name()
}

type populateUserTableTuiModel struct {
	options  []commandOption
	cursor   int                   // which command option our cursor is pointing at
	selected map[int]commandOption // which command options are selected
	err      error
}

func newPopulateUserTableModel() populateUserTableTuiModel {

	return populateUserTableTuiModel{
		options: []commandOption{
			genericExampleOption{
				CommandName: "Query User Names and Export to file",
				CommandRun:  func() { queryUserNameCmd.Run(queryUserNameCmd, []string{}) },
			},
			genericExampleOption{
				CommandName: "Query Full Names and Export to file",
				CommandRun:  func() { queryFullNameCmd.Run(queryFullNameCmd, []string{}) },
			},
			genericExampleOption{
				CommandName: "Generate User Accounts By User Name List",
				CommandRun:  func() { generateUserAccountByUsernameCmd.Run(generateUserAccountByUsernameCmd, []string{}) },
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
			//TODO, maybe we need to clear the screen first? This looks weird going from example to example
			for _, example := range tm.selected {
				tea.SetWindowTitle(example.Name())

				return tm, func() tea.Msg { return example.Run() }

			}

			// return tm,
			// //TODO, make this render better when it the other program ends execution
			// _ = tea.ClearScreen()

		}
	case cmdFinishedMsg:
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
