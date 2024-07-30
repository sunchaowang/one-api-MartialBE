package category

import (
	"one-api/providers/openai"
)

func init() {
	CategoryMap["meta"] = &Category{
		Category: "meta",
		//ChatComplete: ConvertMetaLLamaFromChatOpenai,
		//ResponseChatComplete:      ConvertMetaLLamaToChatOpenai,
		ResponseChatCompleteStrem: ClaudeChatCompleteStrem,
		ErrorHandler:              openai.RequestErrorHandle,
		GetOtherUrl:               getMetaLLamaOtherUrl,
		GetModelName:              GetMetaLLamaModelName,
	}
}

//func ConvertMetaLLamaFromChatOpenai(request *types.ChatCompletionRequest) (any, *types.OpenAIErrorWithStatusCode) {
//	request.ClearEmptyMessages()
//	metaLLamaRequest := MetaLLamaRequest{
//		Model:            request.Model,
//		Messages:         make([]Message, 0),
//		Temperature:      request.Temperature,
//		TopP:             request.TopP,
//		Stream:           request.Stream,
//		MaxTokens:        request.MaxTokens,
//		FrequencyPenalty: request.FrequencyPenalty,
//		PresencePenalty:  request.PresencePenalty,
//		StopSequences:    nil,
//	}
//
//	var prevUserMessage bool
//
//	for _, msg := range request.Messages {
//		if msg.Role == "system" && metaLLamaRequest.System == "" {
//			metaLLamaRequest.System = msg.StringContent()
//			continue
//		}
//		messageContent, err := convertMessageContent(&msg)
//		if err != nil {
//			return nil, common.ErrorWrapper(err, "conversion_error", http.StatusBadRequest)
//		}
//		if messageContent != nil {
//			if messageContent.Role == "user" && prevUserMessage {
//				assistantMessage := Message{
//					Role: "assistant",
//					Content: []MessageContent{
//						{
//							Type: "text",
//							Text: "ok",
//						},
//					},
//				}
//				metaLLamaRequest.Messages = append(metaLLamaRequest.Messages, assistantMessage)
//				prevUserMessage = false
//			} else {
//				prevUserMessage = messageContent.Role == "user"
//			}
//			metaLLamaRequest.Messages = append(metaLLamaRequest.Messages, *messageContent)
//		}
//	}
//	return metaLLamaRequest, nil
//}

//
//func ConvertMetaLLamaToChatOpenai(provider base.ProviderInterface, response *http.Response, request *types.ChatCompletionRequest) (*types.ChatCompletionResponse, *types.OpenAIErrorWithStatusCode) {
//
//}

var metaLLamaMap = map[string]string{
	"meta/llama3-405b-instruct-maas": "meta/llama3-405b-instruct-maas",
}

func GetMetaLLamaModelName(modelName string) string {
	if value, exists := metaLLamaMap[modelName]; exists {
		modelName = value
	}

	return modelName
}

func getMetaLLamaOtherUrl(stream bool) string {
	if stream {
		return "true"
	}
	return "false"
}

type Message struct {
	Role    string `json:"role"`
	Content any    `json:"content"`
}

type MetaLLamaRequest struct {
	Model            string    `json:"model,omitempty"`
	Messages         []Message `json:"messages"`
	MaxTokens        int       `json:"max_tokens"`
	StopSequences    []string  `json:"stop_sequences,omitempty"`
	Temperature      float64   `json:"temperature,omitempty"`
	TopP             float64   `json:"top_p,omitempty"`
	FrequencyPenalty float64   `json:"frequency_penalty,omitempty"`
	PresencePenalty  float64   `json:"presence_penalty,omitempty"`
	System           string    `json:"system,omitempty"`
	Stream           bool      `json:"stream,omitempty"`
}

//func convertMessageContent(msg *types.ChatCompletionMessage) (*Message, error) {
//	message := Message{
//		Role: convertRole(msg.Role),
//	}
//	content := make([]MessageContent, 0)
//	openaiContent := msg.ParseContent()
//	for _, part := range openaiContent {
//		if part.Type == types.ContentTypeText {
//			content = append(content, MessageContent{
//				Type: "text",
//				Text: part.Text,
//			})
//			continue
//		}
//		if part.Type == types.ContentTypeImageURL {
//			mimeType, data, err := image.GetImageFromUrl(part.ImageURL.URL)
//			if err != nil {
//				return nil, common.ErrorWrapper(err, "image_url_invalid", http.StatusBadRequest)
//			}
//			content = append(content, MessageContent{
//				Type: "image",
//				Source: &ContentSource{
//					Type:      "base64",
//					MediaType: mimeType,
//					Data:      data,
//				},
//			})
//		}
//	}
//
//	message.Content = content
//
//	return &message, nil
//}
