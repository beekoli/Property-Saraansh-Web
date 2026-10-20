@echo off
echo =====================================================
echo  Blog video gate: sync to origin, re-apply, push
echo =====================================================
echo.
cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/5] Removing lock files...
del /f ".git\index.lock" 2>nul
git rebase --abort 2>nul
git merge --abort 2>nul
echo.

echo [2/5] Fetch + hard reset to origin/main (discards local page.tsx edit)...
git fetch origin main
git checkout main
git reset --hard origin/main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: reset failed. & pause & exit /b 1 )
git log --oneline -1
echo.

echo [3/5] Re-apply the video-gate patch...
python fix-blog-video.py
if %ERRORLEVEL% NEQ 0 ( echo ERROR: patch failed. & pause & exit /b 1 )
echo.
powershell -Command "(Select-String -Path 'src\app\blog\[slug]\page.tsx' -Pattern 'hasVideo' -AllMatches).Matches.Count"
echo.

echo [4/5] Commit...
git commit -a -m "blog: render video section only when a real video is set (remove generic fallback video)"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
echo.

echo [5/5] Push...
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! Vercel rebuilds in ~1-2 min.
echo  Blogs without a real video no longer show a video section.
echo =====================================================
pause
