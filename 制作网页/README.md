# 静态网页示例

本目录包含一个示例讲师与课程展示的静态站点：主页 (index.html) 与两种形式的课程详情：单页动态 detail.html（通过 URL 参数）以及 4 个静态独立页面。

## 文件结构
```
制作网页/
  index.html               # 主页：讲师简介 + 课程列表（搜索 + 轮播）
  detail.html              # 动态详情页：通过 ?id= 加载内容与背景图
  ai-foundation.html       # 静态详情：人工智能基础入门
  ml-practice.html         # 静态详情：机器学习实战进阶
  nlp-modern.html          # 静态详情：现代 NLP 与大模型
  data-visual.html         # 静态详情：数据可视化与讲故事
  images/hero-*.svg        # 详情页顶部背景占位图（可替换为 Unsplash/Pexels 实际图片）
  assets/
    css/style.css          # 样式（主题 / 轮播 / 卡片背景 / 详情页 hero）
    js/main.js             # 数据集 + 动态渲染（主页/单页详情）
  制作网页.md               # 需求说明
```

## 功能特性
- 课程数据内嵌在 main.js 中，无需后端
- 主页支持搜索过滤（标题、副标题、标签）
- 详情页使用 URL 参数 `id` 加载对应课程
- 深色 / 浅色主题切换（本地存储记忆）
- 响应式布局，适配移动端
- 语义化标签与基础可访问性（ARIA、`alt`）

## 使用方式
直接用浏览器打开 `index.html` 浏览；可选择两种方式查看详情：
1. 动态：点击课程卡片跳转 `detail.html?id=xxx`（同一模板，便于扩展多课程）
2. 静态：手动访问对应 `ai-foundation.html` 等页面（可单独 SEO 优化）

### 在本地通过 VS Code Live Server 或简易 HTTP 服务
```powershell
# 方法 1：Python 简易服务
python -m http.server 8000
# 然后访问 http://localhost:8000/制作网页/index.html

# 方法 2：Node (若已安装)
npx serve .
```

## 添加或修改课程
编辑 `assets/js/main.js` 中 `dataset` 数组，新增对象字段：
```js
{
  id: '唯一ID',
  title: '课程标题',
  subtitle: '课程副标题',
  description: '课程描述',
  duration: '时长，如 12 小时',
  level: '难度，如 初级/中级/高级',
  updated: '更新日期 2025-10',
  outline: ['章节1','章节2'],
  tags: ['标签1','标签2']
}
```

## 可拓展点
- 使用 JSON 文件 + AJAX 加载（需本地 server）
- 增加分页、标签筛选 / 多条件过滤
- 集成静态生成工具 (Eleventy / Astro) 生成独立课程页
- 替换 hero-*.svg 为真实 Unsplash/Pexels 图片（注意版权授权条款）
- 课程卡片添加“收藏”与本地存储状态
- 加入懒加载与骨架屏体验

## License
示例用途，可自由修改。
