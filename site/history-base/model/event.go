package model

type Event struct {
	ID          uint   `json:"id,omitempty"`
	Title       string `json:"title,omitempty"`
	Description string `json:"description,omitempty"`
	Remark      string `json:"remark,omitempty"`
}
