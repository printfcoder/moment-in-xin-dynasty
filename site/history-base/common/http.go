package common

type HTTPRsp struct {
	Status      string      `json:"status,omitempty"`
	Success     bool        `json:"success,omitempty"`
	ErrorNo     string      `json:"errNo,omitempty"`
	ErrorMsg    string      `json:"errMsg,omitempty"`
	ErrorOriMsg string      `json:"errOriMsg,omitempty"`
	Data        interface{} `json:"data,omitempty"`
}

type PageData struct {
	PageNo   int         `json:"pageNo,omitempty"`
	PageSize int         `json:"pageSize,omitempty"`
	List     interface{} `json:"list,omitempty"`
}
