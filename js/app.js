class ImageBed {
    constructor() {
        this.images = JSON.parse(localStorage.getItem('imageBed_images')) || [];
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

        if (remember) {
            this.githubConfig = { username, repo, token, branch };
            localStorage.setItem('imageBed_github', JSON.stringify(this.githubConfig));
        } else {
            this.githubConfig = { username, repo, token, branch };
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
        const files = e.dataTransfer.files;
        this.processFiles(files);
    }

    handleFileSelect(e) {
        this.processFiles(e.target.files);
        e.target.value = '';
    }

    processFiles(files) {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('请选择有效的图片文件');
            return;
        }

        if (this.githubConfig.username) {
            // Upload to GitHub
            this.uploadToGithub(imageFiles);
        } else {
            // Local only
            this.uploadLocal(imageFiles);
        }
    }

    uploadLocal(imageFiles) {
        this.progressContainer.style.display = 'block';
        let uploadedCount = 0;

        imageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedCount++;
                this.images.unshift({
                    id: this.generateId(),
                    name: file.name,
                    src: e.target.result,
                    size: file.size,
                    timestamp: new Date().getTime(),
                    type: file.type,
                    isLocal: true
                });

                const progress = Math.round((uploadedCount / imageFiles.length) * 100);
                document.getElementById('progressFill').style.width = progress + '%';
                document.getElementById('progressText').textContent = `上传进度: ${progress}%`;

                if (uploadedCount === imageFiles.length) {
                    this.saveImages();
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

    async uploadToGithub(imageFiles) {
        this.progressContainer.style.display = 'block';
        let uploadedCount = 0;

        for (const file of imageFiles) {
            try {
                document.getElementById('progressText').textContent = `上传中: ${file.name}...`;
                const githubUrl = await this.uploadFileToGithub(file);
                
                uploadedCount++;
                this.images.unshift({
                    id: this.generateId(),
                    name: file.name,
                    src: githubUrl,
                    githubUrl: githubUrl,
                    size: file.size,
                    timestamp: new Date().getTime(),
                    type: file.type,
                    isLocal: false
                });

                const progress = Math.round((uploadedCount / imageFiles.length) * 100);
                document.getElementById('progressFill').style.width = progress + '%';
                document.getElementById('progressText').textContent = `上传进度: ${progress}%`;
            } catch (error) {
                console.error(`上传 ${file.name} 失败:`, error);
                alert(`上传 ${file.name} 失败: ${error.message}`);
            }
        }

        if (uploadedCount > 0) {
            this.saveImages();
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
        const filename = `${timestamp}_${file.name}`;
        const path = `images/${filename}`;

        // Convert file to base64
        const base64Content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Upload to GitHub via API
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

        // Generate GitHub Pages URL
        const githubUrl = `https://${username}.github.io/${repo}/${path}`;
        return githubUrl;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveImages() {
        localStorage.setItem('imageBed_images', JSON.stringify(this.images));
    }

    getFilteredImages() {
        let filtered = this.images;

        // Search
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(img => 
                img.name.toLowerCase().includes(searchTerm)
            );
        }

        // Sort
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
        const images = this.getFilteredImages();
        
        if (images.length === 0) {
            this.gallery.style.display = 'none';
            this.emptyState.style.display = 'block';
            return;
        }

        this.gallery.style.display = 'grid';
        this.emptyState.style.display = 'none';
        this.gallery.innerHTML = '';

        images.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${image.src}" alt="${image.name}">
                <div class="gallery-overlay">
                    <div class="overlay-actions">
                        <button class="overlay-btn" data-id="${image.id}" data-action="preview" title="预览">👁️</button>
                        <button class="overlay-btn" data-id="${image.id}" data-action="copy" title="复制链接">📋</button>
                        <button class="overlay-btn" data-id="${image.id}" data-action="delete" title="删除">🗑️</button>
                    </div>
                </div>
            `;

            const buttons = item.querySelectorAll('.overlay-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const imageId = btn.dataset.id;
                    this.handleImageAction(imageId, action);
                });
            });

            this.gallery.appendChild(item);
        });
    }

    handleImageAction(imageId, action) {
        const image = this.images.find(img => img.id === imageId);
        if (!image) return;

        switch (action) {
            case 'preview':
                this.showPreview(image);
                break;
            case 'copy':
                this.copyImageUrl(image);
                break;
            case 'delete':
                this.deleteImage(imageId);
                break;
        }
    }

    showPreview(image) {
        document.getElementById('previewImage').src = image.src;
        document.getElementById('imageName').textContent = image.name;
        
        // Show GitHub URL if available
        if (image.githubUrl) {
            document.getElementById('imageUrl').style.display = 'block';
            document.getElementById('imageUrlValue').textContent = image.githubUrl;
            document.getElementById('openGithub').style.display = 'inline-block';
            document.getElementById('openGithub').onclick = () => window.open(image.githubUrl, '_blank');
        } else {
            document.getElementById('imageUrl').style.display = 'none';
            document.getElementById('openGithub').style.display = 'none';
        }
        
        document.getElementById('copyMarkdown').onclick = () => this.copyMarkdownLink(image);
        document.getElementById('copyUrl').onclick = () => this.copyImageUrl(image);
        document.getElementById('deleteImage').onclick = () => {
            this.deleteImage(image.id);
            this.closePreviewModal();
        };

        this.previewModal.style.display = 'flex';
    }

    closePreviewModal() {
        this.previewModal.style.display = 'none';
    }

    copyMarkdownLink(image) {
        const markdown = `![${image.name}](${image.src})`;
        this.copyToClipboard(markdown, 'Markdown链接已复制！');
    }

    copyImageUrl(image) {
        const url = image.githubUrl || image.src;
        this.copyToClipboard(url, '图片链接已复制！');
    }

    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            alert(message);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    }

    deleteImage(imageId) {
        if (!confirm('确定要删除这张图片吗？')) return;
        
        this.images = this.images.filter(img => img.id !== imageId);
        this.saveImages();
        this.renderGallery();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ImageBed();
});
