@echo off
echo =====================================================
echo  Add Rise ^& Fall of Supertech video to videos.ts + push main
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

echo [2/5] Fetch + hard reset to origin/main...
git fetch origin main
git checkout main
git reset --hard origin/main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: reset failed. & pause & exit /b 1 )
git log --oneline -1
echo.

echo [3/5] Insert the video entry...
python add-supertech-video.py
if %ERRORLEVEL% NEQ 0 ( echo ERROR: insert failed. & pause & exit /b 1 )
echo.
echo Verify entry present:
powershell -Command "Select-String -Path 'src\lib\videos.ts' -Pattern 'rise-and-fall-of-supertech-twin-towers'"
echo.

echo [4/5] Commit...
git commit -a -m "our-videos: add Rise and Fall of Supertech watch page"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
echo.

echo [5/5] Push...
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! Vercel rebuilds in ~1-2 min.
echo  Watch page: /our-videos/rise-and-fall-of-supertech-twin-towers
echo =====================================================
pause
