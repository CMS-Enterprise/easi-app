package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"

	"github.com/alecthomas/jsonschema"

	"github.com/cmsgov/easi-app/pkg/cedar/intake/models"
)

// EASIObject represents all possible types of objects that can be sent to CEDAR from EASi
type EASIObject struct {
}

func createRefTypeToDefinition(defName string) *jsonschema.Type {
	return &jsonschema.Type{
		Ref: fmt.Sprint("#/definitions/", defName),
	}
}

func writeSchemaToFile(schema *jsonschema.Schema) {
	schemaFileName := "cedar_intake_schema.json"
	fullFileName := filepath.Join("pkg", "cedar", "intake", schemaFileName)

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

	err = os.WriteFile(fullFileName, prettyJSON.Bytes(), 0600)
	if err != nil {
		fmt.Println("Error writing schema")
		fmt.Println(err)
	}
}

func addDefinitionsToRootSchema(rootSchema *jsonschema.Schema, objectSchema *jsonschema.Schema, rootObjectName string) {
	refToRootObject := createRefTypeToDefinition(rootObjectName)
	rootSchema.Definitions["EASIObject"].OneOf = append(rootSchema.Definitions["EASIObject"].OneOf, refToRootObject)

	for objectName, objectType := range objectSchema.Definitions {
		rootSchema.Definitions[objectName] = objectType
	}
}

func main() {
	rootSchema := jsonschema.Reflect(&EASIObject{})

	objects := []interface{}{
		models.EASIAction{},
		models.EASIBizCase{},
		models.EASIBusinessSolution{},
		models.EASIGrtFeedback{},
		models.EASIIntake{},
		models.EASILifecycleCost{},
		models.EASINote{},
	}

	for _, object := range objects {
		addDefinitionsToRootSchema(rootSchema, jsonschema.Reflect(object), reflect.TypeOf(object).Name())
	}

	// clear out unnecessary fields on EASIObject definition
	rootSchema.Definitions["EASIObject"].Properties = nil
	rootSchema.Definitions["EASIObject"].AdditionalProperties = nil
	rootSchema.Definitions["EASIObject"].Type = ""

	writeSchemaToFile(rootSchema)
}
