package helpers

// Mapper can be implemented so that it can use OneToMany below to map a flat list of values
// to a flat list of their relative keys
type Mapper[keyT comparable, valT any] interface {
	GetMappingKey() keyT
	GetMappingVal() valT // in cases where the return value is not embedded, this should simply be a pointer to the original struct
}

// OneToMany takes a list of keys and a list of values which map one-to-many (key-to-value)
// ex: vals could be a list of contract numbers where more than one value has the same mapped ID
func OneToMany[valT Mapper[keyT, retT], keyT comparable, retT any](keys []keyT, vals []valT) [][]retT {
	// create a map to store values grouped by key (of type keyT)
	// each key will map to a slice of values (of type valT)
	store := map[keyT][]retT{}

	// iterate over each value in the flat slice and append it to the correct key in the map,
	// based on the value's GetMappingKey() method
	for _, val := range vals {
		id := val.GetMappingKey()
		// populate with empty slice if not present
		if _, ok := store[id]; !ok {
			store[id] = []retT{}
		}
		// call return value in case it is an embedded struct or something different than the starting value
		returnValue := val.GetMappingVal()
		store[id] = append(store[id], returnValue)
	}

	// now we have a map of keys to slices of values, but we want to convert that to
	// a 2D slice of values, where each slice is a list of values that share the same key
	//
	// to do this, we iterate over the keys slice and append the corresponding value slice from the map
	var out [][]retT
	for _, key := range keys {
		out = append(out, store[key])
	}

	return out
}

// OneToOne takes a list of keys and a list of values which map one-to-one (key-to-value)
func OneToOne[valT Mapper[keyT, retT], keyT comparable, retT any](keys []keyT, vals []valT) []retT {
	store := map[keyT]retT{}

	for _, val := range vals {
		id := val.GetMappingKey()
		store[id] = val.GetMappingVal()
	}

	var out []retT
	for _, key := range keys {
		out = append(out, store[key])
	}

	return out
}
