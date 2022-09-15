package db

import (
	"context"
	"database/sql"
	"fmt"
	"sync"

	"github.com/stack-labs/stack/config"
	log "github.com/stack-labs/stack/logger"
)

var (
	c  DBConfig
	db *sql.DB

	s sync.Mutex
)

type DBConfig struct {
	DB struct {
		Dialect string `sc:"dialect"`
		SQLite  SQLite `sc:"sqlite"`
	} `sc:"db"`
}

type SQLite struct {
	Path string `sc:"path"`
}

func init() {
	config.RegisterOptions(&c)
}

func Init(ctx context.Context) error {
	s.Lock()
	defer s.Unlock()

	log.Info("begin to init db.")

	if db != nil {
		log.Warnf("db has been inited")
	}

	log.Infof("the dialect is %s.", c.DB.Dialect)
	if c.DB.Dialect == "sqlite" {
		err := initSQLite(ctx)
		if err != nil {
			log.Errorf("load sqlite err: %s")
			return fmt.Errorf("db init err: %s", err)
		}
	}

	return nil
}

func DB() *sql.DB {
	if db == nil {
		log.Fatalf("db is nil")
	}
	return db
}
