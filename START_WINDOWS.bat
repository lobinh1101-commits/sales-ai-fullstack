@echo off
cd /d "%~dp0"
if not exist .env copy .env.example .env
where docker >nul 2>nul
if errorlevel 1 (
  echo Docker Desktop chua duoc cai hoac chua chay.
  pause
  exit /b 1
)
docker compose up --build
pause
