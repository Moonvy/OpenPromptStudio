#### 说明

在没有 `node` 环境的情况下， 可以使用当前构建脚本。

#### 使用

0. 配置环境

- `.env` 文件内配置

```env
# 工具服务端口，不设置默认为 12833
PORT="12833"

# 本地翻译服务是额外的一个配置，所以需要额外配置生效
# 翻译服务 port 可以不设置，不设置默认为 19212
#TRANSLATE_PORT="19212"
# 如果是 docker 部署 不要设置，自动获取
#TRANSLATE_HOST="localhost"

# 对外暴露的 翻译服务用于 docker 环境 必须设置
TRANSLATE_EXTERNAL_HOST="192.168.1.100"
TRANSLATE_EXTERNAL_PORT="39011"

# 翻译机配置 https://bobtranslate.com/service/translate/tencent.html
TENCENT_SECRET_ID="AKIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
TENCENT_SECRET_KEY="a5XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

1. 构建命令

```
docker build -t open-prompt-studio:latest -f docker/dockerfile .
```

2. 运行容器

```
$ docker run -d -p 39010:12833 -p 39011:19212 --name open-prompt-studio open-prompt-studio:latest
```

在浏览器内打开 `127.0.0.1:39010` 即可

- docker-compose

```yml
version: '3.7'
services:
  # open-prompt-studio start
  open-prompt-studio:
    container_name: 'open-prompt-studio'
    image: 'open-prompt-studio:latest' # build by https://github.com/Moonvy/OpenPromptStudio
    environment:
      - TENCENT_SECRET_ID=AKIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - TENCENT_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      - TRANSLATE_PORT=19212 # 容器运行本地翻译服务 port
      - TRANSLATE_EXTERNAL_PORT=39011 # 外部访问翻译服务端口
      - TRANSLATE_EXTERNAL_HOST=192.168.50.60 # 外部访问翻译服务地址，也可以是域名
    ports:
      - '39011:19212' # TRANSLATE_EXTERNAL_PORT:TRANSLATE_PORT
      - '39010:12833' # EXTERNAL_PORT:PORT
    restart:  on-failure:3 # always on-failure:3 or unless-stopped default "no"
  # open-prompt-studio end
```