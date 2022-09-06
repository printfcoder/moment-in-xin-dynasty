package people

import (
	"encoding/json"
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
	"github.com/stack-labs/stack/service/web"
	"net/http"
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
	rows, err := db.DB().Query("SELECT id, name, birthday, deathday FROM people")
	if err != nil {
		panic(err)
	}

	var ret []*People
	for rows.Next() {
		p := People{}
		err = rows.Scan(&p.ID, &p.Name, &p.BirthDay, &p.DeathDay)
		if err != nil {
			panic(err)
		}

		ret = append(ret, &p)
	}

	bytes, err := json.Marshal(ret)
	if err != nil {
		panic(err)
	}

	_, err = w.Write(bytes)
	if err != nil {
		panic(err)
	}
}
