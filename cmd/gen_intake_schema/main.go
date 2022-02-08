package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/alecthomas/jsonschema"

	intakemodels "github.com/cmsgov/easi-app/pkg/cedar/intake/models"
	"github.com/cmsgov/easi-app/pkg/cedar/intake/translation"
)

func generateSchema(object interface{}, version translation.SchemaVersion, filename string) {
	schema := jsonschema.Reflect(object)
	schema.Title = string(version)

	marshaledSchema, err := schema.MarshalJSON()
	if err != nil {
		fmt.Println("Error marshaling schema")
		fmt.Println(err)
		return
	}

	var prettyJSON bytes.Buffer
	err = json.Indent(&prettyJSON, marshaledSchema, "", "  ")
	if err != nil {
		fmt.Println("Error pretty-printing JSON")
		fmt.Println(err)
		return
	}

	pathToSchemaFolder := filepath.Join("pkg", "cedar", "intake", "schemas")
	schemaFilename := filepath.Join(pathToSchemaFolder, filename)

	err = os.WriteFile(schemaFilename, prettyJSON.Bytes(), 0600)
	if err != nil {
		fmt.Println("Error writing schema")
		fmt.Println(err)
	}
}

// Include one of each root object defined in pkg/cedar/intake/models

// Note for future devs: the go/types package could be used to extract static type information on each file in that directory,
// but there's no way to convert a types.Type to the reflect.Type that the jsonschema package could use.
func main() {
	generateSchema(intakemodels.EASIAction{}, translation.IntakeInputSchemaEASIActionV01, "easi_action.json")

	// includes business solution and lifecycle cost as sub-items
	generateSchema(intakemodels.EASIBizCase{}, translation.IntakeInputSchemaEASIBizCaseV01, "easi_business_case.json")

	generateSchema(intakemodels.EASIGrtFeedback{}, translation.IntakeInputSchemaEASIGrtFeedbackV01, "easi_grt_feedback.json")
	generateSchema(intakemodels.EASIIntake{}, translation.IntakeInputSchemaEASIIntakeV01, "easi_system_intake.json")
	generateSchema(intakemodels.EASINote{}, translation.IntakeInputSchemaEASINoteV01, "easi_note.json")
}
