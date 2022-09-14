package common

type HTTPRsp struct {
	Status  string      `json:"status,omitempty"`
	Success bool        `json:"success,omitempty"`
	Error   Error       `json:"error,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type Error struct {
	No     string `json:"no,omitempty"`
	Msg    string `json:"msg,omitempty"`
	OriMsg string `json:"oriMsg,omitempty"`
}

type PageData struct {
	PageNo   int         `json:"pageNo,omitempty"`
	PageSize int         `json:"pageSize,omitempty"`
	Total    int         `json:"total,omitempty"`
	List     interface{} `json:"list,omitempty"`
}
