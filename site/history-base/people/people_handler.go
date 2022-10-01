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
			"people/list",
			ListHandler,
		},
		{
			"people/get",
			GetHandler,
		},
		{
			"people/relation-enum",
			RelationEnum,
		},
		{
			"people/add",
			AddHandler,
		},
		{
			"people/delete",
			DelHandler,
		},
		{
			"/people/update",
			UpdateHandler,
		},
	}
}

func GetHandler(w http.ResponseWriter, r *http.Request) {
	rsp := &common.HTTPRsp{}
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	if id == 0 {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorPeopleInvalidID, nil))
		return
	}

	people, err := get(id)
	if err != nil {
		writeFailHTTP(w, rsp, err)
		return
	}

	rsp.Data = people

	writeSuccessHTTP(w, rsp)
}

func DelHandler(w http.ResponseWriter, r *http.Request) {
	rsp := &common.HTTPRsp{}
	id, _ := strconv.Atoi(r.Form.Get("id"))
	if id == 0 {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorPeopleInvalidID, nil))
		return
	}

	err := del(id)
	if err != nil {
		writeFailHTTP(w, rsp, err)
		return
	}

	writeSuccessHTTP(w, rsp)
}

func ListHandler(w http.ResponseWriter, r *http.Request) {
	rsp := &common.HTTPRsp{}
	current, _ := strconv.Atoi(r.URL.Query().Get("current"))
	if current < 1 {
		current = 1
	}
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("pageSize"))
	if pageSize < 1 {
		pageSize = 10
	}

	name := r.URL.Query().Get("name")

	peoples, count, err := list(name, current, pageSize)
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
		log.Errorf("decode body err: %s", err)
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

	err = add(pr)
	if err != nil {
		writeFailHTTP(w, rsp, err)
		return
	}
	writeSuccessHTTP(w, rsp)
}

func UpdateHandler(w http.ResponseWriter, r *http.Request) {
	var pr PeopleRelation
	rsp := &common.HTTPRsp{}

	err := json.NewDecoder(r.Body).Decode(&pr)
	if err != nil {
		log.Errorf("decode body err: %s", err)
		writeFailHTTP(w, rsp, common.NewError(common.ErrorInvalidJSONBody, err))
		return
	}

	if pr.People.ID == 0 {
		writeFailHTTP(w, rsp, common.NewError(common.ErrorPeopleInvalidName, err))
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

	err = update(pr)
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
