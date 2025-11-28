package cedarcore

import (
	"fmt"

	"github.com/google/uuid"
)

func formatIDForCEDAR(systemID uuid.UUID) string {
	return fmt.Sprintf("{%s}", systemID.String())
}
