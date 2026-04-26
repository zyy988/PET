# 🐕 宠物习惯召唤 (Pet Habit Gacha)

基于 **Next.js 14 + Supabase** 的宠物抽卡游戏，部署在 **Vercel** 上。

## 🎯 项目简介

每一次召唤，遇见特别的它！收集各种可爱的狗狗，发现它们独特的习惯和性格。

## 🏗️ 技术架构

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端框架** | Next.js 14 (App Router) | React框架，支持SSR/SSG/Server Actions |
| **样式方案** | Tailwind CSS | 原子化CSS框架 |
| **后端服务** | Supabase | PostgreSQL数据库 + Auth认证 + Realtime |
| **部署平台** | Vercel | 前端托管，自动CI/CD |
| **图片存储** | Supabase Storage | CDN加速的图片存储 |

## 📁 项目结构

```
pet-gacha/
├── app/                          # Next.js App Router
│   ├── layout.js                 # 根布局
│   ├── page.js                   # 首页（抽卡界面）
│   └── globals.css               # 全局样式
├── components/                   # React组件
│   ├── ResourceBar.jsx           # 顶部资源栏
│   ├── PoolSelector.jsx          # 左侧UP卡池
│   ├── GachaButton.jsx           # 抽卡按钮
│   ├── FunctionButtons.jsx       # 右侧功能按钮
│   ├── GachaAnimation.jsx        # 抽卡动画
│   └── ResultModal.jsx           # 结果展示弹窗
├── lib/                          # 工具库
│   ├── supabase.js               # Supabase客户端
│   └── gacha.js                  # 抽卡逻辑
├── public/                       # 静态资源
│   └── images/
│       └── pets/                 # 宠物图片
├── supabase/                     # 数据库迁移
│   └── migrations/
│       └── 001_initial.sql       # 初始化SQL
├── next.config.js                # Next.js配置
├── tailwind.config.js            # Tailwind配置
├── package.json                  # 依赖管理
└── README.md                     # 项目说明
```

## 🚀 如何运行该项目

### 方式一：本地开发环境

#### 1. 前置要求
- **Node.js 18+** ([下载地址](https://nodejs.org/))
- **npm** 或 **yarn** 包管理器

#### 2. 安装依赖
```bash
# 进入项目目录
cd pet-gacha

# 安装依赖
npm install
```

#### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.local.example .env.local

# 编辑 .env.local 文件，填入你的Supabase信息
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

#### 4. 启动开发服务器
```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

### 方式二：部署到Vercel（推荐）

#### 1. 准备Supabase项目
1. 访问 [Supabase](https://supabase.com/) 创建新项目
2. 在SQL编辑器中执行 `supabase/migrations/001_initial.sql`
3. 获取项目URL和匿名密钥（Settings > API）

#### 2. 部署到Vercel
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel
```

#### 3. 配置环境变量
在Vercel控制台中添加环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 4. 重新部署
```bash
vercel --prod
```

---

### 方式三：使用Docker（可选）

```bash
# 构建镜像
docker build -t pet-gacha .

# 运行容器
docker run -p 3000:3000 pet-gacha
```

## 🎮 游戏功能

### 核心玩法
- 🎲 **单抽/十连抽** - 消耗召唤券或钻石进行抽卡
- 🎯 **UP卡池** - 不同卡池有特定UP宠物
- 📚 **图鉴收集** - 收集所有15只可爱狗狗
- 💰 **资源管理** - 召唤券、钻石、金币三种货币

### 宠物稀有度
| 稀有度 | 概率 | 数量 |
|--------|------|------|
| ⭐ 普通 | 35% | 5只 |
| ⭐⭐ 稀有 | 30% | 4只 |
| ⭐⭐⭐ 史诗 | 25% | 3只 |
| ⭐⭐⭐⭐⭐ 传说 | 10% | 3只 |

### 15只可爱狗狗
- **普通**: 毛毛(博美)、雪宝(萨摩耶)、棉花糖(比熊)、小短腿(柯基)、柴柴(柴犬)
- **稀有**: 边牧博士、拉拉(拉布拉多)、金宝(金毛)、哈哈(哈士奇)
- **史诗**: 阿拉(阿拉斯加)、牛牛(法斗)、公主(贵宾)
- **传说**: 警长(德牧)、小猎(比格)、喜乐(喜乐蒂)

## 🗄️ 数据库说明

### 核心表结构

#### `pet_cards` - 宠物卡片表
存储所有可抽取的宠物信息

#### `profiles` - 用户资料表
扩展Supabase Auth的用户信息，包含资源数量

#### `user_collections` - 用户收藏表
记录用户已收集的宠物

#### `draw_history` - 抽卡记录表
记录用户的抽卡历史

#### `pool_configs` - 卡池配置表
配置不同卡池的概率和UP宠物

### 数据库关系图
```
auth.users ──1:1──> profiles
profiles ──1:N──> user_collections
profiles ──1:N──> draw_history
pet_cards ──1:N──> user_collections
pet_cards ──1:N──> draw_history
```

## 🔧 开发指南

### 添加新宠物
1. 准备宠物图片，放入 `public/images/pets/`
2. 在 `supabase/migrations/` 中添加INSERT语句
3. 执行SQL迁移

### 修改抽卡概率
1. 修改 `pool_configs` 表中的 `rates` JSON字段
2. 或修改 `lib/gacha.js` 中的逻辑

### 自定义UI
- 修改 `tailwind.config.js` 中的主题配置
- 修改各组件的样式

## 📱 响应式设计

游戏支持多种设备：
- 💻 **桌面端** - 完整布局，左右侧边栏
- 📱 **平板** - 自适应布局
- 📲 **手机** - 单列布局，底部导航

## 🌟 技术亮点

- ⚡ **Server Actions** - Next.js 14服务端操作
- 🔄 **Realtime** - Supabase实时数据同步
- 🔐 **Row Level Security** - 行级安全策略
- 🎨 **Tailwind CSS** - 原子化样式
- 📦 **组件化架构** - 可复用的React组件

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Supabase](https://supabase.com/) - 开源Firebase替代
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Vercel](https://vercel.com/) - 部署平台

---

**🎉 开始你的宠物召唤之旅吧！**
