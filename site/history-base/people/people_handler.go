package people

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/common"
	log "github.com/stack-labs/stack/logger"
	"github.com/stack-labs/stack/service/web"
)

func Handlers() []web.HandlerFunc {
	return []web.HandlerFunc{
		{
			"peoples",
			ListHandler,
		},
		{
			"relation-enum",
			RelationEnum,
		},
		{
			"people-add",
			AddHandler,
		},
	}
}

func ListHandler(w http.ResponseWriter, r *http.Request) {
	rsp := &common.HTTPRsp{}
	pageNo, _ := strconv.Atoi(r.URL.Query().Get("pageNo"))
	if pageNo < 1 {
		pageNo = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 {
		pageSize = 10
	}

	peoples, count, err := List(pageNo, pageSize)
	if err != nil {
		writeFailHTTP(w, rsp, err)
		return
	}

	rsp.Data = &common.PageData{
		List:  peoples,
		Total: count,
	}

	writeSuccessHTTP(w, rsp)
}

func AddHandler(w http.ResponseWriter, r *http.Request) {
	var pr PeopleRelation
	rsp := &common.HTTPRsp{}

	err := json.NewDecoder(r.Body).Decode(&pr)
	if err != nil {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorInvalidJSONBody, err))
		return
	}

	if len(pr.People.Name) == 0 {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorPeopleInvalidName, err))
		return
	}

	if len(pr.People.BirthDay) == 0 {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorPeopleInvalidBirthDay, err))
		return
	}

	if len(pr.People.DeathDay) == 0 {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorPeopleInvalidDeathDay, err))
		return
	}

	err = Add(pr)
	if err != nil {
		writeFailHTTP(w, rsp, err)
		return
	}
	writeSuccessHTTP(w, rsp)
}

func RelationEnum(w http.ResponseWriter, r *http.Request) {
	enums := strings.Split(c.People.RelationEnum, ",")
	for i, enum := range enums {
		enums[i] = strings.TrimSpace(enum)
	}

	writeSuccessHTTP(w, &common.HTTPRsp{
		Data: enums,
	})
}

func writeFailHTTP(w http.ResponseWriter, rsp *common.HTTPRsp, err error) {
	rsp.Success = false
	rsp.Error = err.(*common.Error)
	_, e := web.HTTPJSON(w, rsp)
	if e != nil {
		log.Errorf("return json error, %s", err)
		return
	}
}

func writeSuccessHTTP(w http.ResponseWriter, rsp *common.HTTPRsp) {
	rsp.Success = true
	_, err := web.HTTPJSON(w, rsp)
	if err != nil {
		log.Errorf("return json error, %s", err)
		return
	}
}
