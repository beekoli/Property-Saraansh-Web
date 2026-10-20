@echo off
echo =====================================================
echo  Push canonical 308-redirect for watch pages -> main
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

echo [2/4] Making sure we are on main and up to date...
git checkout main
git pull origin main --no-edit
if %ERRORLEVEL% NEQ 0 ( echo ERROR: pull failed. & pause & exit /b 1 )
echo.

echo [3/4] Showing what changed...
git status --short
echo.
echo permanentRedirect present in page.tsx:
powershell -Command "Select-String -Path 'src\app\our-videos\[slug]\page.tsx' -Pattern 'permanentRedirect'"
echo.

echo [4/4] Commit and push...
git add "src/app/our-videos/[slug]/page.tsx"
git commit -m "feat: 308-redirect non-canonical video slugs to clean slug (fixes duplicate watch-page URLs)"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! Ugly video URLs now 308-redirect to clean slug.
echo  Vercel rebuilds in ~1-2 min.
echo =====================================================
pause
