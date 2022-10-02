package main

import (
	"context"
	"net/http"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/login"
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/people"
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
			err := db.Init(context.Background())
			return err
		}),
		stack.WebRootPath("/api/history"),
		stack.WebHandleFuncs(
			handlers()...,
		),
	)
	s.Run()
}

func HelloWorld() web.HandlerFunc {
	return web.HandlerFunc{
		Route: "hello",
		Func: func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte(`hello world`))
		},
	}
}

func handlers() []web.HandlerFunc {
	var ret []web.HandlerFunc
	ret = append(people.Handlers(), HelloWorld())
	ret = append(ret, login.Handlers()...)

	return ret
}
