package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/alecthomas/jsonschema"

	"github.com/cmsgov/easi-app/pkg/cedar/intake"
	"github.com/cmsgov/easi-app/pkg/cedar/intake/models"
)

func generateSchema(object interface{}, version intake.SchemaVersion, filename string) {
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
	generateSchema(models.EASIAction{}, intake.IntakeInputSchemaEASIActionV01, "easi_action.json")

	// includes business solution and lifecycle cost as sub-items
	generateSchema(models.EASIBizCase{}, intake.IntakeInputSchemaEASIBizCaseV01, "easi_business_case.json")

	generateSchema(models.EASIGrtFeedback{}, intake.IntakeInputSchemaEASIGrtFeedbackV01, "easi_grt_feedback.json")
	generateSchema(models.EASIIntake{}, intake.IntakeInputSchemaEASIIntakeV01, "easi_system_intake.json")
	generateSchema(models.EASINote{}, intake.IntakeInputSchemaEASINoteV01, "easi_note.json")
}
