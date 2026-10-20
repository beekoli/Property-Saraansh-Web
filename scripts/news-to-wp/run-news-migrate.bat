@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   Property Saraansh - ONE-TIME: tag existing news by city
echo ============================================================
echo.
echo   Adds "Noida News" or "Pune News" to every existing news
echo   post so it appears on /noida-news or /pune-news.
echo   Safe to run more than once (skips already-tagged posts).
echo.
if not exist node_modules (
  echo Installing dependencies the first time...
  call npm install
  echo.
)
echo Running migration... (output is also saved to last-run.log)
echo.
node create-news-drafts.js --migrate-cities > last-run.log 2>&1
type last-run.log
echo.
echo ------------------------------------------------------------
echo Full log saved to last-run.log
pause
