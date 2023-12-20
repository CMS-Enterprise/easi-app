package models

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/google/uuid"
)

// the tag db is what is used to convert a struct to it's relevant DB field
const tagDBName = "db"

// StructToMap converts a struct to a Map  string interface
func StructToMap(source interface{}) (map[string]interface{}, error) {
	retVal := map[string]interface{}{}
	bytes, err := json.Marshal(source)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(bytes, &retVal)
	if err != nil {
		return nil, err
	}
	return retVal, err

}

// StructToMapDBTag converts a struct to a map[string]interface{}, using the db tag on the struct.
func StructToMapDBTag(source interface{}) (map[string]interface{}, error) {
	// Get the type & value of the object
	v := reflect.ValueOf(source)
	t := v.Type()

	// Structs are the only type this function can work with
	if t.Kind() != reflect.Struct {
		return nil, fmt.Errorf("%s is not a struct", t)
	}
	retVal := map[string]interface{}{}

	// Iterate over all available fields
	for i := 0; i < t.NumField(); i++ {
		// Get the field
		field := t.Field(i)
		value := v.Field(i)

		// Get the field's tag value
		tagValue := field.Tag.Get(tagDBName)
		// If tag was not found skip this field
		if tagValue == "" {
			continue
		}
		retVal[tagValue] = value.Interface()

	}
	return retVal, nil

}

// StructArrayToMapArray converts an array of structs to an array of Maps
func StructArrayToMapArray[StructType ~struct{}](structArray []StructType) ([]map[string]interface{}, error) {
	mapSlice := []map[string]interface{}{}
	for _, strct := range structArray {
		sMap, err := StructToMap(strct)
		mapSlice = append(mapSlice, sMap)
		if err != nil {
			return nil, err
		}
	}

	return mapSlice, nil

}

// MapArrayToJSONArray converts an array of maps to a JSON array
func MapArrayToJSONArray(mapSlice []map[string]interface{}) (string, error) {
	byteArr, err := json.Marshal(mapSlice)
	if err != nil {
		return "", err
	}
	return string(byteArr), nil

}

// StructArrayToJSONArray converts an array of structs to a JSON array
func StructArrayToJSONArray[StructType ~struct{}](structArray []StructType) (string, error) {
	mapSlice, err := StructArrayToMapArray[StructType](structArray)
	if err != nil {
		return "", err
	}

	return MapArrayToJSONArray(mapSlice)

}

// UUIDArrayToMapArray converts an array of UUIDs to a map array with the UUID being called whatever you name it
func UUIDArrayToMapArray(uuidArray []uuid.UUID, propertyName string) []map[string]interface{} {
	mapSlice := []map[string]interface{}{}

	for _, uuid := range uuidArray {
		uMap := map[string]interface{}{
			propertyName: uuid.String(),
		}
		mapSlice = append(mapSlice, uMap)
	}
	return mapSlice
}

// UUIDArrayToJSONArray converts an array of UUIDs to JSON
func UUIDArrayToJSONArray(uuidArray []uuid.UUID, propertyName string) (string, error) {
	mapSlice := UUIDArrayToMapArray(uuidArray, propertyName)
	return MapArrayToJSONArray(mapSlice)
}
