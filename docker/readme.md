#### 说明

在没有 `node` 环境的情况下， 可以使用当前构建脚本。

#### 使用

1. 构建命令

```
docker build -t open_prompt_studio:v0.1 -f docker/dockerfile .
```

2. 运行容器

```
docker run -d -p 3000:12833 open_prompt_studio:v0.1
```

在浏览器内打开 `127.0.0.1:3000` 即可