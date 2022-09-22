package people

import (
	"database/sql"
	"fmt"
	log "github.com/stack-labs/stack/logger"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/common"
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
)

func List(pageNo, pageSize int) (peoples []*People, count int, err error) {
	row := db.DB().QueryRow("SELECT COUNT(1) FROM people")
	if row.Err() != nil {
		return nil, 0, common.NewError(common.ErrorDBQueryTotal, row.Err())
	}

	_ = row.Scan(&count)

	var rows *sql.Rows
	rows, err = db.DB().Query("SELECT id, name, birthday, deathday FROM people ORDER BY id LIMIT ?, ?", (pageNo-1)*pageSize, pageSize)
	if err != nil {
		return nil, 0, common.NewError(common.ErrorDBQuery, err)
	}

	for rows.Next() {
		p := People{}
		err = rows.Scan(&p.ID, &p.Name, &p.BirthDay, &p.DeathDay)
		if err != nil {
			return nil, 0, common.NewError(common.ErrorDBQueryScan, err)
		}

		peoples = append(peoples, &p)
	}

	return peoples, count, nil
}

func Add(pr PeopleRelation) (err error) {
	var tx *sql.Tx
	tx, err = db.DB().Begin()
	if err != nil {
		return common.NewError(common.ErrorDBBeginTx, err)
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	result, err := tx.Exec("INSERT INTO people (name, birthday, deathday) VALUES (?, ?, ?)", pr.People.Name, pr.People.BirthDay, pr.People.DeathDay)
	if err != nil {
		err = fmt.Errorf("create people fail: %s", err)
		log.Error(err)
		return common.NewError(common.ErrorDBInsert, err)
	}

	id, _ := result.LastInsertId()

	for i, rl := range pr.Relations {
		if rl.PeopleIDB == 0 {
			err = fmt.Errorf("the peopleId of idx %d is invalid", i)
			log.Error(err)
			return common.NewError(common.ErrorPeopleInvalidRelationPeopleID, err)
		}

		if rl.Relation == "" {
			err = fmt.Errorf("the rl of idx %d is invalid", i)
			log.Error(err)
			return common.NewError(common.ErrorPeopleInvalidRelation, err)
		}
		result, err = tx.Exec(`INSERT INTO people_relation (people_id_a, people_id_b, relation, relation_idx, relation_begin, relation_end) 
    VALUES (?, ?, ?, ?, ?, ?)`, id, rl.PeopleIDB, rl.Relation, rl.RelationIdx, rl.RelationBegin, rl.RelationEnd)
		if err != nil {
			err = fmt.Errorf("insert people_relation error: %s", err)
			log.Error(err)
			return common.NewError(common.ErrorDBInsert, err)
		}
	}

	err = tx.Commit()
	if err != nil {
		err = fmt.Errorf("add people commit error: %s", err)
		log.Error(err)
		return common.NewError(common.ErrorDBCommit, err)
	}

	return nil
}
