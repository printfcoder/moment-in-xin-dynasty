package event

import "github.com/stack-labs/stack/config"

// BootConfig 启动配置
type BootConfig struct {
	Event struct {
		RelationEnum string `sc:"relation-enum"`
	} `sc:"event"`
}

var (
	c BootConfig
)

func init() {
	config.RegisterOptions(&c)
}
