@echo off
echo =====================================================
echo  Top 3 Self-Use Projects -- pull-rebase then push
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/3] Removing git lock files (if any)...
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\rebase-merge" rmdir /s /q ".git\rebase-merge"

echo.
echo [2/3] Staging and committing videos.ts...
git add src/lib/videos.ts
git commit -m "seo: Top 3 Self-Use Projects Noida Expressway -- update title, description, content, focusKeyword"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git commit failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Pull with rebase then push...
git pull origin main --rebase
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git pull rebase failed.
    pause
    exit /b 1
)
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git push failed.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Done! Vercel deploying in ~1-2 minutes.
echo  https://propertysaraansh.com/our-videos/top-3-self-use-projects-noida-expressway
echo =====================================================
pause
