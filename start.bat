@echo off
REM GitHub 图床本地测试脚本 (Windows)

echo 🚀 启动图床应用...
echo.
echo 📋 项目配置：
echo   - Python HTTP Server: http://localhost:8000
echo.
echo 🎯 使用步骤：
echo   1. 配置 GitHub (参考 GITHUB_SETUP.md)
echo   2. 上传图片
echo   3. 访问 GitHub 查看上传结果
echo.
echo 📝 按 Ctrl+C 停止服务器
echo.

python -m http.server 8000
pause
