# Docker 说明

## 使用 docker-compose 

最简单的部署方法是使用 docker-compose ：下载 [docker-compose.yml](https://github.com/Moonvy/OpenPromptStudio/blob/master/docker/docker-compose.yml) 文件，在所在目录下执行 `docker compose up -d`


```yml
version: "3.7"
services:
    # open-prompt-studio start
    open-prompt-studio:
        container_name: "open-prompt-studio"
        image: "open-prompt-studio:latest" # build by https://github.com/Moonvy/OpenPromptStudio
        environment:
            - TENCENT_SECRET_ID=AKIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            - TENCENT_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            - LOCAL_TRANSLATE_HOST=localhost:39011 # 自定义翻译服务地址，设置为你服务器最终访问地址
        ports:
            - "12833:12833" # 宿主 Web 页端口:容器端口
            - "39011:39011" # 宿主翻译服务端口:容器端口
        restart: on-failure:3 # always on-failure:3 or unless-stopped default "no"
    # open-prompt-studio end
```


## 构建

在没有 `node` 环境的情况下， 可以使用当前构建脚本。

### 构建命令

```
docker build -t open-prompt-studio:latest -f docker/dockerfile .
```

### 运行容器

```
docker run -d -p 12833:12833 -p 39011:39011 --name open-prompt-studio open-prompt-studio:latest
```

访问 [http://localhost:12833](http://localhost:12833) 就可以了

重新映射端口  
默认使用以下端口，如有需要可以在 docker 中重新映射

-   Web 访问端口：12833
-   翻译服务端口：39011

```bash
# 在宿主使用 80 和 3000 替换默认的 12833, 39011：
$ docker run -d -p 80:12833 -p 3000:19212 --name open-prompt-studio open-prompt-studio:latest
```

### 配置

#### `.env` 文件内配置

```env
# 腾讯翻译配置 https://bobtranslate.com/service/translate/tencent.html
TENCENT_SECRET_ID="AKIDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
TENCENT_SECRET_KEY="a5XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# 自定义翻译服务地址 [可选] (如果你部署在服务器上，通过此配置指定 Web 端访问翻译服务的地址)
# LOCAL_TRANSLATE_HOST="192.168.50.222:3000"
```


