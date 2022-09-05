package db

import (
	"context"
	"database/sql"
	"fmt"
)

func initSQLite(ctx context.Context) error {
	sqliteDB, err := sql.Open("sqlite3", "../database/all-data.db")
	if err != nil {
		return fmt.Errorf("initSQLite err: %s", err)
	}

	db = sqliteDB

	return nil
}
