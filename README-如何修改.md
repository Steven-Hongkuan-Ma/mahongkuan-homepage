# 马洪宽个人主页修改与发布说明

这个文件夹是一个静态个人主页，设计风格参考 `https://m0ck1ng.online/` 的学术主页版式：顶部导航、左侧个人资料、右侧学术内容流。

## 文件结构

- `index.html`：网页正文。姓名、简介、新闻、机器人演示、论文、项目、专利荣誉都在这里改。
- `styles.css`：页面样式。颜色、字号、间距、左右栏宽度和移动端适配都在这里改。
- `script.js`：机器人演示模块的 Canvas 动画。
- `assets/avatar.svg`：左侧头像占位图。
- `assets/soft-robot-demo.svg`：机器人演示模块图片。
- `assets/ma-hongkuan-cv.docx`：网页下载用简历。

## 常改位置

在 `index.html` 中搜索下面的关键词即可定位：

- `About`：个人简介。
- `News`：近期动态。
- `Robot Demo`：机器人演示模块。
- `Selected Publications`：代表论文。
- `Research Projects`：科研项目。
- `Patents & Awards`：专利与获奖。
- `Download CV`：简历下载按钮。

## 新闻和论文链接怎么改

新闻和论文现在都已经有 `https://` 超链接。部分条目使用的是精确检索链接，方便公开核验。以后如果拿到学校新闻页、比赛官网、出版社页面或 DOI 页面，只需要在 `index.html` 中找到对应 `<a href="...">`，把双引号里的网址替换成官方链接即可。

例如：

```html
<a href="https://www.bing.com/search?q=..." target="_blank" rel="noopener">新闻标题</a>
```

可以替换为：

```html
<a href="https://官方网页地址" target="_blank" rel="noopener">新闻标题</a>
```

## 替换头像

把新头像放到 `assets` 文件夹，例如命名为 `avatar.jpg`，然后把 `index.html` 中：

```html
assets/avatar.svg
```

改成：

```html
assets/avatar.jpg
```

## 替换机器人图片

把真实机器人图片放到 `assets` 文件夹，例如 `robot-demo.jpg`，然后把 `index.html` 中：

```html
assets/soft-robot-demo.svg
```

改成：

```html
assets/robot-demo.jpg
```

## 替换简历下载文件

把新的简历文件放到 `assets` 文件夹。如果文件名变了，需要同步修改 `index.html` 里的下载链接：

```html
assets/ma-hongkuan-cv.docx
```

## 让外人访问

本地路径如 `D:\Codex\mahongkuan-homepage\index.html` 或浏览器里的 `file:///...` 只能你自己的电脑打开，不是公网网址。外人要访问，必须把整个文件夹上传到公网静态托管平台，例如：

- GitHub Pages
- Netlify
- Vercel
- 学校/实验室服务器
- 你自己的域名服务器

部署后会得到类似这样的 HTTPS 地址：

```text
https://你的用户名.github.io/仓库名/
```

或：

```text
https://你的站点名.netlify.app/
```

上传时必须上传整个 `mahongkuan-homepage` 文件夹，不能只上传 `index.html`，否则样式、图片、动画和简历下载都会失效。
