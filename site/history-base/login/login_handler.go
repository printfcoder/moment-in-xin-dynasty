package login

import (
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/common"
	log "github.com/stack-labs/stack/logger"
	"github.com/stack-labs/stack/service/web"
	"net/http"
)

func Handlers() []web.HandlerFunc {
	return []web.HandlerFunc{
		{
			"login/account",
			Login,
		},
	}
}

func Login(w http.ResponseWriter, r *http.Request) {
	rsp := &common.HTTPRsp{
		Status:  "ok",
		Success: true,
	}

	_, err := web.HTTPJSON(w, rsp)
	if err != nil {
		log.Errorf("return json error, %s", err)
		return
	}
}
