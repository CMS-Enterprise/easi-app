package dataloaders2

// func (d *dataReader) getCedarSystemIsBookmarked(ctx context.Context, requests []models.BookmarkRequest) ([]bool, []error) {
// 	return d.db.FetchCedarSystemIsBookmarkedLOADER2(ctx, requests)
// }

// func GetCedarSystemIsBookmarked(ctx context.Context, cedarSystemID string, euaUserID string) (bool, error) {
// 	loaders := loaders(ctx)
// 	if loaders == nil {
// 		return false, errors.New("unexpected nil loaders in GetBookmarkedCEDARSystem")
// 	}

// 	return loaders.CedarSystemBookmark.Load(ctx, models.BookmarkRequest{
// 		CedarSystemID: cedarSystemID,
// 		EuaUserID:     euaUserID,
// 	})
// }

// func GetBookmarkedCEDARSystems(ctx context.Context, cedarSystemIDs []string) ([]bool, error) {
// 	loaders := loaders(ctx)
// 	if loaders == nil {
// 		return nil, errors.New("unexpected nil loaders in GetBookmarkedCEDARSystems")
// 	}

// 	return loaders.CedarSystemBookmark.LoadAll(ctx, cedarSystemIDs)
// }
