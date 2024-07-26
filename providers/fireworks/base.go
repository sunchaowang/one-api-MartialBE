package fireworks

import (
	"one-api/common/requester"
	"one-api/model"
	"one-api/providers/base"
	"one-api/providers/openai"
)

type ProviderFactory struct{}

// 创建 Provider
func (f ProviderFactory) Create(channel *model.Channel) base.ProviderInterface {
	return &Provider{
		OpenAIProvider: openai.OpenAIProvider{
			BaseProvider: base.BaseProvider{
				Config:    getConfig(),
				Channel:   channel,
				Requester: requester.NewHTTPRequester(*channel.Proxy, openai.RequestErrorHandle),
			},
			BalanceAction: false,
		},
	}
}

type Provider struct {
	openai.OpenAIProvider
}

func getConfig() base.ProviderConfig {
	return base.ProviderConfig{
		BaseURL:         "https://api.fireworks.ai/inference/v1",
		ChatCompletions: "/chat/completions",
	}
}

// 获取请求头
func (p *Provider) GetRequestHeaders() (headers map[string]string) {
	headers = make(map[string]string)
	p.CommonRequestHeaders(headers)

	return headers
}
