#### 说明

在没有 `node` 环境的情况下， 可以使用当前构建脚本。

#### 使用

0. 配置环境

- `.env` 文件内配置

```env
# 对外暴露的 hostname 用于访问
EXTERNAL_HOST="192.168.1.100"

# 本地翻译服务是额外的一个配置，所以需要额外配置生效

# 翻译服务 port 可以不设置
TRANSLATE_PORT="19212"
# 对外暴露的 翻译服务 port
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
    ports:
      - '39010:12833'
      - '39011:19212'
    environment:
      - EXTERNAL_HOST=192.168.1.100
      - TRANSLATE_EXTERNAL_PORT=39011
    restart:  on-failure:3 # always on-failure:3 or unless-stopped default "no"
  # open-prompt-studio end
```