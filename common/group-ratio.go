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

var TokenGroupRatio = map[string]float64{
	"default":       1,
	"openai_direct": 1,
	"claude_direct": 1,
	"azure_direct":  1,
}

func GroupRatio2JSONString() string {
	jsonBytes, err := json.Marshal(GroupRatio)
	if err != nil {
		logger.SysError("error marshalling model ratio: " + err.Error())
	}
	return string(jsonBytes)
}

func TokenGroupRatio2JSONString() string {
	jsonBytes, err := json.Marshal(TokenGroupRatio)
	if err != nil {
		logger.SysError("error marshalling model ratio: " + err.Error())
	}
	return string(jsonBytes)
}

func UpdateGroupRatioByJSONString(jsonStr string) error {
	GroupRatio = make(map[string]float64)
	return json.Unmarshal([]byte(jsonStr), &GroupRatio)
}

func UpdateTokenGroupRatioByJSONString(jsonStr string) error {
	TokenGroupRatio = make(map[string]float64)
	return json.Unmarshal([]byte(jsonStr), &TokenGroupRatio)
}

func GetGroupRatio(name string) float64 {
	ratio, ok := GroupRatio[name]
	if !ok {
		logger.SysError("group ratio not found: " + name)
		return 1
	}
	return ratio
}

func GetTokenGroupRatio(name string) float64 {
	ratio, ok := TokenGroupRatio[name]
	if !ok {
		logger.SysError("direct group ratio not found: " + name)
		return 1
	}
	return ratio
}
