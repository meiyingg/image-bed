# 📸 Image Bed - GitHub Pages 图床

一个简洁高效的图床管理应用，完全基于 GitHub Pages 构建，无需后端服务器。支持上传图片到 GitHub，通过浏览器本地存储来管理图片，支持实时预览、快速复制链接。

## ✨ 功能特性

- **📤 智能上传** - 支持拖拽上传、点击选择，批量处理多张图片
- **☁️ GitHub 集成** - 直接上传图片到 GitHub 仓库，通过 GitHub Pages 访问
- **🖼️ 图片预览** - 快速预览图片详情，实时显示上传进度
- **📋 一键复制** - 支持复制 Markdown 格式和纯链接
- **🔍 搜索功能** - 快速搜索找到需要的图片
- **🔤 多种排序** - 按上传时间、文件名、文件大小排序
- **💾 本地存储** - 所有数据存储在浏览器本地，隐私安全
- **📱 响应式设计** - 完美适配桌面、平板、手机设备
- **🎨 现代化UI** - 简洁美观的深蓝色主题设计

## 🚀 快速开始

### 方式一：本地开发

1. 克隆仓库：
```bash
git clone https://github.com/你的用户名/image-bed.git
cd image-bed
```

2. 使用任何 HTTP 服务器运行：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (需要 serve)
npx serve
```

3. 在浏览器中访问：`http://localhost:8000`

### 方式二：部署到 GitHub Pages（推荐）

1. Fork 本仓库到你的 GitHub 账户
2. 进入仓库设置，启用 GitHub Pages
3. 访问 `https://你的用户名.github.io/image-bed/`

### 方式三：一键配置 GitHub 上传

1. 按照 [GITHUB_SETUP.md](GITHUB_SETUP.md) 获取 Personal Access Token
2. 启动应用后，点击右上角 **⚙️ 设置**
3. 填入 GitHub 用户名、仓库名和 Token
4. 之后所有上传的图片自动保存到你的 GitHub 仓库

## 📂 项目结构

```
image-bed/
├── index.html           # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 主应用逻辑
├── README.md           # 项目说明
└── GITHUB_SETUP.md     # GitHub 配置指南
```

## 🔗 GitHub 集成说明

### 配置 GitHub 上传

1. **创建 GitHub 仓库** - 用于存储图片
2. **启用 GitHub Pages** - 在仓库设置中启用
3. **生成 Token** - 在 GitHub 账户设置中生成 Personal Access Token
4. **配置应用** - 在图床应用的设置面板中填入配置

详细步骤见 [GITHUB_SETUP.md](GITHUB_SETUP.md)

### 上传后的链接格式

```
https://{username}.github.io/{repo}/images/{timestamp}_{filename}
```

## 💡 使用建议

- **首次使用** - 先不配置 GitHub，体验本地功能
- **永久保存** - 配置 GitHub 以永久保存图片
- **多个仓库** - 可以为不同类型的图片使用不同仓库
- **备份** - 定期 Clone 你的图片仓库进行备份

## ⚠️ 注意事项

- GitHub 仓库需要 **公开**（Public）才能通过 GitHub Pages 访问
- 不要在公开仓库中提交你的 Token
- 如果 Token 泄露，立即在 GitHub 设置中删除
- 单个文件最大支持 100MB

## 🛠️ 技术栈

- **前端** - Vanilla JavaScript, HTML5, CSS3
- **存储** - Browser LocalStorage + GitHub API
- **托管** - GitHub Pages
- **API** - GitHub REST API v3

## 📖 常见问题

**Q: 如何删除已上传的图片？**  
A: 点击图片的 🗑️ 删除按钮会从本地列表中删除。要从 GitHub 删除，需要到仓库手动删除文件。

**Q: 没有配置 GitHub 会怎样？**  
A: 图片只会存储在浏览器本地，切换浏览器或清除缓存会丢失。

**Q: 如何迁移到另一台电脑？**  
A: 已配置 GitHub 的图片会在 GitHub 仓库中，重新配置后可以查看。本地图片需要手动导出或重新上传。

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**👉 [查看 GitHub 配置详细指南](GITHUB_SETUP.md)**
│   └── app.js          # 应用逻辑
├── images/             # 图片目录（可选）
└── README.md           # 本文档
```

## 🎯 使用指南

### 上传图片

1. **拖拽上传**：直接将图片拖到上传区域
2. **点击上传**：点击"选择图片"按钮选择文件
3. **批量上传**：可以一次选择多张图片

### 管理图片

- **预览**：点击图片覆盖层上的眼睛图标预览
- **复制链接**：
  - 📋 复制 Markdown 格式：`![名称](链接)`
  - 🔗 复制纯链接：直接复制图片链接
- **删除图片**：点击垃圾桶图标删除（不可恢复）

### 搜索和排序

- **搜索**：在搜索框输入图片名称快速过滤
- **排序**：
  - 最新上传：按上传时间排序
  - 名称排序：按文件名字母排序
  - 文件大小：按文件大小排序

## 🔐 数据安全

- ✅ 所有图片数据存储在浏览器 LocalStorage 中
- ✅ 不会上传到任何服务器
- ✅ 完全离线工作（首次加载后）
- ⚠️ 清空浏览器数据会导致图片丢失
- ⚠️ 不同浏览器/设备之间数据不同步

## 💡 常见问题

**Q：如何导出我的图片？**
A：浏览器的开发者工具 → Application → LocalStorage → 搜索 imageBed_images 即可看到所有图片数据（Base64 格式）

**Q：为什么上传的图片在另一个浏览器看不到？**
A：因为数据存储在浏览器本地，不同浏览器数据独立。可以考虑使用云存储方案。

**Q：可以增加云存储功能吗？**
A：可以！项目支持扩展。可以修改 `handleImageAction` 函数来集成 Imgur、又拍云等第三方 API。

**Q：有存储容量限制吗？**
A：LocalStorage 通常有 5-10MB 的限制（因浏览器而异）。建议定期清理不需要的图片。

## 🛠️ 技术栈

- HTML5
- CSS3
- Vanilla JavaScript（无框架依赖）
- LocalStorage API
- Fetch API

## 🎨 自定义配置

### 修改主题色

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary: #2563eb;           /* 主色调 */
    --primary-dark: #1e40af;      /* 深色 */
    --primary-light: #dbeafe;     /* 浅色 */
    --danger: #ef4444;            /* 删除按钮 */
}
```

### 增加功能

可以扩展的功能想法：
- [ ] 集成阿里云 OSS / 腾讯云 COS
- [ ] 添加图片压缩功能
- [ ] 支持图片编辑（裁剪、滤镜等）
- [ ] 导出/导入功能
- [ ] 分享功能

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎 PR 和 Issue！

## 📞 联系方式

如有问题或建议，欢迎提交 Issue 或联系我。

---

**⭐ 如果觉得有帮助，请给我一个 Star！**
