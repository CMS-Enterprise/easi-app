package helpers

func getResultSimplifiedOneToOne[K comparable, V any](key K, resultMap map[K]V) (V, bool) {
	res, ok := resultMap[key]
	return res, ok
}

// OneToOne takes a list of keys and a list of values which map one-to-one (key-to-value).
// it relies on the transformOutput func to return the result in expected format
// Example:
//
//	type User struct {
//	    ID   string
//	    Name string
//	}
//
//	keys := []string{"1", "2"}
//	users := []User{
//	    {ID: "1", Name: "Alice"},
//	    {ID: "2", Name: "Bob"},
//	}
//
//	getKeyFunc := func(user User) string {
//	    return user.ID
//	}
//
//	transformOutputFunc := func(user User, exists bool) string {
//	    if !exists {
//	        return "Unknown"
//	    }
//	    return user.Name
//	}
//
//	result := OneToOne(keys, users, getKeyFunc, transformOutputFunc)
//	// result: []string{"Alice", "Bob"}
func OneToOne[K comparable, mapType any, Output any](keys []K, vals []mapType, getKey func(mapType) K, transformOutput func(mapType, bool) Output) []Output {
	return OneToOneWithCustomKey(keys, vals, getKey, getResultSimplifiedOneToOne[K, mapType], transformOutput)
}

// OneToOneWithCustomKey provides a flexible one-to-one mapping function.
// - keys: list of lookup keys (K)
// - vals: list of input values (mapType)
// - getKey: maps each value to a mapKey for internal lookup
// - getRes: maps a key to a value from the built store (one-to-one match)
// - transformOutput: transforms the value and presence flag into Output
func OneToOneWithCustomKey[K comparable, V any, mapType any, mapKey comparable, Output any](
	keys []K,
	vals []mapType,
	getKey func(mapType) mapKey,
	getRes func(K, map[mapKey]mapType) (V, bool),
	transformOutput func(V, bool) Output,
) []Output {
	// Create map: mapKey -> mapType (only keep one per key; if multiple, last wins)
	store := make(map[mapKey]mapType)
	for _, val := range vals {
		id := getKey(val)
		store[id] = val
	}

	output := make([]Output, len(keys))
	for index, key := range keys {
		val, ok := getRes(key, store)
		output[index] = transformOutput(val, ok)
	}
	return output
}

// OneToManyWithCustomKey takes a list of keys and a list of values which map one-to-many (key-to-value)
// ex: vals could be a list of collaborators where more than one collaborator exists for the same model plan id
// getKey: this function takes a value, and gets mapKey key for the intermediate map of data. This is needed for cases where you can't directly infer a key from a value
// getRes: this function takes an original key, and the intermediate response and returns a value and bool if hte value exists
// transform output lets you cast a data result to final expected data type returned
/* EXAMPLE
type SolutionAndPossibleKey struct {
	// OperationalNeedID is the ID of the need that a solution is associated with
	OperationalNeedID uuid.UUID `json:"operational_need_id"`
	// IncludeNotNeeded specifies if the query should return solutions with a status of not needed, or if possible solutions (not discrete records) should be included
	IncludeNotNeeded bool `json:"include_not_needed"`
}
keys []storage.SolutionAndPossibleKey
data := []*models.OperationalSolution {lots of operational solutions}

	getKeyFunc := func(data *models.OperationalSolution) uuid.UUID {
		// The key for the loader is more complicated, but can't be inferred by each individual value. Instead, we can use the get res function to further transform the data as needed
		return data.OperationalNeedID
	}

	getResFunc := func(key storage.SolutionAndPossibleKey, resMap map[uuid.UUID][]*models.OperationalSolution) ([]*models.OperationalSolution, bool) {
	res, ok := resMap[key.OperationalNeedID]
		if !key.IncludeNotNeeded {
			lo.Filter(res, func(sol *models.OperationalSolution, _ int) bool {
				if sol.Needed == nil{
					return false
				}
				return *sol.Needed
			})
		// }

	return res, ok

	}

	transformFunc := func transformToDataLoaderResultAllowNils[V any](val V, valueFound bool) *dataloader.Result[V] {
	return &dataloader.Result[V]{Data: val, Error: nil}
}

	return OneToManyWithCustomKey(keys, sols, getKeyFunc, getResFunc, transformFunc)


*/
func OneToManyWithCustomKey[K comparable, V any, mapType any, mapKey comparable, Output any](keys []K, vals []mapType, getKey func(mapType) mapKey, getRes func(K, map[mapKey][]mapType) ([]V, bool), transformOutput func([]V, bool) Output) []Output {

	// create a map to store values grouped by key (of type K)
	// each key will map to a slice of mapType (of type mapType)
	store := map[mapKey][]mapType{}

	for _, val := range vals {
		id := getKey(val)
		if _, ok := store[id]; !ok {
			store[id] = []mapType{}
		}
		store[id] = append(store[id], val)
	}
	output := make([]Output, len(keys))
	for index, key := range keys {
		data, ok := getRes(key, store)
		output[index] = transformOutput(data, ok)
	}

	return output
}

// // func getResSimplified
// func getResultSimplified[K comparable, V any, mapKey comparable](key K, resultMap map[mapKey][]V) ([]V, bool) {
// 	res, ok := resultMap[key]
// 	return res, ok

// }

// getResultSimplified is a standard function to get the result of a one to many map assuming a simple map operation where the map key is the same as the dataloader key

func getResultSimplified[K comparable, V any](key K, resultMap map[K][]V) ([]V, bool) {
	res, ok := resultMap[key]
	return res, ok
}

// OneToMany uses the standard OneToManyFunc, but assumes that the mapKey is the same as the dataloaderkey K.
func OneToMany[K comparable, V any, mapType any, Output any](keys []K, vals []mapType, getKey func(mapType) K, transformOutput func([]mapType, bool) Output) []Output {
	return OneToManyWithCustomKey(keys, vals, getKey, getResultSimplified[K, mapType], transformOutput)
}
