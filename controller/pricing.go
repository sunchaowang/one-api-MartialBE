package controller

import (
	"errors"
	"fmt"
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
	prices := relay_util.PricingInstance.GetAllPrices()
	channelModel := model.ChannelGroup.Rule

	groupsMap := make(map[string]bool)
	for groupName := range prices {
		groupsMap[groupName] = true
	}

	for _, modelMap := range channelModel {
		for modelName := range modelMap {
			if _, ok := prices[modelName]; !ok {
				groupsMap[modelName] = true
			}
		}
	}
	fmt.Printf("groupsMap: %v\n", groupsMap)
	var groups map[string][]string
	groups = make(map[string][]string)

	for group := range groupsMap {
		var models []string
		for model := range prices[group] {
			models = append(models, model)
		}
		groups[group] = models

	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
		"data": groups,
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

	if err := relay_util.PricingInstance.UpdatePrice(modelName, &price); err != nil {
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
	directGroup := c.Param("directGroup")
	if modelName == "" || len(modelName) < 2 {
		common.APIRespondWithError(c, http.StatusOK, errors.New("model name is required"))
		return
	}
	modelName = modelName[1:]
	modelName, _ = url.PathUnescape(modelName)

	if err := relay_util.PricingInstance.DeletePrice(modelName, directGroup); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

type PriceBatchRequest struct {
	OriginalModels []string `json:"original_models"`
	relay_util.BatchPrices
	DirectGroup string `json:"direct_group"`
}

func BatchSetPrices(c *gin.Context) {
	pricesBatch := &PriceBatchRequest{}
	if err := c.ShouldBindJSON(pricesBatch); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	if err := relay_util.PricingInstance.BatchSetPrices(&pricesBatch.BatchPrices, pricesBatch.OriginalModels, pricesBatch.DirectGroup); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "",
	})
}

type PriceBatchDeleteRequest struct {
	Models      []string `json:"models" binding:"required"`
	DirectGroup string   `json:"direct_group"`
}

func BatchDeletePrices(c *gin.Context) {
	pricesBatch := &PriceBatchDeleteRequest{}
	if err := c.ShouldBindJSON(pricesBatch); err != nil {
		common.APIRespondWithError(c, http.StatusOK, err)
		return
	}

	if err := relay_util.PricingInstance.BatchDeletePrices(pricesBatch.Models, pricesBatch.DirectGroup); err != nil {
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
