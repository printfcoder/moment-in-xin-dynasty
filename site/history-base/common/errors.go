package common

var (
	/** 通用基础业务 */

	ErrorDBQueryTotal    = Error{No: "100001", Msg: "查询数据库总数失败"}
	ErrorDBQuery         = Error{No: "100002", Msg: "查询数据库失败"}
	ErrorDBQueryScan     = Error{No: "100003", Msg: "查询Scan失败"}
	ErrorInvalidJSONBody = Error{No: "100004", Msg: "JSON 参数不正确"}
	ErrorDBBeginTx       = Error{No: "100005", Msg: "事务启动失败"}
	ErrorDBInsert        = Error{No: "100006", Msg: "DB插入失败"}
	ErrorDBCommit        = Error{No: "100007", Msg: "事务提交失败"}

	/** People业务区 */

	ErrorPeopleInvalidName             = Error{No: "110001", Msg: "名字非法"}
	ErrorPeopleInvalidBirthDay         = Error{No: "110002", Msg: "生日非法"}
	ErrorPeopleInvalidDeathDay         = Error{No: "110003", Msg: "忌日非法"}
	ErrorPeopleInvalidRelationPeopleID = Error{No: "110004", Msg: "关联人物id不正确"}
	ErrorPeopleInvalidRelation         = Error{No: "110005", Msg: "关联人物的关系"}
)
