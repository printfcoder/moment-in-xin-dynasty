package main

import (
	"context"
	"net/http"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
	"github.com/stack-labs/stack"
	"github.com/stack-labs/stack/service/web"

	// db
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	s := stack.NewWebService(
		stack.Name("xin.dynasty.history-base"),
		stack.Address("localhost:8888"),
	)
	s.Init(
		stack.BeforeStart(func() error {
			db.Init(context.Background())
			return nil
		}),
		stack.WebHandleFuncs(
			web.HandlerFunc{
				Route: "hello",
				Func: func(w http.ResponseWriter, r *http.Request) {
					w.Write([]byte(`hello world`))
				},
			},
		),
	)
	s.Run()
}
