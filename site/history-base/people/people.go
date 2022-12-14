package people

import "github.com/stack-labs/stack/config"

// BootConfig 启动配置
type BootConfig struct {
	People struct {
		RelationEnum string `sc:"relation-enum"`
	} `sc:"people"`
}

var (
	c BootConfig
)

func init() {
	config.RegisterOptions(&c)
}
