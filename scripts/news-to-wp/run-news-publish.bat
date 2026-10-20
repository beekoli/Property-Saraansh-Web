@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   Property Saraansh - Daily News - PUBLISH LIVE
echo ============================================================
echo.
echo   WARNING: this posts today's news straight to the LIVE
echo   site (www.propertysaraansh.com/news), skipping drafts.
echo.
if not exist node_modules (
  echo Installing dependencies the first time...
  call npm install
  echo.
)
echo Running in PUBLISH mode... (output is also saved to last-run.log)
echo.
node create-news-drafts.js --publish > last-run.log 2>&1
type last-run.log
echo.
echo ------------------------------------------------------------
echo Full log saved to last-run.log
pause
