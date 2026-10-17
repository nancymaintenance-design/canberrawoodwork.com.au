@echo off
cd /d "%~dp0"
if not exist node_modules\typescript\package.json call npm ci --ignore-scripts
call npm run admin
pause
