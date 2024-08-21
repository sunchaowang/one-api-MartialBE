import { Card, Table, Space, Tag, Typography, Row, Button } from 'antd';
const { Title, Paragraph, Text } = Typography;

const renderModalTable = (data, provider) => {
  function renderReplayTokensColumn(record) {
    return record.timesPrice ? (
      <Space direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
        <Typography>{record.timesPrice}</Typography>
        <Typography>* 用户分组倍率 * 令牌分组倍率</Typography>
      </Space>
    ) : record.characterPrice ? (
      <Space direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
        <Typography>{record.characterPrice}</Typography>
        <Typography>* 用户分组倍率 * 令牌分组倍率</Typography>
      </Space>
    ) : (
      <Space direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
        <Space direction={'column'} spacing={1}>
          <div>
            <Tag size="small">输入</Tag>
            {record.inputTokens + ' / 1k tokens'}
          </div>
          <div>
            <Tag size="small">输出</Tag>
            {record.outputTokens + ' / 1k tokens'}
          </div>
        </Space>
        <Typography>* 用户分组倍率 * 令牌分组倍率</Typography>
      </Space>
    );
  }

  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <Button type="primary">{provider}</Button>
      <Table
        size={'small'}
        columns={[
          {
            key: 'name',
            title: '模型名称',
            dataIndex: 'name',
            width: '30%',
            render(_) {
              return (
                <Space direction="vertical">
                  {_.split(',').map((n) => (
                    <Tag style={{ border: 'none' }} key={n}>
                      {n}
                    </Tag>
                  ))}
                </Space>
              );
            }
          },
          {
            key: 'prices',
            title: '计费模式',
            dataIndex: 'prices',
            align: 'center',
            width: '70%',
            render(_, row) {
              return renderReplayTokensColumn(row);
            }
          }
          // {
          //   key: 'remark',
          //   title: '备注',
          //   dataIndex: 'remark',
          //   align: 'center',
          //   render(_, row) {
          //     return row.isSupport;
          //   }
          // }
        ]}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content' }}
      ></Table>
    </Space>
  );
};

const Index = () => {
  const changelog = [
    '已接入LINUX DO 授权登录',
    <>
      优化分组倍率计价系统, 分组倍率将细分为用户分组和令牌分组
      <br />
      用户分组：默认用户组(default)分组倍率为1倍
      <br />
      令牌分组：默认令牌组(default)分组倍率为2.5倍, OpenAI直连分组(openai_direct)分组倍率为5倍，Claude直连分组(claude_direct)分组倍率为5倍
      <br />
      如需修改令牌分组请联系站长。
    </>,
    '充值汇率为1.5元1刀'
  ];

  return (
    <Card
      bordered={false}
      styles={{
        body: { paddingLeft: 24, paddingRight: 24 }
      }}
    >
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Typography>
          <Title level={3}>更新日志</Title>
          {changelog.map((item, index) => (
            <Paragraph key={index}>
              {index + 1}.{item}
            </Paragraph>
          ))}
        </Typography>

        <Typography>
          <Title level={3}>介绍说明</Title>
          <Paragraph>1.AI API接口转发站</Paragraph>
          <Paragraph>2.本站渠道来源：OpenAI、Azure、AWS、GCP、逆向、其它渠道</Paragraph>
          <Paragraph>3.默认分组用户接口服务在官网直连以及其他渠道自动调优，如需官网直连，请联系站长修改分组。</Paragraph>
          <Paragraph>4.支持模型请查看下方模型介绍</Paragraph>
          <Paragraph>
            5.使用过程中有问题请发邮件至
            <Text copyable style={{ padding: '0 5px' }}>
              <a href="mailto:chirou.api@outlook.com">chirou.api@outlook.com</a>
            </Text>
            或者加入QQ群{' '}
            <Text copyable style={{ padding: '0 5px' }}>
              924076327
            </Text>
          </Paragraph>
          <Paragraph>
            6.每位注册用户都将获得{' '}
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              $1
            </Tag>{' '}
            的初始使用额度, 邀请新用户奖励
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              $0.5
            </Tag>
            的额度, 可使用全模型
          </Paragraph>
          <Paragraph>
            7.
            <Tag type="text" onClick={() => window.open('https://linux.do', 'blank')}>
              LinuxDo 论坛
            </Tag>
            用户注册时可再额外获得赠金。通过其他渠道注册本站的用户，请在绑定LinuxDo授权后在论坛私信（Username为）
            <Tag color={'red'} defaultChecked>
              {' '}
              @sunnysun
            </Tag>
            补发对应的奖励额度。
            <br />
            （论坛等级2级及以上，获得
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              论坛等级 - 1
            </Tag>{' '}
            的额度 ； 低于2级的获得
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              $0.5
            </Tag>{' '}
            的额度）
          </Paragraph>
          <Paragraph>
            8. 当前仅支持{' '}
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              Github
            </Tag>{' '}
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              QQ
            </Tag>
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              Gmail
            </Tag>
            的账号注册 ，谢谢🙏
          </Paragraph>
          <Paragraph>9.为了维持转发服务正常使用，将不定期清除非法用户（包括重复注册等任何形式的小号）；请使用真实邮箱注册</Paragraph>
          <Paragraph>
            10.受供应商和OpenAI政策影响，价格会随时调整，本站计价分组倍率
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              2.5倍
            </Tag>
            ，充值汇率为
            <Tag color={'red'} defaultChecked size="small" variant="outlined">
              1.5元=1刀
            </Tag>
            （模型计费详情请查看下方表格）
          </Paragraph>
        </Typography>

        <Typography>
          <Title level={3}>使用方法</Title>
          <Paragraph>1.注册完成后，创建一个令牌，复制令牌的 key 填写到对应的地方</Paragraph>
          <Paragraph>
            2.接口转发地址请修改为：
            <Text
              style={{
                margin: '0 5px'
              }}
              copyable
            >
              https://api.wochirou.com
            </Text>
            即可使用
          </Paragraph>
          <Paragraph>3.严令禁止使用api进行非法行为。系统每隔一段时间会定时清理日志记录，请知悉。</Paragraph>
        </Typography>

        <Typography>
          <Title level={3}>可用模型及计费介绍</Title>
          <Row bordered={false}>
            <Paragraph span={24}>
              本页面更新可能存在延迟，实际可用模型及计费请以设置页以及日志页为准{' '}
              <Button type="text" onClick={() => window.open('https://wochirou.com/panel/model_price')}>
                点击查看最新可用模型及计费列表
              </Button>
            </Paragraph>
            <Space direction={'vertical'} size={16} style={{ width: '100%' }}>
              {renderModalTable(
                [
                  {
                    name: 'gpt-3.5-turbo, gpt-3.5-turbo-0125',
                    inputTokens: '$0.0005',
                    outputTokens: '$0.0015',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-3.5-turbo-0301, gpt-3.5-turbo-0613',
                    inputTokens: '$0.0015',
                    outputTokens: '$0.002',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-3.5-turbo-1106',
                    inputTokens: '$0.001',
                    outputTokens: '$0.002',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-3.5-turbo-16k',
                    inputTokens: '$0.0015',
                    outputTokens: '$0.002',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-3.5-turbo-16k-0613',
                    inputTokens: '$0.003',
                    outputTokens: '$0.004',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4, gpt-4-0613',
                    inputTokens: '$0.03',
                    outputTokens: '$0.06',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-0125-preview, gpt-4-1106-preview, gpt-4-vision-preview',
                    inputTokens: '$0.01',
                    outputTokens: '$0.03',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-turbo, gpt-4-turbo-2024-04-09',
                    inputTokens: '$0.01',
                    outputTokens: '$0.03',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-turbo-preview',
                    inputTokens: '$0.01',
                    outputTokens: '$0.03',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-32k',
                    inputTokens: '$0.06',
                    outputTokens: '$0.12',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-32k-0613',
                    inputTokens: '$0.06',
                    outputTokens: '$0.12',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-32k-0314',
                    inputTokens: '$0.06',
                    outputTokens: '$0.12',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4o,gpt-4o-2024-05-13',
                    inputTokens: '$0.005',
                    outputTokens: '$0.015',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4o-mini,gpt-4o-mini-2024-07-18',
                    inputTokens: '$0.00015',
                    outputTokens: '$0.0006',
                    isSupport: '支持'
                  },
                  {
                    name: 'dall-e-3 1024x1024',
                    timesPrice: '$0.04 每次',
                    isSupport: '支持'
                  },
                  {
                    name: 'dall-e-3 1024x1792 / 1792x1024',
                    timesPrice: '$0.08 每次',
                    isSupport: '支持'
                  },
                  {
                    name: 'dall-e-3 hd 1024x1024',
                    timesPrice: '$0.08 每次',
                    isSupport: '支持'
                  },
                  {
                    name: 'dall-e-3 hd 1024x1792 / 1792x1024 ',
                    timesPrice: '$0.12 每次',
                    isSupport: '支持'
                  },

                  {
                    name: 'gpt-4-v',
                    timesPrice: '$0.1 每次',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-dalle',
                    timesPrice: '$0.1 每次',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-all',
                    timesPrice: '$0.1 每次',
                    isSupport: '支持'
                  },
                  {
                    name: 'gpt-4-gizmo-*',
                    timesPrice: '$0.1 每次'
                  },
                  {
                    name: 'tts-1',
                    characterPrice: '$0.015 / 1k characters',
                    isSupport: '支持'
                  },
                  {
                    name: 'tts-1-hd',
                    characterPrice: '$0.03 / 1k characters',
                    isSupport: '支持'
                  }
                ],
                'OpenAI'
              )}
              {renderModalTable(
                [
                  {
                    name: 'gemini-1.5-pro,gemini-1.5-pro-latest,gemini-1.5-pro-exp-0801',
                    inputTokens: '$0.0035',
                    outputTokens: '$0.0105'
                  },
                  {
                    name: 'gemini-1.5-flash,gemini-1.5-flash-latest',
                    inputTokens: '$0.00035',
                    outputTokens: '$0.00105'
                  },
                  {
                    name: 'gemini-1.0-pro,gemini-1.0-pro-latest',
                    inputTokens: '$0.0005',
                    outputTokens: '$0.0015'
                  }
                ],
                'Gemini'
              )}
              {renderModalTable(
                [
                  {
                    name: 'glm-3-turbo',
                    inputTokens: '$0.001',
                    outputTokens: '$0.001',
                    isSupport: '支持'
                  },
                  {
                    name: 'glm-4',
                    inputTokens: '$0.02',
                    outputTokens: '$0.02',
                    isSupport: '支持'
                  },
                  {
                    name: 'glm-4v',
                    inputTokens: '$0.02',
                    outputTokens: '$0.02',
                    isSupport: '支持'
                  }
                ],
                'ChatGLM 智谱清言'
              )}
              {renderModalTable(
                [
                  {
                    name: 'command-r',
                    inputTokens: '$0.0005',
                    outputTokens: '$0.0015',
                    isSupport: '支持'
                  },
                  {
                    name: 'command-r-plus',
                    inputTokens: '$0.003',
                    outputTokens: '$0.015',
                    isSupport: '支持'
                  }
                ],
                'Cohere'
              )}
              {renderModalTable(
                [
                  {
                    name: 'claude-3-5-sonnet-20240620',
                    inputTokens: '$0.003',
                    outputTokens: '$0.015',
                    isSupport: '支持'
                  },
                  {
                    name: 'claude-3-opus-20240229',
                    inputTokens: '$0.015',
                    outputTokens: '$0.075',
                    isSupport: '支持'
                  },
                  {
                    name: 'claude-3-sonnet-20240229',
                    inputTokens: '$0.003',
                    outputTokens: '$0.015',
                    isSupport: '支持'
                  },
                  {
                    name: 'claude-3-haiku-20240307',
                    inputTokens: '$0.00025',
                    outputTokens: '$0.00125',
                    isSupport: '支持'
                  }
                ],
                'Claude'
              )}
              {renderModalTable(
                [
                  {
                    name: 'qwen-plus',
                    inputTokens: '$0.04',
                    outputTokens: '$0.04',
                    isSupport: '支持'
                  },
                  {
                    name: 'qwen-plus-net',
                    inputTokens: '$0.04',
                    outputTokens: '$0.04',
                    isSupport: '支持'
                  },
                  {
                    name: 'qwen-turbo',
                    inputTokens: '$0.016',
                    outputTokens: '$0.016',
                    isSupport: '支持'
                  },
                  {
                    name: 'qwen-turbo-net',
                    inputTokens: '$0.016',
                    outputTokens: '$0.016',
                    isSupport: '支持'
                  }
                ],
                'DashScope 通义千问'
              )}
              {renderModalTable(
                [
                  {
                    name: 'meta-llama/llama-3.1-405b-instruct',
                    inputTokens: '$0.003',
                    outputTokens: '$0.003',
                    isSupport: '支持'
                  },
                  {
                    name: 'meta-llama/llama-3.1-70b-instruct',
                    inputTokens: '$0.0009',
                    outputTokens: '$0.0009',
                    isSupport: '支持'
                  },
                  {
                    name: 'meta-llama/llama-3.1-8b-instruct',
                    inputTokens: '$0.0002',
                    outputTokens: '$0.0002',
                    isSupport: '支持'
                  },
                  {
                    name: 'mixtral-8x7b-32768',
                    inputTokens: '$0.000405',
                    outputTokens: '$0.000405',
                    isSupport: '支持'
                  }
                ],
                '其他'
              )}
            </Space>
          </Row>
        </Typography>
      </Space>

      <Typography>
        最后说一句，根据
        <a href="https://www.gov.cn/zhengce/zhengceku/202307/content_6891752.htm">《生成式人工智能服务管理暂行办法》</a>
        规定，本站严格遵守相关规定，请切勿用于非法用途。
      </Typography>
    </Card>
  );
};

export default Index;
