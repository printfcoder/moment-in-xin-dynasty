package common

import "fmt"

type HTTPRsp struct {
	Status  string      `json:"status,omitempty"`
	Success bool        `json:"success,omitempty"`
	Error   *Error      `json:"error,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type Error struct {
	No     string `json:"no,omitempty"`
	Msg    string `json:"msg,omitempty"`
	OriMsg string `json:"oriMsg,omitempty"`
}

func (e Error) Error() string {
	return fmt.Errorf("error: No.%s, %s. the oriMsg is: %s", e.No, e.Msg, e.OriMsg).Error()
}

type PageData struct {
	PageNo   int         `json:"pageNo,omitempty"`
	PageSize int         `json:"pageSize,omitempty"`
	Total    int         `json:"total,omitempty"`
	List     interface{} `json:"list,omitempty"`
}

func NewError(err Error, oriMsg error) *Error {
	err.OriMsg = oriMsg.Error()
	return &err
}
