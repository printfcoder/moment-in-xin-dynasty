package people

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/common"
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
	log "github.com/stack-labs/stack/logger"
	"github.com/stack-labs/stack/service/web"
)

func Handlers() []web.HandlerFunc {
	return []web.HandlerFunc{
		{
			"peoples",
			List,
		},
	}
}

func List(w http.ResponseWriter, r *http.Request) {
	rsp := &common.HTTPRsp{}
	var peoples []*People
	var count = 0
	var rows *sql.Rows
	var err error

	pageNo, _ := strconv.Atoi(r.URL.Query().Get("pageNo"))
	if pageNo < 1 {
		pageNo = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 {
		pageSize = 10
	}
	row := db.DB().QueryRow("SELECT COUNT(1) FROM people")
	if row.Err() != nil {
		rsp.Error = common.Error{
			No:     "100001",
			Msg:    "查询数据库总数失败",
			OriMsg: row.Err().Error(),
		}

		goto ret
	}
	_ = row.Scan(&count)

	rows, err = db.DB().Query("SELECT id, name, birthday, deathday FROM people ORDER BY id LIMIT ?, ?", (pageNo-1)*pageSize, pageSize)
	if err != nil {
		rsp.Error = common.Error{
			No:     "100002",
			Msg:    "查询数据库失败",
			OriMsg: err.Error(),
		}

		goto ret
	}

	for rows.Next() {
		p := People{}
		err = rows.Scan(&p.ID, &p.Name, &p.BirthDay, &p.DeathDay)
		if err != nil {
			rsp.Error = common.Error{
				No:     "100003",
				Msg:    "查询Scan失败",
				OriMsg: err.Error(),
			}
			goto ret
		}

		peoples = append(peoples, &p)
	}
	rsp.Data = &common.PageData{
		List:  peoples,
		Total: count,
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
