package main

import (
	"fmt"

	"github.com/alecthomas/jsonschema"

	"github.com/cmsgov/easi-app/pkg/cedar/intake/models"
)

type emptyStruct struct {
}

func printSchema(schema *jsonschema.Schema) {
	bytes, err := schema.MarshalJSON()
	if err != nil {
		fmt.Println("Error marshaling schema")
	} else {
		fmt.Println(string(bytes))
	}
}

func addDefinitionsToRootSchema(rootSchema *jsonschema.Schema, objectSchema *jsonschema.Schema) {
	for objectName, objectType := range objectSchema.Definitions {
		rootSchema.Definitions[objectName] = objectType
	}
}

func main() {
	rootSchema := jsonschema.Reflect(&emptyStruct{})

	objectSchemas := []*jsonschema.Schema{
		jsonschema.Reflect(&models.EASIAction{}),
		jsonschema.Reflect(&models.EASIBizCase{}),
		jsonschema.Reflect(&models.EASIBusinessSolution{}),
		jsonschema.Reflect(&models.EASIGrtFeedback{}),
		jsonschema.Reflect(&models.EASIIntake{}),
		jsonschema.Reflect(&models.EASILifecycleCost{}),
		jsonschema.Reflect(&models.EASINote{}),
	}

	for _, objectSchema := range objectSchemas {
		addDefinitionsToRootSchema(rootSchema, objectSchema)
	}

	// TODO - adjust rootSchema $ref

	printSchema(rootSchema)
}
