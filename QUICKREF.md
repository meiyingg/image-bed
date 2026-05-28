# 快速参考卡

## 🚀 快速启动

### Windows
```bash
# 双击运行
start.bat

# 或在命令行
python -m http.server 8000
```

### Mac / Linux
```bash
# 运行脚本
bash start.sh

# 或直接运行
python3 -m http.server 8000
```

然后打开浏览器访问：`http://localhost:8000`

---

## ⚙️ GitHub 配置（3 步）

### 1️⃣ 获取 Token
- 访问：https://github.com/settings/tokens
- 选择：Personal access tokens (classic)
- 生成新 token，勾选 `repo` 权限
- 复制 token

### 2️⃣ 创建仓库
- 在 GitHub 创建公开仓库 (e.g., `image-bed`)
- 在 Settings → Pages 启用 GitHub Pages (main 分支)

### 3️⃣ 配置应用
- 点击应用右上角 **⚙️ 设置**
- 填入：用户名、仓库名、Token
- 点击 **✅ 保存**

---

## 📤 上传图片

1. **本地上传**
   - 拖拽图片到上传区域
   - 或点击按钮选择文件
   - 支持批量上传

2. **查看链接**
   - 配置 GitHub 后，点击图片预览
   - 显示完整的 GitHub Pages URL
   - 一键复制 Markdown 或纯链接

---

## 🔗 生成的链接格式

```
GitHub Pages URL:
https://username.github.io/repo/images/timestamp_filename.jpg

Markdown 格式:
![filename](https://username.github.io/repo/images/timestamp_filename.jpg)
```

---

## 🆘 故障排查

| 问题 | 解决方案 |
|------|---------|
| 401 Unauthorized | Token 错误或过期，重新生成 |
| 404 Not Found | 用户名/仓库名拼写错误 |
| 图片无法访问 | GitHub Pages 还未生成，等待 1-2 分钟 |
| 没配 GitHub | 图片只存本地，清缓存会丢失 |

---

## 📝 文件结构

```
image-bed/
├── index.html          ← 主应用界面
├── css/style.css       ← 样式文件
├── js/app.js           ← 核心逻辑
├── start.bat           ← Windows 启动脚本
├── start.sh            ← Mac/Linux 启动脚本
├── README.md           ← 项目说明
├── GITHUB_SETUP.md     ← 详细配置指南
└── QUICKREF.md         ← 本文件
```

---

## 💡 使用技巧

- ✅ **记住配置** - 勾选可在浏览器中保存设置
- 📋 **批量上传** - 支持一次选择多个文件
- 🔍 **搜索和排序** - 快速查找和整理图片
- 🗑️ **删除** - 从本地列表删除（GitHub 中需手动删除）
- 🌐 **在 GitHub 打开** - 查看和管理仓库中的文件

---

## ❓ FAQ

**Q: 不配 GitHub 行吗？**  
A: 可以，但图片只存在浏览器本地，清缓存会丢失。

**Q: 怎样分享图片？**  
A: 复制生成的 GitHub Pages URL 即可分享。

**Q: Token 泄露了怎么办？**  
A: 立即到 GitHub Settings 删除该 Token。

**Q: 能修改已上传的图片吗？**  
A: 不能，需要删除后重新上传新版本。

---

**📖 更多帮助：查看 [GITHUB_SETUP.md](GITHUB_SETUP.md)**
