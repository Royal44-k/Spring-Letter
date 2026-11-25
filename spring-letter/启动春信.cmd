@echo off
chcp 65001 >nul
cd /d "%~dp0"
if exist "D:\NodeJS\node.exe" (
  set "SPRING_NODE=D:\NodeJS\node.exe"
) else (
  set "SPRING_NODE=node"
)
"%SPRING_NODE%" --version >nul 2>nul
if errorlevel 1 (
  echo 未找到可用的 Node.js，花庭服务尚未启动。
  echo 请从 https://nodejs.org/ 安装免费 Node.js，重新打开本启动器。
  echo 若不希望安装运行时，可使用本作品部署后的浏览器静态版。
  pause
  exit /b 1
)
echo 花漾年华：待寄出的春信
echo 正在打开本机花庭。首次启动时，请保持服务窗口开启。
echo 若提示已复用同版服务，可以关闭本窗口。
"%SPRING_NODE%" scripts\serve.cjs --open
pause
