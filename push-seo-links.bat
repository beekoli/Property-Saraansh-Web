@echo off
echo =====================================================
echo  Push: video redirect + clickable cross-links -> main
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

echo [3/4] Staging ONLY the two intended files...
git add "src/app/our-videos/[slug]/page.tsx" "src/lib/videos.ts"
echo Staged files:
git diff --cached --name-only
echo.
echo Sanity checks:
powershell -Command "Select-String -Path 'src\app\our-videos\[slug]\page.tsx' -Pattern 'renderRichText|permanentRedirect' | Select-Object -First 3"
powershell -Command "Select-String -Path 'src\lib\videos.ts' -Pattern 'ace-arte-sector-150-noida'"
echo.

echo [4/4] Commit + push...
git commit -m "seo: video watch page 308-redirect + clickable blog/listing cross-links (Sector 150)"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! Vercel rebuilds in ~1-2 min.
echo  Video page now links to blog + listing; ugly URLs 308-redirect.
echo =====================================================
pause
