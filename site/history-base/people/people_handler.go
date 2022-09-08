package people

import (
	"net/http"
	"strconv"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
	log "github.com/stack-labs/stack/logger"
	"github.com/stack-labs/stack/service/web"
)

func Handlers() []web.HandlerFunc {
	return []web.HandlerFunc{
		{
			"people",
			List,
		},
	}
}

func List(w http.ResponseWriter, r *http.Request) {
	rsp := &HTTPRsp{}
	var peoples []*People

	pageNo, _ := strconv.Atoi(r.URL.Query().Get("pageNo"))
	if pageNo < 1 {
		pageNo = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 {
		pageSize = 10
	}

	rows, err := db.DB().Query("SELECT id, name, birthday, deathday FROM people ORDER BY id LIMIT ?, ?", (pageNo-1)*pageSize, pageSize)
	if err != nil {
		rsp.ErrorNo = "100001"
		rsp.ErrorMsg = "查询数据库失败"
		rsp.ErrorOriMsg = err.Error()
		goto ret
	}

	for rows.Next() {
		p := People{}
		err = rows.Scan(&p.ID, &p.Name, &p.BirthDay, &p.DeathDay)
		if err != nil {
			rsp.ErrorNo = "100002"
			rsp.ErrorMsg = "查询Scan失败"
			rsp.ErrorOriMsg = err.Error()
			goto ret
		}

		peoples = append(peoples, &p)
	}
	rsp.Data = &PageData{
		List: peoples,
	}

ret:
	{
		_, err = web.HTTPJSON(w, rsp)
		if err != nil {
			log.Errorf("return json error, %s", err)
			return
		}
	}
}

type HTTPRsp struct {
	ErrorNo     string      `json:"errNo,omitempty"`
	ErrorMsg    string      `json:"errMsg,omitempty"`
	ErrorOriMsg string      `json:"errOriMsg,omitempty"`
	Data        interface{} `json:"data,omitempty"`
}

type PageData struct {
	PageNo   int         `json:"pageNo,omitempty"`
	PageSize int         `json:"pageSize,omitempty"`
	List     interface{} `json:"list,omitempty"`
}
