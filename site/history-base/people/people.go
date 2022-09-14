package people

type People struct {
	ID       int    `json:"id,omitempty"`
	Name     string `json:"name,omitempty"`
	BirthDay string `json:"birthDay,omitempty"`
	DeathDay string `json:"deathDay,omitempty"`
}
