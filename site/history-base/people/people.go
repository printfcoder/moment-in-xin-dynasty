package people

type People struct {
	ID       int    `json:"id,omitempty"`
	Name     string `json:"name,omitempty"`
	BirthDay string `json:"birth_day,omitempty"`
	DeathDay string `json:"death_day,omitempty"`
}
