package dataloaders

// func (loaders *DataLoaders) getBookmarkedCEDARSystems(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
// 	logger := appcontext.ZLogger(ctx)

// 	arrayCK := ConvertToKeyArgsArray(keys)
// 	marshaledParams, err := arrayCK.ToJSONArray()
// 	if err != nil {
// 		logger.Error("issue converting keys to JSON for data loader in Bookmarked CEDAR Systems")
// 		return nil
// 	}

// 	output := make([]*dataloader.Result, len(keys))
// 	bookmarkMap, err := loaders.DataReader.Store.FetchCedarSystemBookmarksBySystemIDs()
// }

// func GetBookmarkedCEDARSystems(ctx context.Context) ([]*models.CedarSystemBookmark,error){
// 	allLoaders := Loaders(ctx)
// 	loader := allLoaders.cedarSystemBookmarksLoader

// 	key := NewKeyArgs()
// }
