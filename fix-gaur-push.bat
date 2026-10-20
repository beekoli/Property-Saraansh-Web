@echo off
echo =====================================================
echo  Fix Gaur Chrysalis -- clean push (no stash/pull)
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/3] Removing git lock file (if any)...
if exist ".git\index.lock" del /f ".git\index.lock"

echo.
echo [2/3] Staging and committing clean videos.ts...
git add src/lib/videos.ts
git commit -m "fix: resolve conflict markers -- clean Gaur Chrysalis SEO update (title, description, content, focusKeyword)"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git commit failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Pushing to GitHub...
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
