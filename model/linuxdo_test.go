package model_test

import (
	"fmt"
	"one-api/common/config"
	"testing"
)

type User struct {
	LinuxDoLevel    int
}
func TestQuotaForNewLinuxDoUser(t *testing.T) {
	t.Run("Quota", func(t *testing.T) {
		user := User{
			LinuxDoLevel:    1,
		}
		linuxDoLevel := float64(user.LinuxDoLevel) 
		if linuxDoLevel < 2 {
			linuxDoLevel = 0.5;
		}else  {
			linuxDoLevel = float64(user.LinuxDoLevel) - 1;
		}
		var quota = float64(config.QuotaPerUnit) * linuxDoLevel
		fmt.Printf("quota %d", int(quota))
	})
}