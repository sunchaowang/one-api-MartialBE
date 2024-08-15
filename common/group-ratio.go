package common

import (
	"encoding/json"
	"one-api/common/logger"
)

var GroupRatio = map[string]float64{
	"default": 1,
	"vip":     1,
	"svip":    1,
}

var DirectGroupRatio = map[string]float64{
	"default":       1,
	"openai_direct": 1,
	"claude_direct": 1,
}

func GroupRatio2JSONString() string {
	jsonBytes, err := json.Marshal(GroupRatio)
	if err != nil {
		logger.SysError("error marshalling model ratio: " + err.Error())
	}
	return string(jsonBytes)
}

func DirectGroupRatio2JSONString() string {
	jsonBytes, err := json.Marshal(DirectGroupRatio)
	if err!= nil {
		logger.SysError("error marshalling model ratio: " + err.Error())
	}
	return string(jsonBytes)
}

func UpdateGroupRatioByJSONString(jsonStr string) error {
	GroupRatio = make(map[string]float64)
	return json.Unmarshal([]byte(jsonStr), &GroupRatio)
}

func UpdateDirectGroupRatioByJSONString(jsonStr string) error {
	DirectGroupRatio = make(map[string]float64)
	return json.Unmarshal([]byte(jsonStr), &DirectGroupRatio)
}

func GetGroupRatio(name string) float64 {
	ratio, ok := GroupRatio[name]
	if !ok {
		logger.SysError("group ratio not found: " + name)
		return 1
	}
	return ratio
}

func GetDirectGroupRatio(name string) float64 {
	ratio, ok := DirectGroupRatio[name]
	if!ok {
		logger.SysError("direct group ratio not found: " + name)
		return 1
	}
	return ratio
}
