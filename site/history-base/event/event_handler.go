package event

import (
	"net/http"

	"github.com/stack-labs/stack/service/web"
)

func Handlers() []web.HandlerFunc {
	return []web.HandlerFunc{
		{
			"event/add",
			AddHandler,
		},
		{
			"event/delete",
			DelHandler,
		},
		{
			"event/update",
			UpdateHandler,
		},
		{
			"event/list",
			ListHandler,
		},
	}
}

func ListHandler(w http.ResponseWriter, r *http.Request) {

}

func UpdateHandler(w http.ResponseWriter, r *http.Request) {

}

func DelHandler(w http.ResponseWriter, r *http.Request) {

}

func AddHandler(w http.ResponseWriter, r *http.Request) {

}
