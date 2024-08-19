package model

import (
	"fmt"
	"one-api/common"
	"one-api/common/config"
)

// 注册成功赠送奖励
func (user User) QuotaForNewLinuxDoUser() {
	// 赠送对应的金额
	linuxDoLevel := float64(user.LinuxDoLevel)
	if linuxDoLevel < 2 {
		linuxDoLevel = 0.5;
	}else  {
		linuxDoLevel = float64(user.LinuxDoLevel) - 1;
	}
	var quota = int(config.QuotaPerUnit) * int(linuxDoLevel)
	_ = IncreaseUserQuota(user.Id, quota)
	RecordLog(user.Id, LogTypeSystem, fmt.Sprintf("linux do %v级用户注册, 赠送 %s", user.LinuxDoLevel, common.LogQuota(quota)))
}
