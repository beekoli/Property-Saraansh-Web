@echo off
echo =====================================================
echo  Property Saraansh - Push videos.ts update
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/5] Removing git lock file (if any)...
if exist ".git\index.lock" del /f ".git\index.lock"

echo.
echo [2/5] Stashing all local changes...
git stash
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git stash failed.
    pause
    exit /b 1
)

echo.
echo [3/5] Pulling latest from GitHub...
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git pull failed.
    git stash pop
    pause
    exit /b 1
)

echo.
echo [4/5] Restoring local changes...
git stash pop
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: stash pop had conflicts. Continuing...
)

echo.
echo [5/5] Committing and pushing videos.ts...
git add src/lib/videos.ts
git commit -m "seo: update Gaur Chrysalis -- optimized title, description, full content and focus keyword"
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git push failed.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Done! Vercel deploying in ~1-2 minutes.
echo  https://propertysaraansh.com/our-videos/gaurs-yamuna-expressway-launch-review
echo =====================================================
pause
