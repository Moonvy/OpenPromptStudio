# 🥣 OPS/OpenPromptStudio

## 提示词工作室 | 可视化编辑提示词

[立即试试 moonvy.com/apps/ops/ ](https://moonvy.com/apps/ops/)

![](./doc%2Fassets%2F%E6%88%AA%E5%B1%8F2023-04-02%2001.31.05.png)

这是一个旨在把 AIGC 提示词（现在支持 Midjourney）可视化并提供编辑功能的工具，有以下特性

-   显示英文提示词的中文翻译
-   翻译输入的中文提示词到英文（因为 Midjourney 仅支持英文提示词）
-   为提示词进行分类（普通、样式、质量、命令）
-   轻松的排序、隐藏提示词
-   把提示词可视化结果导出为图片
-   常用提示词词典
-   通过 Notion 管理提示词词典

## 如何连接的我的 Noiton 来管理自己的词典

OPS 支持使用 [Noiton](https://www.notion.so/) 来管理自己的词典，使用 Notion 管理相对简单，可自定义程度也很高。

![ ](./doc/assets/notion-me.gif)

### 1. 复制「演示-AIGC 提示词库」

复制我们的演示文档的自己的 Notion 空间中

-   [演示-AIGC 提示词库](https://moonvy.notion.site/b768c5c1852f4e2fbaee1b4a99f26d49?v=346e91e8114648c59079eeea2d9d56c7)

保持表头定义： `text`, `subType`、`dir`、`lang_zh` 不要变（或者你可以新建一个 Notion 数据库，只要有这些表头 OPS 就能连接的这个数据库）

| 表头    | 作用                                                    |
| ------- | ------------------------------------------------------- |
| text    | 提示词原文（不区分大小写）                              |
| lang_zh | 对应的中文翻译                                          |
| subType | 提示词在 OPS 中的分类（`普通`、`风格`、`质量`、`命令`） |
| dir     | 词典中的分类，子分类用`/`分隔如：`风格/绘画风格`        |

### 2. 创建自己的 Noiton 集成插件（integrations）

要让 OPS 连接到自己的 Notion 数据库，需要创建一个自己的集成（integrations）。OPS 会通过此集成的权限连接到你的数据库。

-   打开 Notion 集成开发页面 [www.notion.so/my-integrations](https://www.notion.so/my-integrations)  
    点击 「+ new integrations」按钮创建一个新集成插件

    ![](./doc/assets/Myintegrations-1@2x.jpeg)

-   在集成插件页面中选择允许访问的 Notion 工作区（Workspace），你的 Notion 数据库需要创建在此工作区下，OPS 才能通过集成插件访问。

    ![](./doc/assets/Myintegrations-2@2x.jpeg)

-   集成扩展创建完毕后，复制 Token 秘钥保存下来，你将使用此 Token 作为访问凭证，请妥善保管不要在公开场合泄露。

    ![](./doc/assets/Myintegrations-3@2x.jpeg)

### 3. 在 OPS 中配置 Notion

在 OPS 右上角打开提示词词典，鼠标放在「连接我的 Noiton」按钮上，展开设置面板

-「Integrations Token」 里面填入前面我们生成的集成 Token 秘钥（秘钥只会保存在浏览器本地（localStorage），不会被上传到任何地方）

-   「Database ID」里粘贴你 Notion 数据库的访问地址

-   然后点击「载入」按钮

![](./doc/assets/notion-me-config-1.jpg)

#### 获取 Notion 数据库的访问地址（Database ID）

在 Notion 数据库菜单中点击 「Copy link to view」 就可以了

![获取 Notion 数据库地址](./doc/assets/notion-me-config-2.jpg)

现在我们在 [演示-AIGC 提示词库](https://www.notion.so/) 中管理提示词字典，之后开发让用户连接自己的 [Notion](https://www.notion.so/) 数据库的功能，让用户能更好的管理属于自己的词典。

运行 `npm run fetch` 把 2 个来源的数据整理在一起

## 更好的体验

你可以在 [zeroG 浏览器](https://moonvy.com/zeroG/) 里让 OPS
与 Discord 在一个无限画布中使用，获得更好的体验
![截屏2023-04-06 15.51.23.png](./doc%2Fassets%2F%E6%88%AA%E5%B1%8F2023-04-06%2015.51.23.png)

## 开发者

运行打开后访问 `localhost:12833/apps/ops/`

### 如何修改默认提示词词典

1. 在 [./data/src](https://github.com/Moonvy/OpenPromptStudio/tree/master/data/src) 中编辑 `.csv` 文件，你可以用 Excel、Numbers 或者纯文本编辑器编辑。

2. 在 [Notion](https://www.notion.so/) 中编辑（[./data/src/notion/fromNotion.js](https://github.com/Moonvy/OpenPromptStudio/tree/master/data/src/notion/fromNotion.js) ）

### 翻译服务

请连接自己的翻译服务
