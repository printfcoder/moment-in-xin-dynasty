package db

import (
	"context"
	"database/sql"
	"fmt"

	log "github.com/stack-labs/stack/logger"
)

func initSQLite(ctx context.Context) error {
	log.Infof(c.DB.SQLite.Path)
	sqliteDB, err := sql.Open("sqlite3", c.DB.SQLite.Path)
	if err != nil {
		return fmt.Errorf("initSQLite err: %s", err)
	}

	db = sqliteDB

	return nil
}
