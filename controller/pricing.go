package controller

import (
	"errors"
	"net/http"
	"net/url"
	"one-api/common"
	"one-api/model"
	"one-api/relay/relay_util"

	"github.com/gin-gonic/gin"
)

func GetPricesList(c *gin.Context) {
	pricesType := c.DefaultQuery("type", "db")

	prices := relay_util.GetPricesList(pricesType)

	if len(prices) == 0 {
		common.APIRespondWithError(c, http.StatusOK, errors.New("pricing data not found"))
		return
	}

	if pricesType == "old" {
		c.JSON(http.StatusOK, prices)
	} else {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "",
			"data":    prices,
		})
	}
}

func GetAllModelList(c *gin.Context) {
	rule := model.ChannelGroup.Rule

	groupsMap := make(map[string]map[string][]string)
	for userGroupName := range rule {
		groupsMap[userGroupName] = make(map[string][]string)
		for tokenGroupName := range rule[userGroupName] {
			groupsMap[userGroupName][tokenGroupName] = make([]string, 0)
			for modelName := range rule[userGroupName][tokenGroupName] {
				groupsMap[userGroupName][tokenGroupName] = append(groupsMap[userGroupName][tokenGroupName], modelName)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data":    groupsMap,
	})
}

func AddPrice(c *gin.Context) {
	var price model.Price
	if err := c.ShouldBindJSON(&price); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	if err := relay_util.PricingInstance.AddPrice(&price); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

func UpdatePrice(c *gin.Context) {
	modelName := c.Param("model")
	// 接受 body 参数 token_group
	if modelName == "" || len(modelName) < 2 {
		common.APIRespondWithError(c, http.StatusOK, errors.New("model name is required"))
		return
	}

	modelName = modelName[1:]
	modelName, _ = url.PathUnescape(modelName)

	var price model.Price
	if err := c.ShouldBindJSON(&price); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}
	if price.TokenGroup == "" {
		common.APIRespondWithError(c, http.StatusOK, errors.New("token group is required"))
		return
	}

	if err := relay_util.PricingInstance.UpdatePrice(price.TokenGroup, modelName, &price); err != nil { // 修改调用
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

func DeletePrice(c *gin.Context) {
	modelName := c.Param("model")
	tokenGroup := c.Param("token_group")
	if modelName == "" || len(modelName) < 2 {
		common.APIRespondWithError(c, http.StatusOK, errors.New("model name is required"))
		return
	}
	if tokenGroup == "" {
		common.APIRespondWithError(c, http.StatusOK, errors.New("token group is required"))
		return
	}
	modelName = modelName[1:]
	modelName, _ = url.PathUnescape(modelName)

	if err := relay_util.PricingInstance.DeletePrice(tokenGroup, modelName); err != nil { // 修改调用
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

type PriceBatchRequest struct {
	TokenGroup     string   `json:"token_group"`
	OriginalModels []string `json:"original_models"`
	relay_util.BatchPrices
}

func BatchSetPrices(c *gin.Context) {
	pricesBatch := &PriceBatchRequest{}
	if err := c.ShouldBindJSON(pricesBatch); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	if pricesBatch.TokenGroup == "" {
		common.APIRespondWithError(c, http.StatusOK, errors.New("token group is required"))
		return
	}

	if err := relay_util.PricingInstance.BatchSetPrices(pricesBatch.TokenGroup, &pricesBatch.BatchPrices, pricesBatch.OriginalModels); err != nil { // 修改调用
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

type PriceBatchDeleteRequest struct {
	Models     []string `json:"models" binding:"required"`
	TokenGroup string   `json:"token_group" binding:"required"`
}

func BatchDeletePrices(c *gin.Context) {
	pricesBatch := &PriceBatchDeleteRequest{}
	if err := c.ShouldBindJSON(pricesBatch); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	if pricesBatch.TokenGroup == "" {
		common.APIRespondWithError(c, http.StatusOK, errors.New("token group is required"))
		return
	}

	if err := relay_util.PricingInstance.BatchDeletePrices(pricesBatch.TokenGroup, pricesBatch.Models); err != nil { // 修改调用
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

func SyncPricing(c *gin.Context) {
	overwrite := c.DefaultQuery("overwrite", "false")

	prices := make([]*model.Price, 0)
	if err := c.ShouldBindJSON(&prices); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	if len(prices) == 0 {
		common.APIRespondWithError(c, http.StatusOK, errors.New("prices is required"))
		return
	}

	err := relay_util.PricingInstance.SyncPricing(prices, overwrite == "true")
	if err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}
