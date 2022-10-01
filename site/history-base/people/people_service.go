package people

import (
	"database/sql"
	"fmt"

	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/common"
	"github.com/printfcoder/moment-in-xin-dynasty/site/history-base/db"
	log "github.com/stack-labs/stack/logger"
)

func list(name string, current, pageSize int) (peoples []*People, count int, err error) {
	whereSQL := " WHERE 1=1 "
	if name != "" {
		whereSQL += "AND name LIKE '%" + name + "%'"
	}

	row := db.DB().QueryRow("SELECT COUNT(1) FROM people" + whereSQL)
	if row.Err() != nil {
		return nil, 0, common.NewError(common.ErrorDBQueryTotal, row.Err())
	}

	_ = row.Scan(&count)

	var rows *sql.Rows
	rows, err = db.DB().Query("SELECT id, name, birthday, deathday FROM people "+whereSQL+" ORDER BY id LIMIT ?, ?", (current-1)*pageSize, pageSize)
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

func del(id int) (err error) {
	_, err = db.DB().Exec("DELETE FROM people WHERE id = ?", id)
	if err != nil {
		err = fmt.Errorf("delete people err: %s", err)
		return common.NewError(common.ErrorDBDelete, err)
	}

	_, err = db.DB().Exec("DELETE FROM people_relation WHERE people_id_a = ?", id)
	if err != nil {
		err = fmt.Errorf("delete people relation err: %s", err)
		return common.NewError(common.ErrorDBDelete, err)
	}

	return
}

func get(id int) (pr *PeopleRelation, err error) {
	row := db.DB().QueryRow("SELECT id, name, birthday, deathday FROM people WHERE id = ?", id)
	if row.Err() != nil {
		if row.Err() == sql.ErrNoRows {
			return nil, common.NewError(common.ErrorDBNoSuchRecord, nil)
		}
		return nil, common.NewError(common.ErrorDBQuery, row.Err())
	}

	// 人物
	pr = &PeopleRelation{}
	err = row.Scan(&pr.People.ID, &pr.People.Name, &pr.People.BirthDay, &pr.People.DeathDay)
	if err != nil {
		return nil, common.NewError(common.ErrorDBQueryScan, err)
	}

	var rows *sql.Rows
	rows, err = db.DB().Query("SELECT people_id_b, relation, relation_idx, relation_begin, relation_end FROM people_relation WHERE people_id_a = ?", id)
	if err != nil {
		return nil, common.NewError(common.ErrorDBQuery, err)
	}

	// 关系列表
	for rows.Next() {
		r := Relation{}
		err = rows.Scan(&r.PeopleIDB, &r.Relation, &r.RelationIdx, &r.RelationBegin, &r.RelationEnd)
		if err != nil {
			return nil, common.NewError(common.ErrorDBQueryScan, err)
		}

		pr.Relations = append(pr.Relations, r)
	}

	return pr, nil
}

func add(pr PeopleRelation) (err error) {
	var tx *sql.Tx
	tx, err = db.DB().Begin()
	if err != nil {
		return common.NewError(common.ErrorDBBeginTx, err)
	}
	defer func() {
		if err != nil {
			log.Errorf("add people rollbacks tran. err: %s", err)
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

func update(pr PeopleRelation) (err error) {
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

	row := tx.QueryRow("SELECT 1 FROM people WHERE id = ?", pr.People.ID)
	if err = row.Err(); err != nil {
		err = fmt.Errorf("create people fail: %s", err)
		log.Error(err)
		if err == sql.ErrNoRows {
			return common.NewError(common.ErrorPeopleIsNobody, err)
		}
		return common.NewError(common.ErrorDBInsert, err)
	}

	_, err = tx.Exec("UPDATE people SET name = ?, birthday = ?, deathday = ? WHERE id = ?", pr.People.Name, pr.People.BirthDay, pr.People.DeathDay, pr.People.ID)
	if err != nil {
		err = fmt.Errorf("create people fail: %s", err)
		log.Error(err)
		return common.NewError(common.ErrorDBInsert, err)
	}

	_, err = tx.Exec("DELETE FROM people_relation WHERE people_id_a = ?", pr.People.ID)
	if err != nil {
		err = fmt.Errorf("create people fail: %s", err)
		log.Error(err)
		return common.NewError(common.ErrorDBInsert, err)
	}

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
		_, err = tx.Exec(`INSERT INTO people_relation (people_id_a, people_id_b, relation, relation_idx, relation_begin, relation_end) 
    VALUES (?, ?, ?, ?, ?, ?)`, pr.People.ID, rl.PeopleIDB, rl.Relation, rl.RelationIdx, rl.RelationBegin, rl.RelationEnd)
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
