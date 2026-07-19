# Tera · 个人作品集网站

> 笔名 **Tera**（梁杰华）· 内容创作者 / 视频剪辑 · React + Vite

亮色系、高级、轻松、有科技感的单页作品集。版心约 1700px，面向 PC 端展示。

## 本地运行

```bash
npm install
npm run dev      # 启动开发服务器（默认 http://localhost:5173）
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览生产构建
```

## 页面结构

| 模块 | 文件 | 说明 |
| --- | --- | --- |
| 导航栏 | `src/components/Navbar.jsx` | 固定顶部，滚动变实，高亮当前区块 |
| 全屏首页 Hero | `src/components/Hero.jsx` | 视频背景 + 大标题 + 联系按钮 + 数据 |
| 个人经历 | `src/components/About.jsx` | 头像、介绍、联系方式、项目数据 |
| 精选项目 | `src/components/Projects.jsx` | 大卡片展示作品 |
| 个人优势 | `src/components/Strengths.jsx` | 能力卡片 |
| 底部联系 | `src/components/Contact.jsx` | 整屏深色收尾页 |

## 替换素材（可选）

把文件放进 `public/` 目录即可自动生效（缺省时显示渐变占位）：

- `public/hero.mp4` —— 首页全屏视频背景
- `public/hero-poster.jpg` —— 视频加载前的封面图
- `public/portrait.jpg` —— 个人头像 / 人物图（建议竖版 4:5）
- `public/work-anime.jpg`、`work-meme.jpg`、`work-ad.jpg`、`work-film.jpg` —— 各项目封面（建议 16:9）

## 修改文案

所有文字、数据、项目、优势集中在 **`src/data/content.js`**，改这一个文件即可更新全站内容。

## 设计令牌

主题色与圆角、阴影、版心宽度等都在 `src/styles/index.css` 顶部的 `:root` 变量里，统一调整很方便。
