@echo off
cd /d "%~dp0"
echo Pushing the /news section to GitHub (Vercel will auto-deploy)...
if exist ".git\index.lock" del /f ".git\index.lock"
git push origin main
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Push failed - check internet / GitHub login, then run this again.
  pause
  exit /b 1
)
echo.
echo SUCCESS. Vercel builds in ~1-2 min. Then open:
echo https://www.propertysaraansh.com/news
pause
