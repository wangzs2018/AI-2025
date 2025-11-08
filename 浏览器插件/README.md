# 单词深义助手 (Chrome 扩展)

该扩展用于查询英文单词：词义 / 词根 / 词缀 / 派生词 / 助记，调用 Deepseek Chat API 生成结果并以单选按钮切换查看，支持复制结果与清除输入。当前版本仅展示这五项，与界面标签一一对应。

**新增功能：划词自动填充（增强版）**  
工作流程（三级回退）：
1. 页面内 `contentScript` 监听 `selectionchange`/`mouseup`/`dblclick` 捕获单词写入 `chrome.storage.local`。
2. 打开 popup 优先读取 storage；若无则向内容脚本发消息 `GET_SELECTED_WORD` 请求当前 selection。
3. 若仍失败再使用 `chrome.scripting.executeScript` 注入获取 selection。
最终将单词高亮填充但不自动查询，需手动点击“查询”。

> 注意：请自行在 `chrome.storage.sync` 中设置 API Key，不要将真实密钥写入仓库。文档提供的 `config.example.json` 仅作为字段参考，不会被加载。

## 功能特性
- **划词自动填充**：在网页中选中单词后打开扩展，单词自动出现在输入框（不自动查询）
- 输入单词 → 查询 → 输出结构化 5 大类字段（meaning/root/affixes/derivatives/mnemonic）
- 单行单选组快速切换显示
- 加载、错误提示
- 清除与复制按钮
- 解析失败回退正则提取 JSON
- Console 调试信息便于排查问题

## 目录结构
```
浏览器插件/
  manifest.json
  background.js
  contentScript.js   # 新增：监听页面划词并存储
  popup.html
  popup.js
  styles.css
  config.example.json
  浏览器插件.md  # 详细设计与过程日志
  README.md       # 简洁使用说明（当前文件）
```

## 安装加载
1. Chrome 地址栏输入 `chrome://extensions`。
2. 开启右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”并选择 `浏览器插件` 目录。
4. 图标显示后即可打开使用。

## 配置 API Key
在 popup 或后台 Service Worker 的 DevTools Console 中执行：
```javascript
chrome.storage.sync.set({ deepseekApiKey: 'sk-你的实际密钥' });
```
验证：
```javascript
chrome.storage.sync.get('deepseekApiKey', r => console.log(r));
```
清除：
```javascript
chrome.storage.sync.remove('deepseekApiKey');
```

## 使用步骤
1. 打开扩展 popup（可先在网页中选中单词，打开时会自动填充）。
2. 确认或输入单词，点击"查询"。
3. 等待"查询中..."结束后出现结果。
4. 通过上方单选切换不同字段内容（顺序：词义 / 词根 / 词缀 / 派生词 / 助记）。
5. 点"复制"复制当前显示文本；点"清除"重置。

### 划词使用流程
1. 在任意网页（如维基百科、博客等）选中或双击一个英文单词（仅字母，可含内部 `-` 或 `'`）。
2. 点击扩展图标。
3. 单词高亮出现在输入框（来自 storage / 消息 / scripting 回退之一）。
4. 确认后点“查询”。

失败场景与解决：
- 选中内容包含空格或符号 → 重新仅选单词。
- 页面协议受限（如 `chrome://`、PDF 内嵌）→ 在普通 http/https 页面测试。
- 第一次选中后马上关闭快速切换标签导致 content script 尚未捕获 → 再次选中或稍停 100ms 后再点图标。

## 常见问题
| 问题 | 说明 | 处理 |
|------|------|------|
| 未配置 API Key | 后台读取不到存储值 | 按"配置 API Key"章节设置 |
| 解析 JSON 失败 | Deepseek 返回包含多余说明 | 优化 prompt 或重试 |
| 结果字段为空 | 生僻词返回不足 | 显示占位文本，可再次查询 |
| 复制失败 | 剪贴板权限受限 | 再次点击，或手动选择文本复制 |
| 划词未填充 | 选中包含空格/符号或页面受限 | 仅支持单词字符；受限协议无法注入，改用普通网页测试 |

## 调试说明
扩展集成了 Console 调试信息，便于排查问题：
- **contentScript.js**：选中单词后会输出 `[ContentScript] 选中单词已存储: xxx`
- **popup.js**：打开时输出 `[Popup] 检测到划词选中: xxx` 或 `[Popup] 无划词选中`；查询时输出 `[Popup] 提交查询: xxx` 与 `[Popup] 查询成功`
- **background.js**：API 调用会输出请求与响应状态

打开扩展 popup 后按 F12 或右键"检查"查看 Console；查看 content script 日志需在页面 Console 中观察（需刷新页面后生效）。

## Prompt（后台使用）
```
请针对英文单词 "{word}" 给出 JSON 对象，字段: meaning(词义)，root(词根)，affixes(词缀细分可列出前缀/后缀)，derivatives(常见派生词数组)，mnemonic(助记)。只返回 JSON。
```

## 后续扩展建议
- Options 页面：可视化设置 API Key / 温度 / 模型
- 历史查询列表 & 本地缓存
- 例句 (examples) 字段真正接入
- 失败重试 + 指数退避
- 导出 Markdown / 一键复制全部

## 许可证
示例用途，自由修改再分发（请勿包含真实密钥）。
# 浏览器插件：单词深义助手

实现目标：开发一个 Chrome 扩展，输入英文单词后查询并展示 5 类信息：词义 (meaning)、词根 (root)、词缀 (affixes)、派生词 (derivatives)、助记 (mnemonic)。界面以单选切换展示各字段内容，数据来源于 Deepseek Chat API 生成的结构化 JSON。

## 功能需求概述
1. 点击扩展图标弹出 popup 页面。
2. 输入英文单词，点击“查询”按钮发起请求。
3. 后台 service worker 调用 Deepseek API，使用约束 Prompt 要求返回纯 JSON。
4. popup.js 接收返回数据，标准化字段并生成 5 个单选项。
5. 切换单选后区域显示对应内容。
6. 错误、加载状态友好提示；可键盘操作 (Enter 提交 / Radio 切换)。

## 目录结构
```
浏览器插件/
	manifest.json      # MV3 清单，声明 action + background + 权限
	background.js      # 与 Deepseek API 通信，消息响应 LOOKUP_WORD
	popup.html         # UI 结构（表单、结果区、单选容器）
	styles.css         # Popup 样式与布局
	popup.js           # 前端逻辑：发送消息、渲染单选、展示内容
	浏览器插件.md        # 文档（需求 + 用法 + 实现过程）
```

## 核心技术点
- Manifest V3：使用 service worker 而非旧版 background page。
- chrome.runtime.sendMessage / onMessage：popup 与 background 通信。
- chrome.storage.sync：存储用户的 API Key（当前示例使用占位说明，未硬编码密钥到代码）。
- Fetch Deepseek API：POST /chat/completions，模型 `deepseek-chat`，messages 列表中 system + user。
- 健壮解析：要求返回纯 JSON；若包含额外文本回退正则提取 `{...}` 再解析。

## API Key 安全说明
请勿在可提交的仓库中硬编码真实密钥。示例最初需求里提供的 key 已从文档中移除，不放入代码。
设置方式建议：
```js
// 在扩展页面（如 options.html 自建）里：
chrome.storage.sync.set({ deepseekApiKey: 'sk-xxxx' });
// background.js 调用 getApiKey() 读取
```
可后续添加一个 options 页（在 manifest.json 加入 options_page 或使用 chrome.runtime.openOptionsPage）。

## 使用步骤
1. 克隆/下载项目。
2. 打开 Chrome → 进入 扩展程序 管理 (chrome://extensions)。
3. 开启“开发者模式”。
4. 点“加载已解压的扩展程序”选择 `浏览器插件` 目录。
5. （可选）在控制台执行或自建 options 页面：
	 ```js
	 chrome.storage.sync.set({ deepseekApiKey: '你的实际密钥' });
	 ```
6. 点击扩展图标，输入单词，查询，切换单选查看不同字段。

## Prompt 设计
```
请针对英文单词 "{word}" 给出 JSON 对象，字段: meaning(词义)，root(词根)，affixes(词缀细分可列出前缀/后缀)，derivatives(常见派生词数组)，mnemonic(助记)。只返回 JSON。
```
System role 限制助手只输出有效 JSON，减少多余说明。

## 错误与异常处理
- 无 API Key：提示“未配置 API Key”。
- 网络 / HTTP 非 2xx：展示状态码与响应片段。
- JSON 解析失败：回退正则提取，仍失败则提示“解析 JSON 失败”。
- 字段缺失：popup 正常渲染，用“（无XX数据）”占位。

## 边缘情况
- 输入空字符串：阻止请求。
- 极短或非常生僻单词：API 可能返回空字段 → 占位提示。
- 请求较慢：显示“查询中...” loading 区域。
- 重复快速提交：后一次覆盖前一次结果，之前结果容器被清空。

## 可能的扩展方向
- 增加“自动复制某字段”按钮。
- 支持历史查询列表（存储最近 N 个词）。
- Options 页面：配置温度、模型、是否自动展开 first section。
- 国际化：添加英文界面。
- 将结果缓存到 chrome.storage 以减少重复请求。

## 已实现文件说明
### manifest.json
声明扩展名称、版本、action（popup.html）、background service_worker、storage 权限与 Deepseek API 域 host_permissions。

### background.js
监听消息 LOOKUP_WORD：调用 fetchWordData(word)。
函数内部：
- 读取 API Key。
- 构造 messages + temperature。
- fetch POST，处理响应、解析 JSON（含回退策略）。
- 异常包装为 sendResponse({ok:false,error:...}).

### popup.html
包含表单、结果展示 section、options 容器 (动态单选插入)，无脚本内联，引用 popup.js。采用基础语义标签与 aria-live 便于可访问性。

### styles.css
整体使用紧凑布局，Grid 布局单选项；选中态强调颜色；隐藏类 .hidden 控制显示；保持 340px 宽度兼容多数扩展窗口。

### popup.js
提交表单后发送消息；处理 loading / error；normalize 把返回对象统一为标准字段字符串；构造单选项并支持动态切换显示。

## 实现过程日志
1. 解析原始需求：输入单词 → 返回五类字段 → 单选切换显示。
2. 设计文件结构：MV3 必须 service_worker，独立 popup 与样式、逻辑分离。
3. 编写 manifest.json：声明 storage 与 host_permissions 以便后续调用 API 与保存密钥。
4. 编写 background.js：实现 fetchWordData 与 JSON 解析回退；添加 onMessage 监听。
5. 编写 popup.html：表单 + 结果区骨架，预留 optionGroup 容器。
6. 编写 styles.css：基础排版、响应单选选中态、loading / error 样式。
7. 实现 popup.js：表单提交、消息发送、数据标准化、动态生成单选与展示逻辑；首项自动选中。
8. 文档撰写：补充安全说明、使用步骤、扩展方向与过程日志。
9. 清理：移除文档中原始硬编码密钥，提示通过 storage 设置。

## 后续建议
- 添加 options 页面与 API Key 设置 UI。
- 引入速率限制与重试策略（比如指数退避）。
- 增加结果复制、导出 markdown 按钮。
- 添加缓存与最近查询列表。

---
文档至此完成，后续更新请追加“实现过程日志”新的序号条目以保持审计追踪。

