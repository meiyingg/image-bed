# GitHub 图床设置指南

## 📋 概述
这个图床应用现在支持上传图片到GitHub并通过GitHub Pages访问，图片将永久保存。

## 🚀 快速开始

### 第一步：创建 GitHub 仓库

1. 打开 GitHub (https://github.com)
2. 创建一个新的 **公开仓库** (Public Repository)
   - 仓库名称：例如 `image-bed` 或 `images`
   - 描述：图片床存储库
   - 勾选 "Add a README file"

### 第二步：启用 GitHub Pages

1. 进入仓库 → 点击 **Settings**
2. 左侧菜单找到 **Pages**
3. 在 "Source" 下选择 **main** 分支
4. 点击 **Save**
5. 等待一会儿，会看到类似这样的提示：
   ```
   Your site is live at: https://yourusername.github.io/image-bed/
   ```

### 第三步：获取 GitHub Personal Access Token

1. 登录 GitHub，进入账户设置
2. 点击左侧 **Developer settings** → **Personal access tokens**
3. 选择 **Tokens (classic)** 或 **Fine-grained tokens**

#### 方式 A：Personal Access Tokens (Classic) - 推荐新手

1. 点击 **Generate new token (classic)**
2. 填写表单：
   - **Note**: 输入 `image-bed` 或类似名称
   - **Expiration**: 选择合适的过期时间（可以选择 No expiration）
   - **Scopes**: 勾选 `repo` 权限（这会自动勾选所有 repo 相关权限）
3. 点击 **Generate token**
4. **复制 Token**（只显示一次！保存好）

#### 方式 B：Fine-grained tokens - 更安全

1. 点击 **Generate new token (fine-grained)**
2. 填写表单：
   - **Token name**: `image-bed`
   - **Expiration**: 选择过期时间
   - **Repository access**: 选择 "Only select repositories" 并选择你的 image-bed 仓库
   - **Repository permissions**: 勾选 `contents` 权限
3. 点击 **Generate token**
4. **复制 Token**

### 第四步：在图床应用中配置

1. 打开 `http://localhost:8000` (或你的图床地址)
2. 点击右上角 **⚙️ 设置** 按钮
3. 填写以下信息：
   - **GitHub 用户名**: 你的 GitHub 用户名 (例如：meiying)
   - **仓库名称**: 你创建的仓库名 (例如：image-bed)
   - **Personal Access Token**: 粘贴刚才复制的 Token
   - **分支**: main（默认值）
4. 勾选 **记住此配置**（可选，会保存在本地浏览器）
5. 点击 **✅ 保存配置**

### 第五步：开始上传

1. 配置保存后，顶部会显示 ✅ 已连接
2. 拖拽或选择图片上传
3. 图片会自动上传到 GitHub
4. 点击图片可以：
   - 复制 Markdown 格式链接
   - 复制直接链接
   - 在 GitHub 中打开（查看文件）
   - 删除（从本地列表中删除）

## 🔗 生成的图片链接格式

上传后的图片链接格式：
```
https://{username}.github.io/{repo}/images/{timestamp}_{filename}
```

例如：
```
https://meiying.github.io/image-bed/images/1716862800000_screenshot.jpg
```

## 📝 使用 Markdown 链接

复制的 Markdown 链接格式：
```markdown
![screenshot.jpg](https://meiying.github.io/image-bed/images/1716862800000_screenshot.jpg)
```

## ⚠️ 重要提示

1. **Token 保管**
   - 不要分享你的 Token 给他人
   - 不要上传到公开仓库
   - 如果泄露，立即到 GitHub 删除该 Token

2. **仓库必须公开**
   - GitHub Pages 需要公开仓库
   - 图片对所有人可见

3. **文件大小限制**
   - GitHub 单个文件最大 100MB
   - 建议压缩大图片

4. **访问延迟**
   - 上传后可能需要几秒钟才能通过 GitHub Pages 访问
   - 如果无法访问，检查：
     - GitHub Pages 是否启用
     - Token 权限是否正确
     - 仓库名称是否正确

## 🔄 本地和 GitHub 上传

- **已配置 GitHub**: 所有图片上传到 GitHub（推荐）
- **未配置 GitHub**: 图片仅保存在浏览器本地（切换浏览器会丢失）

## 🆘 常见问题

### 1. 上传失败 "401 Unauthorized"
- Token 可能过期或错误
- 检查 Token 是否正确复制
- 确保 Token 有 `repo` 权限

### 2. 上传失败 "404 Not Found"
- 用户名或仓库名拼写错误
- 检查 GitHub Settings 中的设置

### 3. 上传成功但图片无法访问
- GitHub Pages 可能还未生成
- 等待 1-2 分钟后刷新
- 检查仓库 Settings 中 GitHub Pages 是否启用

### 4. 如何删除已上传的图片？
- 点击图片的 🗑️ 删除按钮只删除本地列表
- 要真正删除 GitHub 上的文件，需要到 GitHub 仓库手动删除

## 🚀 部署到 GitHub Pages

现在你有两个 GitHub 仓库：
1. **image-bed 仓库** - 存储这个图床应用代码
2. **image-bed 仓库** - 存储上传的图片（可以是同一个）

### 部署应用本身到 GitHub Pages

1. 创建新的仓库 `yourusername.github.io`（或其他名称）
2. 上传 index.html, css/, js/ 文件
3. 启用 GitHub Pages
4. 访问 `https://yourusername.github.io/`

## 💡 提示

- 使用带有时间戳的文件名可以避免覆盖同名文件
- 定期检查 GitHub 仓库的大小
- 可以为不同类型的图片使用不同的仓库
