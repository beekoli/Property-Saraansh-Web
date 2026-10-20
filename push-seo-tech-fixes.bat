@echo off
echo =====================================================
echo  SEO tech fixes: property robots meta + video og:type
echo =====================================================
echo.
cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/4] Removing lock files...
del /f ".git\index.lock" 2>nul
git rebase --abort 2>nul
git merge --abort 2>nul
echo.

echo [2/4] On main + up to date...
git checkout main
git pull origin main --no-edit
if %ERRORLEVEL% NEQ 0 ( echo ERROR: pull failed. & pause & exit /b 1 )
echo.

echo [3/4] Stage the two files...
git add "src/app/properties/[slug]/page.tsx" "src/app/our-videos/[slug]/page.tsx"
git diff --cached --name-only
echo.
powershell -Command "Select-String -Path 'src\app\properties\[slug]\page.tsx' -Pattern 'metadata.robots'"
powershell -Command "Select-String -Path 'src\app\our-videos\[slug]\page.tsx' -Pattern 'video.other'"
echo.

echo [4/4] Commit + push...
git commit -m "seo: add robots meta to property pages + og:type video.other on watch pages"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! Vercel rebuilds in ~1-2 min.
echo =====================================================
pause
