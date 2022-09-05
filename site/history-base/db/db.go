package db

import (
	"context"
	"database/sql"
	"fmt"
	"sync"

	log "github.com/stack-labs/stack/logger"
)

var (
	db *sql.DB

	s sync.Mutex
)

func Init(ctx context.Context) error {
	s.Lock()
	defer s.Unlock()

	if db != nil {
		log.Warnf("db has been inited")
	}

	err := initSQLite(ctx)
	if err != nil {
		return fmt.Errorf("db init err: %s", err)
	}

	return nil
}

func DB() *sql.DB {
	if db == nil {
		log.Fatalf("db is nil")
	}
	return db
}
