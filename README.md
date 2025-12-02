# Anchor - 长期提醒管理系统

基于 Cloudflare Workers 的轻量级长期提醒管理系统，帮助您轻松跟踪各类长期任务和事件的到期时间，并通过邮件发送及时提醒。

## ✨ 功能特色

### 🎯 核心功能
- **任务管理**：添加、编辑、删除各类提醒任务
- **智能提醒**：自定义提前提醒天数，支持重复任务
- **状态管理**：任务状态跟踪（活跃/已完成），过期状态自动识别
- **重复任务**：支持设置任务重复周期，完成后自动创建下一轮任务

### 📧 邮件通知
- **专业邮件服务**：基于 Resend 的专业邮件发送服务
- **智能提醒策略**：
  - 提前提醒：在设定天数前发送提醒
  - 逾期提醒：根据紧急程度（Urgent/Normal）采用不同频率
    - 紧急任务：每天提醒一次
    - 普通任务：每周提醒一次
- **美观的邮件模板**：清晰的任务信息和状态展示

### 🔐 密码认证
- **访问控制**：支持设置访问密码保护应用
- **Cookie 认证**：登录后记住认证状态
- **API 保护**：未认证用户无法访问 API 端点

### 🎨 用户体验
- **响应式设计**：完美适配桌面端和移动端
- **实时交互**：流畅的任务管理体验
- **简洁界面**：直观的操作界面

## 🚀 部署指南

### 前提条件

- Cloudflare 账户
- Resend 账户（用于发送邮件通知）

### 部署步骤

#### 方法一：使用 Wrangler CLI（推荐）

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **配置 Secrets**：
   设置 Resend API Key（必需）：
   ```bash
   npx wrangler secret put RESEND_API_KEY
   # 输入您的 Resend API Key
   ```

   可选：设置访问密码（如果不设置则无需认证）：
   ```bash
   npx wrangler secret put ACCESS_PASSWORD
   # 输入您想要的访问密码
   ```

   可选：设置邮件相关配置：
   ```bash
   npx wrangler secret put SENDER_EMAIL
   # 输入发件人邮箱（必须在 Resend 验证过）

   npx wrangler secret put RECEIVER_EMAIL
   # 输入收件人邮箱
   ```

   或者在 `wrangler.toml` 中配置：
   ```toml
   [vars]
   SENDER_EMAIL = "your-email@example.com"
   RECEIVER_EMAIL = "recipient@example.com"
   ```

3. **数据库设置**：
   创建 D1 数据库：
   ```bash
   npx wrangler d1 create anchor-db
   ```

   更新 `wrangler.toml` 中的 `database_id`：
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "anchor-db"
   database_id = "your-database-id-here"
   ```

   应用数据库 schema：
   ```bash
   # 本地开发
   npx wrangler d1 execute anchor-db --local --file=./schema.sql

   # 生产环境
   npx wrangler d1 execute anchor-db --remote --file=./schema.sql
   ```

4. **部署**：
   ```bash
   npx wrangler deploy
   ```

#### 方法二：手动部署到 Cloudflare Dashboard

1. **创建 Worker**：
   - 登录 Cloudflare Dashboard
   - 进入 Workers & Pages
   - 创建新的 Worker
   - 将 `src/index.js` 和 `src/html.js` 的内容粘贴到 Worker 编辑器

2. **创建 D1 数据库**：
   - 在 Workers & Pages 中选择 D1
   - 创建数据库，命名为 `anchor-db`
   - 在 Worker 设置中添加绑定，名称设为 `DB`
   - 执行 `schema.sql` 中的 SQL 语句创建表结构

3. **配置环境变量**：
   - 在 Worker 设置中添加 Secret
   - 添加 `RESEND_API_KEY`（必需）
   - 可选添加 `ACCESS_PASSWORD`、`SENDER_EMAIL`、`RECEIVER_EMAIL`

4. **设置 Cron 触发器**：
   - 在 Worker 设置的 Triggers 标签页
   - 添加 Cron 触发器：`0 17 * * *`（每天 UTC 17:00 执行，对应北京时间次日凌晨 1:00，建议根据需求调整）

## 📋 开始使用

### 1️⃣ 访问应用
- 打开部署后的域名
- 如果设置了访问密码，输入密码进入系统

### 2️⃣ 添加提醒任务
1. 点击"添加提醒"按钮
2. 填写任务信息：
   - **标题**：任务名称
   - **目标日期**：任务到期日
   - **紧急程度**：Urgent（紧急）或 Normal（普通）
   - **提前提醒**：提前多少天开始提醒（默认 7 天）
   - **重复周期**：如果任务需要重复，设置重复天数（0 表示不重复）
   - **备注**：可选的任务描述
3. 点击保存

### 3️⃣ 管理任务
- **编辑**：点击任务卡片编辑任务内容
- **标记完成**：点击复选框将任务标记为已完成
- **删除**：点击删除按钮移除任务

### 4️⃣ 享受智能提醒
- 系统会根据设置自动发送邮件提醒
- 重复任务完成后会自动创建下一轮任务

## 🔧 邮件通知配置

### Resend 设置
1. **注册 Resend**：访问 [resend.com](https://resend.com) 注册账户
2. **添加域名**：在 Resend 控制台添加并验证您的域名
3. **获取 API Key**：在 API Keys 页面生成新的 API Key
4. **配置环境变量**：
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```

### 邮件发送逻辑
- **发件人**：使用 `SENDER_EMAIL` 环境变量，或默认为 `onboarding@resend.dev`
- **收件人**：使用 `RECEIVER_EMAIL` 环境变量，或默认为 `delivered@resend.dev`
- **邮件内容**：包含任务标题、目标日期、紧急程度和备注

### 通知时间说明
- Cloudflare Workers 的 Cron 表达式使用 **UTC 时区**
- 默认配置 `0 17 * * *` 表示每天 UTC 17:00 执行
- 如需北京时间（UTC+8）早上 8 点提醒，可设置为 `0 0 * * *`
- 如需其他时间，请相应调整 Cron 表达式

## 🛠️ 本地开发

```bash
# 启动本地开发服务器
npx wrangler dev

# 访问应用
# 打开 http://localhost:8787

# 测试 Cron 任务
curl "http://localhost:8787/__scheduled?cron=0+17+*+*+*"
```

## 📦 项目结构

```
Anchor/
├── src/
│   ├── index.js      # 主应用逻辑
│   └── html.js       # 前端 HTML/JavaScript/CSS
├── schema.sql        # 数据库表结构
├── wrangler.toml     # Cloudflare Workers 配置
├── package.json      # 项目依赖
└── README.md         # 项目说明
```

## 🔒 安全说明

- **密码保护**：可选的访问密码功能，建议生产环境启用
- **环境变量**：所有敏感信息（API Key、密码等）均通过环境变量配置，不会硬编码在代码中
- **Cookie 安全**：认证 Cookie 设置为 HttpOnly，降低 XSS 风险
- **数据库**：使用 Cloudflare D1，数据存储在 Cloudflare 的全球网络中

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License

## 🙏 致谢

- 基于 Cloudflare Workers 和 D1 构建
- 邮件服务由 Resend 提供
- 灵感来源于[SubsTracker - 订阅管理与提醒系统](https://github.com/mangguo02/sub)
