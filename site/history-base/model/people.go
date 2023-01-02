package model

type People struct {
	ID       uint   `json:"id,omitempty,string"`
	Name     string `json:"name,omitempty"`
	BirthDay string `json:"birthDay,omitempty"`
	DeathDay string `json:"deathDay,omitempty"`
}

type Relation struct {
	PeopleIDA     uint    `json:"peopleIDA,omitempty,string"`
	PeopleIDB     uint    `json:"peopleIDB,omitempty,string"`
	Relation      string  `json:"relation,omitempty"`
	RelationIdx   *uint   `json:"relationIdx,omitempty"`
	RelationBegin *string `json:"relationBegin,omitempty"`
	RelationEnd   *string `json:"relationEnd,omitempty"`
}

type RelationView struct {
	Relation
	Name string `json:"name,omitempty"`
}

type PeopleRelation struct {
	People    People     `json:"people"`
	Relations []Relation `json:"relations,omitempty"`
}

type PeopleEvent struct {
	EventID     uint   `json:"event_id,omitempty"`
	PeopleID    uint   `json:"people_id,omitempty"`
	Description string `json:"description,omitempty"`
}

type AllPeopleAndRelation struct {
	Peoples   []*People   `json:"peoples,omitempty"`
	Relations []*Relation `json:"relations,omitempty"`
}
