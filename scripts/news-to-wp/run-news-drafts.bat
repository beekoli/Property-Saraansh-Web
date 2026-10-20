@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   Property Saraansh - Daily News to WordPress drafts
echo ============================================================
echo.
if not exist node_modules (
  echo Installing dependencies the first time...
  call npm install
  echo.
)
echo Running... (output is also saved to last-run.log)
echo.
node create-news-drafts.js %* > last-run.log 2>&1
type last-run.log
echo.
echo ------------------------------------------------------------
echo Full log saved to last-run.log
pause
