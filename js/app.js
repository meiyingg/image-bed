class FileBed {
    constructor() {
        // Backward compatible with the old "image bed" storage keys so existing uploads survive.
        this.files = JSON.parse(localStorage.getItem('imageBed_images')) || [];
        this.githubConfig = JSON.parse(localStorage.getItem('imageBed_github')) || {};

        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.gallery = document.getElementById('gallery');
        this.emptyState = document.getElementById('emptyState');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.progressContainer = document.getElementById('progressContainer');
        this.previewModal = document.getElementById('previewModal');
        this.closeModal = document.getElementById('closeModal');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.settingsForm = document.getElementById('settingsForm');

        this.initEventListeners();
        this.updateGithubStatus();
        this.renderGallery();
    }

    initEventListeners() {
        // Settings
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        this.settingsForm.addEventListener('submit', (e) => this.saveGithubConfig(e));
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettingsModal();
        });

        // Upload area
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Search and sort
        this.searchInput.addEventListener('input', () => this.renderGallery());
        this.sortSelect.addEventListener('change', () => this.renderGallery());

        // Modal
        this.closeModal.addEventListener('click', () => this.closePreviewModal());
        this.previewModal.addEventListener('click', (e) => {
            if (e.target === this.previewModal) this.closePreviewModal();
        });
    }

    // GitHub Settings Methods
    openSettings() {
        document.getElementById('githubUsername').value = this.githubConfig.username || '';
        document.getElementById('githubRepo').value = this.githubConfig.repo || '';
        document.getElementById('githubToken').value = this.githubConfig.token || '';
        document.getElementById('githubBranch').value = this.githubConfig.branch || 'main';
        document.getElementById('rememberConfig').checked = !!this.githubConfig.username;
        this.settingsModal.style.display = 'flex';
    }

    closeSettingsModal() {
        this.settingsModal.style.display = 'none';
        document.getElementById('statusMessage').style.display = 'none';
    }

    saveGithubConfig(e) {
        e.preventDefault();
        const username = document.getElementById('githubUsername').value.trim();
        const repo = document.getElementById('githubRepo').value.trim();
        const token = document.getElementById('githubToken').value.trim();
        const branch = document.getElementById('githubBranch').value.trim() || 'main';
        const remember = document.getElementById('rememberConfig').checked;

        if (!username || !repo || !token) {
            this.showMessage('请填写所有必需字段', 'error');
            return;
        }

        this.githubConfig = { username, repo, token, branch };
        if (remember) {
            localStorage.setItem('imageBed_github', JSON.stringify(this.githubConfig));
        } else {
            localStorage.removeItem('imageBed_github');
        }

        this.updateGithubStatus();
        this.showMessage('✅ 配置保存成功！', 'success');
        setTimeout(() => this.closeSettingsModal(), 1500);
    }

    updateGithubStatus() {
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');

        if (this.githubConfig.username) {
            statusIcon.textContent = '✅';
            statusText.textContent = `已连接: ${this.githubConfig.username}/${this.githubConfig.repo}`;
        } else {
            statusIcon.textContent = '❌';
            statusText.textContent = '未配置 GitHub';
        }
    }

    showMessage(text, type) {
        const msg = document.getElementById('statusMessage');
        msg.textContent = text;
        msg.className = `status-message ${type}`;
        msg.style.display = 'block';
    }

    // Upload Methods
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        this.processFiles(e.dataTransfer.files);
    }

    handleFileSelect(e) {
        this.processFiles(e.target.files);
        e.target.value = '';
    }

    processFiles(fileList) {
        const files = Array.from(fileList);

        if (files.length === 0) {
            alert('请选择要上传的文件');
            return;
        }

        if (this.githubConfig.username) {
            this.uploadToGithub(files);
        } else {
            this.uploadLocal(files);
        }
    }

    isImage(file) {
        // `file` may be a File object (has .type) or a stored item.
        return (file.type || '').startsWith('image/');
    }

    uploadLocal(files) {
        this.progressContainer.style.display = 'block';
        let uploadedCount = 0;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedCount++;
                this.files.unshift({
                    id: this.generateId(),
                    name: file.name,
                    src: e.target.result,
                    size: file.size,
                    timestamp: new Date().getTime(),
                    type: file.type,
                    isImage: this.isImage(file),
                    isLocal: true
                });

                const progress = Math.round((uploadedCount / files.length) * 100);
                document.getElementById('progressFill').style.width = progress + '%';
                document.getElementById('progressText').textContent = `上传进度: ${progress}%`;

                if (uploadedCount === files.length) {
                    this.saveFiles();
                    this.renderGallery();
                    setTimeout(() => {
                        this.progressContainer.style.display = 'none';
                        document.getElementById('progressFill').style.width = '0%';
                    }, 1000);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    async uploadToGithub(files) {
        this.progressContainer.style.display = 'block';
        let uploadedCount = 0;

        for (const file of files) {
            try {
                document.getElementById('progressText').textContent = `上传中: ${file.name}...`;
                const { githubUrl, path } = await this.uploadFileToGithub(file);

                uploadedCount++;
                this.files.unshift({
                    id: this.generateId(),
                    name: file.name,
                    src: this.isImage(file) ? githubUrl : '',
                    githubUrl: githubUrl,
                    path: path,
                    size: file.size,
                    timestamp: new Date().getTime(),
                    type: file.type,
                    isImage: this.isImage(file),
                    isLocal: false
                });

                const progress = Math.round((uploadedCount / files.length) * 100);
                document.getElementById('progressFill').style.width = progress + '%';
                document.getElementById('progressText').textContent = `上传进度: ${progress}%`;
            } catch (error) {
                console.error(`上传 ${file.name} 失败:`, error);
                alert(`上传 ${file.name} 失败: ${error.message}`);
            }
        }

        if (uploadedCount > 0) {
            this.saveFiles();
            this.renderGallery();
        }

        setTimeout(() => {
            this.progressContainer.style.display = 'none';
            document.getElementById('progressFill').style.width = '0%';
        }, 1000);
    }

    async uploadFileToGithub(file) {
        const { username, repo, token, branch } = this.githubConfig;
        const timestamp = new Date().getTime();
        // Sanitize the name and keep images under images/, everything else under files/.
        const safeName = file.name.replace(/[^\w.\-]+/g, '_');
        const dir = this.isImage(file) ? 'images' : 'files';
        const filename = `${timestamp}_${safeName}`;
        const path = `${dir}/${filename}`;

        // Convert file to base64 (strip the data URL prefix).
        const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const url = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload ${filename}`,
                content: base64Content,
                branch: branch
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        const githubUrl = `https://${username}.github.io/${repo}/${path}`;
        return { githubUrl, path };
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveFiles() {
        try {
            localStorage.setItem('imageBed_images', JSON.stringify(this.files));
        } catch (err) {
            console.error('保存到本地存储失败:', err);
            alert('本地存储空间不足，无法保存文件预览数据。配置 GitHub 后上传可避免该问题。');
        }
    }

    // Pick an emoji icon for a non-image file based on extension / mime type.
    getFileIcon(item) {
        const name = (item.name || '').toLowerCase();
        const ext = name.includes('.') ? name.split('.').pop() : '';
        const type = item.type || '';

        const byExt = {
            pdf: '📕',
            doc: '📘', docx: '📘',
            xls: '📗', xlsx: '📗', csv: '📗',
            ppt: '📙', pptx: '📙',
            zip: '🗜️', rar: '🗜️', '7z': '🗜️', gz: '🗜️', tar: '🗜️',
            txt: '📄', md: '📝', rtf: '📄',
            mp3: '🎵', wav: '🎵', flac: '🎵', m4a: '🎵',
            mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬', webm: '🎬',
            js: '💻', ts: '💻', py: '💻', java: '💻', c: '💻', cpp: '💻',
            html: '💻', css: '💻', json: '💻', xml: '💻', sh: '💻',
        };

        if (byExt[ext]) return byExt[ext];
        if (type.startsWith('video/')) return '🎬';
        if (type.startsWith('audio/')) return '🎵';
        if (type.startsWith('text/')) return '📄';
        return '📦';
    }

    formatSize(bytes) {
        if (!bytes && bytes !== 0) return '未知';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let i = 0;
        while (size >= 1024 && i < units.length - 1) {
            size /= 1024;
            i++;
        }
        return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
    }

    getFilteredFiles() {
        let filtered = this.files;

        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(f => f.name.toLowerCase().includes(searchTerm));
        }

        const sortBy = this.sortSelect.value;
        switch (sortBy) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'size':
                filtered.sort((a, b) => a.size - b.size);
                break;
            case 'recent':
            default:
                filtered.sort((a, b) => b.timestamp - a.timestamp);
        }

        return filtered;
    }

    renderGallery() {
        const files = this.getFilteredFiles();

        if (files.length === 0) {
            this.gallery.style.display = 'none';
            this.emptyState.style.display = 'block';
            return;
        }

        this.gallery.style.display = 'grid';
        this.emptyState.style.display = 'none';
        this.gallery.innerHTML = '';

        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const preview = (file.isImage && file.src)
                ? `<img src="${file.src}" alt="${file.name}">`
                : `<div class="file-card">
                       <div class="file-card-icon">${this.getFileIcon(file)}</div>
                       <div class="file-card-name">${file.name}</div>
                   </div>`;

            item.innerHTML = `
                ${preview}
                <div class="gallery-overlay">
                    <div class="overlay-actions">
                        <button class="overlay-btn" data-id="${file.id}" data-action="preview" title="预览">👁️</button>
                        <button class="overlay-btn" data-id="${file.id}" data-action="copy" title="复制链接">📋</button>
                        <button class="overlay-btn" data-id="${file.id}" data-action="delete" title="删除">🗑️</button>
                    </div>
                </div>
            `;

            item.querySelectorAll('.overlay-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleFileAction(btn.dataset.id, btn.dataset.action);
                });
            });

            this.gallery.appendChild(item);
        });
    }

    handleFileAction(fileId, action) {
        const file = this.files.find(f => f.id === fileId);
        if (!file) return;

        switch (action) {
            case 'preview':
                this.showPreview(file);
                break;
            case 'copy':
                this.copyFileUrl(file);
                break;
            case 'delete':
                this.deleteFile(fileId);
                break;
        }
    }

    showPreview(file) {
        const img = document.getElementById('previewImage');
        const iconBox = document.getElementById('previewFileIcon');

        if (file.isImage && file.src) {
            img.src = file.src;
            img.style.display = 'block';
            iconBox.style.display = 'none';
        } else {
            img.style.display = 'none';
            iconBox.textContent = this.getFileIcon(file);
            iconBox.style.display = 'flex';
        }

        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileType').textContent = file.type || '未知';
        document.getElementById('fileSize').textContent = this.formatSize(file.size);

        const openBtn = document.getElementById('openFile');
        if (file.githubUrl) {
            document.getElementById('fileUrl').style.display = 'block';
            document.getElementById('fileUrlValue').textContent = file.githubUrl;
            openBtn.style.display = 'inline-block';
            openBtn.onclick = () => window.open(file.githubUrl, '_blank');
        } else {
            document.getElementById('fileUrl').style.display = 'none';
            // Local non-github files can still be opened/downloaded via their data URL.
            if (file.src) {
                openBtn.style.display = 'inline-block';
                openBtn.onclick = () => window.open(file.src, '_blank');
            } else {
                openBtn.style.display = 'none';
            }
        }

        document.getElementById('copyMarkdown').onclick = () => this.copyMarkdownLink(file);
        document.getElementById('copyUrl').onclick = () => this.copyFileUrl(file);
        document.getElementById('deleteFile').onclick = () => {
            this.deleteFile(file.id);
            this.closePreviewModal();
        };

        this.previewModal.style.display = 'flex';
    }

    closePreviewModal() {
        this.previewModal.style.display = 'none';
    }

    copyMarkdownLink(file) {
        const url = file.githubUrl || file.src;
        // Images embed with ![], other files link with [].
        const markdown = file.isImage
            ? `![${file.name}](${url})`
            : `[${file.name}](${url})`;
        this.copyToClipboard(markdown, 'Markdown链接已复制！');
    }

    copyFileUrl(file) {
        const url = file.githubUrl || file.src;
        if (!url) {
            alert('该文件没有可复制的链接');
            return;
        }
        this.copyToClipboard(url, '文件链接已复制！');
    }

    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            alert(message);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    }

    deleteFile(fileId) {
        if (!confirm('确定要删除这个文件吗？（仅从本列表移除，不会删除 GitHub 上的文件）')) return;

        this.files = this.files.filter(f => f.id !== fileId);
        this.saveFiles();
        this.renderGallery();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new FileBed();
});
