@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   Property Saraansh - Remove duplicate news posts
echo ============================================================
echo.
echo   Keeps the best copy of each story (published, with cover)
echo   and moves duplicates to Trash (recoverable for 30 days).
echo.
echo   Showing a PREVIEW first (no changes)...
echo.
if not exist node_modules (
  echo Installing dependencies the first time...
  call npm install
  echo.
)
node create-news-drafts.js --dedup --dry-run
echo.
echo ------------------------------------------------------------
choice /c YN /n /m "Remove the duplicates shown above? Press Y to proceed, N to cancel: "
if errorlevel 2 (
  echo.
  echo Cancelled - nothing was changed.
  pause
  exit /b
)
echo.
echo Removing duplicates... (output also saved to last-run.log)
echo.
node create-news-drafts.js --dedup > last-run.log 2>&1
type last-run.log
echo.
echo ------------------------------------------------------------
echo Done. Removed posts are in wp-admin -^> Posts -^> Trash.
pause
